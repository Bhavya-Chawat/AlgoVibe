// src/components/register/RegistrationForm.tsx
"use client";

import { useState } from "react";
import {
  Users,
  Mail,
  Hash,
  User,
  Loader2,
  Phone,
  Github,
  Linkedin,
  Lock,
} from "lucide-react";
import TeamMemberFields from "./TeamMemberFields";
import FormSuccess from "./FormSuccess";

// Use shared types so API payload stays in sync
import type {
  RegistrationData,
  TeamMember,
  Section,
} from "@/types/registration";

export interface RegistrationFormData {
  // Team
  teamName: string;
  teamPassword: string; // Add this line

  // Leader
  teamLeaderName: string;
  teamLeaderUSN: string;
  teamLeaderEmail: string;
  teamLeaderSection: string;
  teamLeaderPhone: string;
  teamLeaderGithub?: string;
  teamLeaderLinkedin?: string;

  // Member 1 (required)
  member1Name: string;
  member1USN: string;
  member1Email: string;
  member1Section: string;
  member1Phone: string;
  member1Github?: string;
  member1Linkedin?: string;

  // Member 2 (optional)
  member2Name: string;
  member2USN: string;
  member2Email: string;
  member2Section: string;
  member2Phone: string;
  member2Github?: string;
  member2Linkedin?: string;
}

const initialFormData: RegistrationFormData = {
  teamName: "",
  teamPassword: "", // Add this line

  teamLeaderName: "",
  teamLeaderUSN: "",
  teamLeaderEmail: "",
  teamLeaderSection: "",
  teamLeaderPhone: "",
  teamLeaderGithub: "",
  teamLeaderLinkedin: "",

  member1Name: "",
  member1USN: "",
  member1Email: "",
  member1Section: "",
  member1Phone: "",
  member1Github: "",
  member1Linkedin: "",

  member2Name: "",
  member2USN: "",
  member2Email: "",
  member2Section: "",
  member2Phone: "",
  member2Github: "",
  member2Linkedin: "",
};

// Utilities
const endsWithRvce = (email: string) => /@rvce\.edu\.in$/i.test(email.trim());
const anyProvided = (vals: string[]) => vals.some((v) => v.trim().length > 0);
const toSection = (s: string): Section | undefined => {
  const up = s.trim().toUpperCase();
  if (up === "A" || up === "B") return up as Section;
  return undefined;
};

// Map child field -> exact suffix used in RegistrationFormData keys
const fieldToSuffix = (field: string) => {
  switch (field) {
    case "usn":
      return "USN";
    case "email":
      return "Email";
    case "section":
      return "Section";
    case "phone":
      return "Phone";
    case "github":
      return "Github";
    case "linkedin":
      return "Linkedin";
    case "name":
    default:
      return "Name";
  }
};

type FieldErrors = Partial<Record<keyof RegistrationFormData, string>>;

