// src/components/register/TeamMemberFields.tsx
"use client";

import React from "react";
import { User, Mail, Hash, Phone, Github, Linkedin } from "lucide-react";

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
  onChange: (
    field:
      | "name"
      | "usn"
      | "email"
      | "section"
      | "phone"
      | "github"
      | "linkedin",
    value: string
  ) => void;
}

export default function TeamMemberFields({
  memberNumber,
  formData,
  onChange,
}: TeamMemberFieldsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">
        Team Member {memberNumber}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name (required by parent when member block is active) */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Full Name
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

        {/* USN (required by parent when member block is active) */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            USN
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

        {/* Email (required by parent when member block is active) */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            RVCE Email ID
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

        {/* Section as radio (A/B) */}
        <div>
          <span className="block text-sm font-semibold text-gray-300 mb-2">
            Section
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

        {/* Phone (required by parent when member block is active; show as required in UI) */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Phone <span className="text-alert-red">*</span>
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

        {/* GitHub (not required; no star) */}
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

        {/* LinkedIn (not required; no star) */}
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
