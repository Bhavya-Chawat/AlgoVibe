// src/lib/validations.ts
import { z } from "zod";

const sectionEnum = z.enum(["A", "B"]);
const roleEnum = z.enum(["Leader", "Member"]);

export const teamMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  usn: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[0-9A-Z-]+$/, "Invalid USN format")
    .optional(),
  email: z.string().email("Invalid email address").optional(),
  phone_number: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  section: sectionEnum.optional(),
  github_profile: z
    .string()
    .url("Enter a valid GitHub URL")
    .regex(/^https?:\/\/(www\.)?github\.com\/.+$/i, "Enter a valid GitHub URL")
    .optional(),
  linkedin_profile: z
    .string()
    .url("Enter a valid LinkedIn URL")
    .regex(
      /^https?:\/\/(www\.)?linkedin\.com\/in\/.+$/i,
      "Enter a valid LinkedIn URL"
    )
    .optional(),
  role: roleEnum,
});

export const registrationSchema = z.object({
  teamName: z
    .string()
    .min(3, "Team name must be at least 3 characters")
    .max(50, "Team name must not exceed 50 characters"),
  teamMembers: z
    .array(teamMemberSchema)
    .min(2, "At least 2 team members required")
    .max(3, "Maximum 3 team members allowed"),
});

export type RegistrationData = z.infer<typeof registrationSchema>;