export default function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] =
    useState<RegistrationFormData>(initialFormData);
  const [errors, setErrors] = useState<FieldErrors>({});

  const validateUrl = (v?: string, pattern?: RegExp) =>
    !v?.trim() ? true : !!pattern?.test(v.trim());
  const validatePhone = (v?: string) => /^\d{10}$/.test((v || "").trim());

  const validateForm = (): FieldErrors => {
    const newErrors: FieldErrors = {};

    // Team required
    if (!formData.teamName.trim()) newErrors.teamName = "Team name is required";

    // Team password required
    if (!formData.teamPassword.trim())
      newErrors.teamPassword = "Team password is required"; // Add this line

    // Leader required + A/B + phone required
    if (!formData.teamLeaderName.trim())
      newErrors.teamLeaderName = "Team leader name is required";
    if (!formData.teamLeaderUSN.trim())
      newErrors.teamLeaderUSN = "Team leader USN is required";
    if (!formData.teamLeaderEmail.trim())
      newErrors.teamLeaderEmail = "Team leader email is required";
    else if (!endsWithRvce(formData.teamLeaderEmail))
      newErrors.teamLeaderEmail =
        "Use your RVCE email address (ends with @rvce.edu.in)";
    if (!formData.teamLeaderSection.trim())
      newErrors.teamLeaderSection = "Team leader section is required";
    else if (!toSection(formData.teamLeaderSection))
      newErrors.teamLeaderSection = "Section must be A or B";
    if (!formData.teamLeaderPhone.trim())
      newErrors.teamLeaderPhone = "Phone number is required";
    else if (!validatePhone(formData.teamLeaderPhone))
      newErrors.teamLeaderPhone = "Enter a valid 10-digit phone number";

    // Leader URLs (validate if present)
    if (
      !validateUrl(
        formData.teamLeaderGithub,
        /^https?:\/\/(www\.)?github\.com\/.+$/i
      )
    )
      newErrors.teamLeaderGithub = "Enter a valid GitHub URL";
    if (
      !validateUrl(
        formData.teamLeaderLinkedin,
        /^https?:\/\/(www\.)?linkedin\.com\/in\/.+$/i
      )
    )
      newErrors.teamLeaderLinkedin = "Enter a valid LinkedIn URL";

    // Member 1 is required (all core fields must be present)
    if (!formData.member1Name.trim())
      newErrors.member1Name = "Member 1 name is required";
    if (!formData.member1USN.trim())
      newErrors.member1USN = "Member 1 USN is required";
    if (!formData.member1Email.trim())
      newErrors.member1Email = "Member 1 email is required";
    else if (!endsWithRvce(formData.member1Email))
      newErrors.member1Email = "Member 1 must use @rvce.edu.in email";
    if (!formData.member1Section.trim())
      newErrors.member1Section = "Member 1 section is required";
    else if (!toSection(formData.member1Section))
      newErrors.member1Section = "Member 1 section must be A or B";
    if (!formData.member1Phone.trim())
      newErrors.member1Phone = "Member 1 phone number is required";
    else if (!validatePhone(formData.member1Phone))
      newErrors.member1Phone = "Enter a valid 10-digit phone number";
    // Member 1 URLs optional but validate if present
    if (
      !validateUrl(
        formData.member1Github,
        /^https?:\/\/(www\.)?github\.com\/.+$/i
      )
    )
      newErrors.member1Github = "Enter a valid GitHub URL";
    if (
      !validateUrl(
        formData.member1Linkedin,
        /^https?:\/\/(www\.)?linkedin\.com\/in\/.+$/i
      )
    )
      newErrors.member1Linkedin = "Enter a valid LinkedIn URL";

    // Member 2 optional: if any provided, require all core fields
    const m2 = [
      formData.member2Name,
      formData.member2USN,
      formData.member2Email,
      formData.member2Section,
      formData.member2Phone,
    ];
    const m2On = anyProvided(m2);
    if (m2On) {
      if (!formData.member2Name.trim())
        newErrors.member2Name = "Member 2 name is required";
      if (!formData.member2USN.trim())
        newErrors.member2USN = "Member 2 USN is required";
      if (!formData.member2Email.trim())
        newErrors.member2Email = "Member 2 email is required";
      else if (!endsWithRvce(formData.member2Email))
        newErrors.member2Email = "Member 2 must use @rvce.edu.in email";
      if (!formData.member2Section.trim())
        newErrors.member2Section = "Member 2 section is required";
      else if (!toSection(formData.member2Section))
        newErrors.member2Section = "Member 2 section must be A or B";
      if (!formData.member2Phone.trim())
        newErrors.member2Phone = "Member 2 phone number is required";
      else if (!validatePhone(formData.member2Phone))
        newErrors.member2Phone = "Enter a valid 10-digit phone number";
      if (
        !validateUrl(
          formData.member2Github,
          /^https?:\/\/(www\.)?github\.com\/.+$/i
        )
      )
        newErrors.member2Github = "Enter a valid GitHub URL";
      if (
        !validateUrl(
          formData.member2Linkedin,
          /^https?:\/\/(www\.)?linkedin\.com\/in\/.+$/i
        )
      )
        newErrors.member2Linkedin = "Enter a valid LinkedIn URL";
    }

    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof RegistrationFormData]) {
      const next = { ...errors };
      delete next[name as keyof RegistrationFormData];
      setErrors(next);
    }
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const newErrors = validateForm();
    setErrors(newErrors);

    // Must have Leader + Member 1; Member 2 is optional
    const m1Provided = anyProvided([
      formData.member1Name,
      formData.member1USN,
      formData.member1Email,
      formData.member1Section,
      formData.member1Phone,
    ]);
    const m2Provided = anyProvided([
      formData.member2Name,
      formData.member2USN,
      formData.member2Email,
      formData.member2Section,
      formData.member2Phone,
    ]);

    if (!m1Provided) {
      setIsSubmitting(false);
      setError("Member 1 is required.");
      return;
    }

    // Duplicate email check across all three
    const emails = [
      formData.teamLeaderEmail.trim().toLowerCase(),
      formData.member1Email.trim().toLowerCase(),
      formData.member2Email.trim().toLowerCase(),
    ].filter(Boolean);
    const hasDup = emails.some((e, idx) => e && emails.indexOf(e) !== idx);
    if (hasDup) {
      setIsSubmitting(false);
      setError("Duplicate email addresses found");
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setIsSubmitting(false);
      setError("Please fix the highlighted fields and try again.");
      return;
    }

    // Build members
    const leader: TeamMember = {
      name: formData.teamLeaderName.trim(),
      usn: formData.teamLeaderUSN.trim().toUpperCase(),
      email: formData.teamLeaderEmail.trim().toLowerCase(),
      section: toSection(formData.teamLeaderSection),
      phone_number: formData.teamLeaderPhone.trim(),
      github_profile: formData.teamLeaderGithub?.trim() || undefined,
      linkedin_profile: formData.teamLeaderLinkedin?.trim() || undefined,
      role: "Leader",
    };

    const members: TeamMember[] = [leader];

    // Member 1 (required)
    members.push({
      name: formData.member1Name.trim(),
      usn: formData.member1USN.trim().toUpperCase(),
      email: formData.member1Email.trim().toLowerCase(),
      section: toSection(formData.member1Section),
      phone_number: formData.member1Phone.trim(),
      github_profile: formData.member1Github?.trim() || undefined,
      linkedin_profile: formData.member1Linkedin?.trim() || undefined,
      role: "Member",
    });

    // Member 2 (optional)
    if (m2Provided) {
      members.push({
        name: formData.member2Name.trim(),
        usn: formData.member2USN.trim().toUpperCase(),
        email: formData.member2Email.trim().toLowerCase(),
        section: toSection(formData.member2Section),
        phone_number: formData.member2Phone.trim(),
        github_profile: formData.member2Github?.trim() || undefined,
        linkedin_profile: formData.member2Linkedin?.trim() || undefined,
        role: "Member",
      });
    }

    if (members.length < 2 || members.length > 3) {
      setIsSubmitting(false);
      setError("Team must have 2 to 3 members");
      return;
    }

    // Include teamPassword in payload
    const payload: RegistrationData = {
      teamName: formData.teamName.trim(),
      teamPassword: formData.teamPassword.trim(),
      teamMembers: members,
    };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok)
        throw new Error(json?.error || "Failed to submit registration");
      setIsSuccess(true);
    } catch (err: any) {
      setError(err?.message || "Failed to submit registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the form?")) {
      setFormData(initialFormData);
      setErrors({});
      setError(null);
    }
  };

  // Inline error component with aria-live for announcement
  const InlineError = ({ id, message }: { id: string; message?: string }) => (
    <span
      id={id}
      aria-live="polite"
      className="mt-2 block text-sm text-alert-red"
    >
      {message || ""}
    </span>
  );

  const m1Errors = [
    errors.member1Name,
    errors.member1USN,
    errors.member1Email,
    errors.member1Section,
    errors.member1Phone,
    errors.member1Github,
    errors.member1Linkedin,
  ].filter(Boolean) as string[];

  const m2Errors = [
    errors.member2Name,
    errors.member2USN,
    errors.member2Email,
    errors.member2Section,
    errors.member2Phone,
    errors.member2Github,
    errors.member2Linkedin,
  ].filter(Boolean) as string[];

  if (isSuccess) {
    return (
      <FormSuccess
        teamLeaderName={formData.teamLeaderName}
        onClose={() => {
          setIsSuccess(false);
          setFormData(initialFormData);
          setErrors({});
          setError(null);
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel-strong p-8 md:p-12">
      {/* Banner error */}
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-6 p-4 bg-alert-red/10 border border-alert-red/30 rounded-lg text-alert-red text-sm"
        >
          {error}
        </div>
      )}

      {/* Team Details */}
      <div className="mb-8">
        <label
          htmlFor="teamName"
          className="block text-sm font-semibold text-gray-300 mb-2"
        >
          Team Name <span className="text-alert-red">*</span>
        </label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            id="teamName"
            type="text"
            name="teamName"
            value={formData.teamName}
            onChange={handleChange}
            required
            placeholder="Enter a unique team name"
            className="input-cyber pl-11"
            aria-invalid={!!errors.teamName}
            aria-errormessage={errors.teamName ? "err-teamName" : undefined}
          />
        </div>
        <InlineError id="err-teamName" message={errors.teamName} />
      </div>

      {/* Team Password */}
      <div className="mb-8">
        <label
          htmlFor="teamPassword"
          className="block text-sm font-semibold text-gray-300 mb-2"
        >
          Team Password <span className="text-alert-red">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            id="teamPassword"
            type="password"
            name="teamPassword"
            value={formData.teamPassword}
            onChange={handleChange}
            required
            placeholder="Enter a strong password"
            className="input-cyber pl-11"
            aria-invalid={!!errors.teamPassword}
            aria-errormessage={
              errors.teamPassword ? "err-teamPassword" : undefined
            }
          />
        </div>
        <InlineError id="err-teamPassword" message={errors.teamPassword} />
      </div>

      {/* Leader Section */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-cyber-blue-400/10 border border-cyber-blue-400/30 flex items-center justify-center">
            <Users className="w-5 h-5 text-cyber-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Team Leader Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label
              htmlFor="teamLeaderName"
              className="block text-sm font-semibold text-gray-300 mb-2"
            >
              Full Name <span className="text-alert-red">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                id="teamLeaderName"
                type="text"
                name="teamLeaderName"
                value={formData.teamLeaderName}
                onChange={handleChange}
                required
                placeholder="Enter full name"
                className="input-cyber pl-11"
                aria-invalid={!!errors.teamLeaderName}
                aria-errormessage={
                  errors.teamLeaderName ? "err-teamLeaderName" : undefined
                }
              />
            </div>
            <InlineError
              id="err-teamLeaderName"
              message={errors.teamLeaderName}
            />
          </div>

          {/* USN */}
          <div>
            <label
              htmlFor="teamLeaderUSN"
              className="block text-sm font-semibold text-gray-300 mb-2"
            >
              USN <span className="text-alert-red">*</span>
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                id="teamLeaderUSN"
                type="text"
                name="teamLeaderUSN"
                value={formData.teamLeaderUSN}
                onChange={handleChange}
                required
                placeholder="1RV21CS001"
                className="input-cyber pl-11"
                aria-invalid={!!errors.teamLeaderUSN}
                aria-errormessage={
                  errors.teamLeaderUSN ? "err-teamLeaderUSN" : undefined
                }
              />
            </div>
            <InlineError
              id="err-teamLeaderUSN"
              message={errors.teamLeaderUSN}
            />
          </div>

          {/* RVCE Email */}
          <div>
            <label
              htmlFor="teamLeaderEmail"
              className="block text-sm font-semibold text-gray-300 mb-2"
            >
              RVCE Email ID <span className="text-alert-red">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                id="teamLeaderEmail"
                type="email"
                name="teamLeaderEmail"
                value={formData.teamLeaderEmail}
                onChange={handleChange}
                required
                placeholder="student@rvce.edu.in"
                pattern=".+@rvce\.edu\.in"
                className="input-cyber pl-11"
                aria-invalid={!!errors.teamLeaderEmail}
                aria-errormessage={
                  errors.teamLeaderEmail ? "err-teamLeaderEmail" : undefined
                }
              />
            </div>
            <InlineError
              id="err-teamLeaderEmail"
              message={errors.teamLeaderEmail}
            />
          </div>

          {/* Section radios */}
          <div>
            <span className="block text-sm font-semibold text-gray-300 mb-2">
              Section <span className="text-alert-red">*</span>
            </span>
            <div className="flex flex-wrap items-center gap-6">
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="teamLeaderSection"
                  value="A"
                  checked={formData.teamLeaderSection === "A"}
                  onChange={handleChange}
                  required
                />
                <span className="text-gray-300">A</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="teamLeaderSection"
                  value="B"
                  checked={formData.teamLeaderSection === "B"}
                  onChange={handleChange}
                  required
                />
                <span className="text-gray-300">B</span>
              </label>
            </div>
            <InlineError
              id="err-teamLeaderSection"
              message={errors.teamLeaderSection}
            />
          </div>

          {/* Phone (required) */}
          <div>
            <label
              htmlFor="teamLeaderPhone"
              className="block text-sm font-semibold text-gray-300 mb-2"
            >
              Phone <span className="text-alert-red">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                id="teamLeaderPhone"
                type="tel"
                name="teamLeaderPhone"
                value={formData.teamLeaderPhone}
                onChange={handleChange}
                required
                placeholder="10-digit number"
                className="input-cyber pl-11"
                aria-invalid={!!errors.teamLeaderPhone}
                aria-errormessage={
                  errors.teamLeaderPhone ? "err-teamLeaderPhone" : undefined
                }
              />
            </div>
            <InlineError
              id="err-teamLeaderPhone"
              message={errors.teamLeaderPhone}
            />
          </div>

          {/* GitHub (not required) */}
          <div>
            <label
              htmlFor="teamLeaderGithub"
              className="block text-sm font-semibold text-gray-300 mb-2"
            >
              GitHub
            </label>
            <div className="relative">
              <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                id="teamLeaderGithub"
                type="url"
                name="teamLeaderGithub"
                value={formData.teamLeaderGithub}
                onChange={handleChange}
                placeholder="https://github.com/username"
                className="input-cyber pl-11"
                aria-invalid={!!errors.teamLeaderGithub}
                aria-errormessage={
                  errors.teamLeaderGithub ? "err-teamLeaderGithub" : undefined
                }
              />
            </div>
            <InlineError
              id="err-teamLeaderGithub"
              message={errors.teamLeaderGithub}
            />
          </div>

          {/* LinkedIn (not required) */}
          <div className="md:col-span-2">
            <label
              htmlFor="teamLeaderLinkedin"
              className="block text-sm font-semibold text-gray-300 mb-2"
            >
              LinkedIn
            </label>
            <div className="relative">
              <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                id="teamLeaderLinkedin"
                type="url"
                name="teamLeaderLinkedin"
                value={formData.teamLeaderLinkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
                className="input-cyber pl-11"
                aria-invalid={!!errors.teamLeaderLinkedin}
                aria-errormessage={
                  errors.teamLeaderLinkedin
                    ? "err-teamLeaderLinkedin"
                    : undefined
                }
              />
            </div>
            <InlineError
              id="err-teamLeaderLinkedin"
              message={errors.teamLeaderLinkedin}
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="relative my-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 text-sm text-gray-500 glass-panel py-2">
            Team Members (Member 1 required, Member 2 optional)
          </span>
        </div>
      </div>

      {/* Member 1 (required star on all core fields, not on GitHub/LinkedIn) */}
      <TeamMemberFields
        memberNumber={1}
        formData={{
          name: formData.member1Name,
          usn: formData.member1USN,
          email: formData.member1Email,
          section: formData.member1Section,
          phone: formData.member1Phone,
          github: formData.member1Github,
          linkedin: formData.member1Linkedin,
        }}
        requiredFields={["name", "usn", "email", "section", "phone"]}
        onChange={(field, value) => {
          const suffix = fieldToSuffix(field);
          const key = `member1${suffix}` as keyof RegistrationFormData;
          setFormData((prev) => ({ ...prev, [key]: value }));
          if (errors[key]) {
            const next = { ...errors };
            delete next[key];
            setErrors(next);
          }
          if (error) setError(null);
        }}
      />
      {m1Errors.length > 0 && (
        <div
          role="alert"
          className="mt-3 p-3 bg-alert-red/10 border border-alert-red/30 rounded text-alert-red text-sm"
        >
          Please complete Member 1 details.
        </div>
      )}

      {/* Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />

      {/* Member 2 (optional) */}
      <TeamMemberFields
        memberNumber={2}
        formData={{
          name: formData.member2Name,
          usn: formData.member2USN,
          email: formData.member2Email,
          section: formData.member2Section,
          phone: formData.member2Phone,
          github: formData.member2Github,
          linkedin: formData.member2Linkedin,
        }}
        requiredFields={[]}
        onChange={(field, value) => {
          const suffix = fieldToSuffix(field);
          const key = `member2${suffix}` as keyof RegistrationFormData;
          setFormData((prev) => ({ ...prev, [key]: value }));
          if (errors[key]) {
            const next = { ...errors };
            delete next[key];
            setErrors(next);
          }
          if (error) setError(null);
        }}
      />
      {m2Errors.length > 0 && (
        <div
          role="alert"
          className="mt-3 p-3 bg-alert-red/10 border border-alert-red/30 rounded text-alert-red text-sm"
        >
          Please complete Member 2 details.
        </div>
      )}

      {/* Submit / Reset */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-8 py-4 bg-cyber-blue-400 hover:bg-cyber-blue-500 disabled:bg-gray-600 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyber-blue-400/50 disabled:scale-100 disabled:shadow-none flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Registering...
            </>
          ) : (
            <>
              <Users className="w-5 h-5" />
              Complete Registration
            </>
          )}
        </button>

        <button
          type="button"
          className="px-8 py-4 border-2 border-white/20 text-gray-300 font-bold rounded-lg hover:bg-white/5 hover:border-white/30 transition-all duration-300"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </form>
  );
}
