// src/components/register/TeamMemberFields.tsx
"use client";

import React from "react";
import { User, Mail, Hash, Phone, Github, Linkedin } from "lucide-react";

type FieldKey =
  | "name"
  | "usn"
  | "email"
  | "section"
  | "phone"
  | "github"
  | "linkedin";

interface TeamMemberFieldsProps {
  memberNumber: number;
  formData: {
    name: string;
    usn: string;
    email: string;
    section: string; // 'A' | 'B' | ''
    phone: string;
    github?: string;
    linkedin?: string;
  };
  onChange: (field: FieldKey, value: string) => void;
  // NEW: which fields should display a red star (Member 1 passes core fields, Member 2 passes [])
  requiredFields?: Array<"name" | "usn" | "email" | "section" | "phone">;
}

const RedStar = ({ on }: { on: boolean }) =>
  on ? <span className="text-alert-red">*</span> : null;

export default function TeamMemberFields({
  memberNumber,
  formData,
  onChange,
  requiredFields = [],
}: TeamMemberFieldsProps) {
  const isReq = (k: "name" | "usn" | "email" | "section" | "phone") =>
    requiredFields.includes(k);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">
        Team Member {memberNumber}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Full Name <RedStar on={isReq("name")} />
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="Enter full name"
              className="input-cyber pl-11"
            />
          </div>
        </div>

        {/* USN */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            USN <RedStar on={isReq("usn")} />
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={formData.usn}
              onChange={(e) => onChange("usn", e.target.value)}
              placeholder="1RV21CS001"
              className="input-cyber pl-11"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            RVCE Email ID <RedStar on={isReq("email")} />
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="student@rvce.edu.in"
              pattern=".+@rvce\.edu\.in"
              className="input-cyber pl-11"
            />
          </div>
        </div>

        {/* Section */}
        <div>
          <span className="block text-sm font-semibold text-gray-300 mb-2">
            Section <RedStar on={isReq("section")} />
          </span>
          <div className="flex items-center gap-6">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name={`member${memberNumber}-section`}
                value="A"
                checked={formData.section === "A"}
                onChange={(e) => onChange("section", e.target.value)}
              />
              <span className="text-gray-300">A</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name={`member${memberNumber}-section`}
                value="B"
                checked={formData.section === "B"}
                onChange={(e) => onChange("section", e.target.value)}
              />
              <span className="text-gray-300">B</span>
            </label>
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Phone <RedStar on={isReq("phone")} />
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="10-digit number"
              inputMode="numeric"
              pattern="\d{10}"
              className="input-cyber pl-11"
            />
          </div>
        </div>

        {/* GitHub (optional) */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            GitHub
          </label>
          <div className="relative">
            <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="url"
              value={formData.github || ""}
              onChange={(e) => onChange("github", e.target.value)}
              placeholder="https://github.com/username"
              className="input-cyber pl-11"
            />
          </div>
        </div>

        {/* LinkedIn (optional) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            LinkedIn
          </label>
          <div className="relative">
            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="url"
              value={formData.linkedin || ""}
              onChange={(e) => onChange("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="input-cyber pl-11"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
