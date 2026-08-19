// src/lib/email/nodemailer.ts
import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST!;
const port = Number(process.env.SMTP_PORT || 465);
const user = process.env.SMTP_USER!;
const pass = process.env.SMTP_PASS!;
const from = process.env.FROM_EMAIL!;

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465, // true for 465, false for 587
  auth: { user, pass },
});

type Member = {
  name: string | null;
  usn: string | null;
  email: string | null;
  phone_number: string | null;
  section: "A" | "B" | null;
  github_profile: string | null;
  linkedin_profile: string | null;
  role: "Leader" | "Member";
};

// src/lib/email/nodemailer.ts (replace only the function below)
export async function sendRegistrationEmailGmail(
  to: string,
  teamName: string,
  members: Member[]
) {
  const memberRowsHtml = members
    .map(
      (m) => `
        <tr>
          <td style="padding:10px 8px;border:1px solid #eaeaea;font-size:14px;">${
            m.role || ""
          }</td>
          <td style="padding:10px 8px;border:1px solid #eaeaea;font-size:14px;">${
            m.name || ""
          }</td>
          <td style="padding:10px 8px;border:1px solid #eaeaea;font-size:14px;">${
            m.usn || ""
          }</td>
          <td style="padding:10px 8px;border:1px solid #eaeaea;font-size:14px;">${
            m.section || ""
          }</td>
          <td style="padding:10px 8px;border:1px solid #eaeaea;font-size:14px;">${
            m.email || ""
          }</td>
          <td style="padding:10px 8px;border:1px solid #eaeaea;font-size:14px;">${
            m.phone_number || ""
          }</td>
          <td style="padding:10px 8px;border:1px solid #eaeaea;font-size:14px;">${
            m.github_profile || ""
          }</td>
          <td style="padding:10px 8px;border:1px solid #eaeaea;font-size:14px;">${
            m.linkedin_profile || ""
          }</td>
        </tr>`
    )
    .join("");

  const memberLinesText = members
    .map((m) => {
      const parts = [
        m.role ? `Role: ${m.role}` : null,
        m.name ? `Name: ${m.name}` : null,
        m.usn ? `USN: ${m.usn}` : null,
        m.section ? `Section: ${m.section}` : null,
        m.email ? `Email: ${m.email}` : null,
        m.phone_number ? `Phone: ${m.phone_number}` : null,
        m.github_profile ? `GitHub: ${m.github_profile}` : null,
        m.linkedin_profile ? `LinkedIn: ${m.linkedin_profile}` : null,
      ].filter(Boolean);
      return `- ${parts.join(" | ")}`;
    })
    .join("\n");

  // Event metadata (static for this edition)
  const eventName = "AlgoVibe 2025";
  const eventDate = "Wednesday, 20 August 2025";
  const eventTagline = "Code. Create. Compete.";
  const brandColor = "#2563eb"; // a clean blue accent

  const preheader = `Your team "${teamName}" is confirmed for ${eventName} on ${eventDate}. See details inside.`;

  const html = `
  <!doctype html>
  <html lang="en">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>${eventName} — Registration Confirmed</title>
      <style>
        /* Prefer inline styles for email clients; minimal embedded styles only */
        @media (prefers-color-scheme: dark) {
          .card { background: #0b1220 !important; color: #e5e7eb !important; }
          .muted { color: #9ca3af !important; }
          .divider { border-color: #1f2937 !important; }
        }
      </style>
    </head>
    <body style="margin:0;padding:0;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif;color:#111;">
      <!-- Preheader (hidden) -->
      <div style="display:none;visibility:hidden;opacity:0;overflow:hidden;height:0;width:0;mso-hide:all;">
        ${preheader}
      </div>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" style="padding:32px 12px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="640" style="max-width:640px;width:100%;">
              <!-- Header -->
              <tr>
                <td style="text-align:center;padding-bottom:16px;">
                  <div style="font-size:12px;letter-spacing:1.2px;text-transform:uppercase;color:#6b7280;">
                    ${eventName}
                  </div>
                  <h1 style="margin:8px 0 0 0;font-size:24px;line-height:1.3;">
                    🎉 Registration Confirmed
                  </h1>
                  <div class="muted" style="font-size:14px;color:#6b7280;margin-top:6px;">
                    ${eventTagline}
                  </div>
                </td>
              </tr>

              <!-- Card -->
              <tr>
                <td class="card" style="background:#ffffff;border:1px solid #eaeaea;border-radius:12px;padding:24px;">
                  <!-- Intro -->
                  <p style="margin:0 0 12px 0;font-size:16px;">
                    Hello, and congratulations! Your team <strong>${teamName}</strong> is all set for <strong>${eventName}</strong>. ✅
                  </p>

                  <!-- Event facts -->
                  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top:8px;">
                    <tr>
                      <td style="padding:8px 0;font-size:15px;">📅 <strong>Date:</strong> ${eventDate}</td>
                    </tr>
                    <tr>
                      <td style="padding:2px 0 12px 0;font-size:13px;color:#6b7280;">
                        Detailed schedule, reporting time, and guidelines will be shared soon.
                      </td>
                    </tr>
                  </table>

                  <!-- Divider -->
                  <hr class="divider" style="border:none;border-top:1px solid #eaeaea;margin:12px 0 16px 0;"/>

                  <!-- Team table -->
                  <h3 style="margin:0 0 8px 0;font-size:16px;">👥 Team Details</h3>
                  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                    <thead>
                      <tr>
                        <th align="left" style="padding:10px 8px;border:1px solid #eaeaea;background:#f8fafc;font-size:13px;">Role</th>
                        <th align="left" style="padding:10px 8px;border:1px solid #eaeaea;background:#f8fafc;font-size:13px;">Name</th>
                        <th align="left" style="padding:10px 8px;border:1px solid #eaeaea;background:#f8fafc;font-size:13px;">USN</th>
                        <th align="left" style="padding:10px 8px;border:1px solid #eaeaea;background:#f8fafc;font-size:13px;">Section</th>
                        <th align="left" style="padding:10px 8px;border:1px solid #eaeaea;background:#f8fafc;font-size:13px;">Email</th>
                        <th align="left" style="padding:10px 8px;border:1px solid #eaeaea;background:#f8fafc;font-size:13px;">Phone</th>
                        <th align="left" style="padding:10px 8px;border:1px solid #eaeaea;background:#f8fafc;font-size:13px;">GitHub</th>
                        <th align="left" style="padding:10px 8px;border:1px solid #eaeaea;background:#f8fafc;font-size:13px;">LinkedIn</th>
                      </tr>
                    </thead>
                    <tbody>${memberRowsHtml}</tbody>
                  </table>

                  <!-- Divider -->
                  <hr class="divider" style="border:none;border-top:1px solid #eaeaea;margin:16px 0;"/>

                  <!-- Next steps -->
                  <h3 style="margin:0 0 8px 0;font-size:16px;">🧭 Next Steps</h3>
                  <ul style="margin:0 0 8px 18px;padding:0;font-size:14px;line-height:1.6;">
                    <li>Ensure all team members can access their registered emails on event day.</li>
                    <li>Warm up with practice problems and finalize your collaboration plan.</li>
                  </ul>

                  <!-- Help -->
                  <p class="muted" style="margin:12px 0 0 0;font-size:13px;color:#6b7280;">
                    If any detail above is incorrect, simply reply to this email and share the correction. We’ll update your record.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="text-align:center;padding:14px 8px;color:#6b7280;font-size:12px;">
                  © ${new Date().getFullYear()} ${eventName}. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;

  const text = [
    `Registration Confirmed — ${eventName}`,
    ``,
    `Team: ${teamName}`,
    `Date: ${eventDate}`,
    ``,
    `Team Details:`,
    memberLinesText || "- (no members found)",
    ``,
    `Next Steps:`,
    `- Ensure all members can access their registered emails on event day.`,
    `- Practice and finalize your collaboration plan.`,
    ``,
    `If any detail is incorrect, reply to this email and we’ll fix it.`,
  ].join("\n");

  await transporter.sendMail({
    from: `AlgoVibe 2025 <${from}>`,
    to,
    subject: `🎉 ${eventName} — Registration Confirmed for "${teamName}" (📅 20 Aug 2025)`,
    html,
    text,
  });
}
