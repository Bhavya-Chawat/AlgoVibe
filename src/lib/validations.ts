import { z } from 'zod'

// Team member schema
const teamMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[1-9]\d{9,11}$/, "Invalid phone number"),
  role: z.string().min(2, "Role must be specified")
})

// Main registration schema
export const registrationSchema = z.object({
  teamName: z
    .string()
    .min(3, "Team name must be at least 3 characters")
    .max(50, "Team name must not exceed 50 characters"),
  college: z
    .string()
    .min(5, "College name must be at least 5 characters")
    .max(100, "College name must not exceed 100 characters"),
  teamSize: z
    .number()
    .int()
    .min(2, "Team must have at least 2 members")
    .max(4, "Team cannot exceed 4 members"),
  teamMembers: z
    .array(teamMemberSchema)
    .min(2, "At least 2 team members required")
    .max(4, "Maximum 4 team members allowed")
})

export type RegistrationData = z.infer<typeof registrationSchema>