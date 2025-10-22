// src/app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import type {
  RegistrationData,
  RegistrationInsert,
  TeamMember,
} from "@/types/registration";
import { registerTeam } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/client";
import { sendRegistrationEmailGmail } from "@/lib/email/nodemailer";

export async function POST(request: NextRequest) {
  const supabase = createClient();

  try {
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Content type must be application/json" },
        { status: 415 }
      );
    }

    const body = (await request.json()) as RegistrationData;

    // Basic validation
    if (!body?.teamName?.trim()) {
      return NextResponse.json(
        { error: "teamName is required" },
        { status: 400 }
      );
    }
    if (!body?.teamPassword?.trim()) {
      return NextResponse.json(
        { error: "teamPassword is required" },
        { status: 400 }
      );
    }
    if (!Array.isArray(body?.teamMembers)) {
      return NextResponse.json(
        { error: "teamMembers must be an array" },
        { status: 400 }
      );
    }
    if (body.teamMembers.length < 2 || body.teamMembers.length > 3) {
      return NextResponse.json(
        { error: "Team must have 2 to 3 members" },
        { status: 400 }
      );
    }

    const allowedRoles = new Set(["Leader", "Member"]);
    let leaderCount = 0;
    for (let i = 0; i < body.teamMembers.length; i++) {
      const m = body.teamMembers[i] as TeamMember;
      if (!m?.name?.trim()) {
        return NextResponse.json(
          { error: `member[${i}] name is required` },
          { status: 400 }
        );
      }
      if (!allowedRoles.has(m.role)) {
        return NextResponse.json(
          { error: `member[${i}] role must be Leader or Member` },
          { status: 400 }
        );
      }
      if (m.role === "Leader") leaderCount++;
      if (m.section && m.section !== "A" && m.section !== "B") {
        return NextResponse.json(
          { error: `member[${i}] section must be A or B` },
          { status: 400 }
        );
      }
      if (
        m.github_profile &&
        !/^https?:\/\/(www\.)?github\.com\/.+$/i.test(m.github_profile.trim())
      ) {
        return NextResponse.json(
          { error: `member[${i}] github_profile must be a valid GitHub URL` },
          { status: 400 }
        );
      }
      if (
        m.linkedin_profile &&
        !/^https?:\/\/(www\.)?linkedin\.com\/in\/.+$/i.test(
          m.linkedin_profile.trim()
        )
      ) {
        return NextResponse.json(
          {
            error: `member[${i}] linkedin_profile must be a valid LinkedIn URL`,
          },
          { status: 400 }
        );
      }
    }
    if (leaderCount !== 1) {
      return NextResponse.json(
        { error: "Exactly one Leader is required" },
        { status: 400 }
      );
    }

    // Phone checks (10-digit numbers)
    const phone10 = /^\d{10}$/;
    const leaderIdx = body.teamMembers.findIndex((m) => m.role === "Leader");
    const leader =
      leaderIdx >= 0 ? (body.teamMembers[leaderIdx] as TeamMember) : null;
    if (
      !leader?.phone_number?.trim() ||
      !phone10.test(leader.phone_number.trim())
    ) {
      return NextResponse.json(
        { error: "Leader phone number must be 10 digits" },
        { status: 400 }
      );
    }
    for (let i = 0; i < body.teamMembers.length; i++) {
      const m = body.teamMembers[i];
      if (m.role === "Member") {
        const active =
          m.name || m.usn || m.email || m.section || m.phone_number;
        if (
          active &&
          (!m.phone_number?.trim() || !phone10.test(m.phone_number.trim()))
        ) {
          return NextResponse.json(
            { error: `Member ${i} phone number must be 10 digits` },
            { status: 400 }
          );
        }
      }
    }

    // No duplicate emails within the same team
    const emails = body.teamMembers
      .map((m) => (m.email ? m.email.toLowerCase().trim() : ""))
      .filter(Boolean);
    const hasDupEmail = emails.some((e, idx) => e && emails.indexOf(e) !== idx);
    if (hasDupEmail) {
      return NextResponse.json(
        { error: "Duplicate email addresses found" },
        { status: 400 }
      );
    }

    // Duplicate USN within payload (case-insensitive)
    const incomingUsns = body.teamMembers
      .map((m) => (m.usn ? m.usn.trim().toUpperCase() : ""))
      .filter(Boolean);
    const hasDupUsnLocal = incomingUsns.some(
      (u, idx) => incomingUsns.indexOf(u) !== idx
    );
    if (hasDupUsnLocal) {
      return NextResponse.json(
        { error: "Duplicate USN detected in this submission" },
        { status: 400 }
      );
    }

    // USN uniqueness in DB (case-insensitive) with count+head
    for (const m of body.teamMembers) {
      if (!m.usn) continue;
      const { count, error: usnErr } = await supabase
        .from("members")
        .select("member_id", { head: true, count: "exact" })
        .ilike("usn", m.usn);
      if (usnErr) {
        return NextResponse.json(
          { error: "Failed to validate USN uniqueness" },
          { status: 500 }
        );
      }
      if ((count ?? 0) > 0) {
        return NextResponse.json(
          { error: `USN already registered: ${m.usn.toUpperCase()}` },
          { status: 409 }
        );
      }
    }

    // Uniqueness of team name
    const { data: existingTeam, error: searchError } = await supabase
      .from("teams")
      .select("team_name")
      .eq("team_name", body.teamName.trim())
      .maybeSingle();
    if (searchError) {
      console.error("Team search error:", searchError);
      return NextResponse.json(
        { error: "Error checking team name" },
        { status: 500 }
      );
    }
    if (existingTeam) {
      return NextResponse.json(
        { error: "Team name already exists" },
        { status: 409 }
      );
    }

    // Normalize values and insert, including pass
    const payload: RegistrationInsert = {
      team_name: body.teamName.trim(),
      pass: body.teamPassword.trim(),
      members: body.teamMembers.map((m) => ({
        ...m,
        name: m.name.trim(),
        usn: m.usn ? m.usn.toUpperCase() : undefined,
        email: m.email ? m.email.toLowerCase() : undefined,
        phone_number: m.phone_number ? m.phone_number.trim() : undefined,
        github_profile: m.github_profile ? m.github_profile.trim() : undefined,
        linkedin_profile: m.linkedin_profile
          ? m.linkedin_profile.trim()
          : undefined,
        section: m.section,
      })),
    };

    const { team, members } = await registerTeam(payload);

    // Send confirmation email via Gmail SMTP (non-blocking)
    const to = leader?.email || body.teamMembers.find((m) => m.email)?.email;
    if (to) {
      try {
        await sendRegistrationEmailGmail(to, team.team_name, members as any);
      } catch (e) {
        console.error("Email send failed (Gmail SMTP)", e);
      }
    }

    return NextResponse.json(
      {
        message: "Registration successful",
        teamId: team.team_id,
        teamName: team.team_name,
        members,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
