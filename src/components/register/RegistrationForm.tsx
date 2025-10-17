'use client';

import { useState } from 'react';
import { Users, Mail, Hash, BookOpen, User, Loader2 } from 'lucide-react';
import TeamMemberFields from './TeamMemberFields';
import FormSuccess from './FormSuccess';
import { RegistrationFormData, RegistrationPayload } from '@/types/registration';
import { createRegistration } from '@/lib/supabase/queries';

const initialFormData: RegistrationFormData = {
  teamLeaderName: '',
  teamLeaderUSN: '',
  teamLeaderEmail: '',
  teamLeaderSection: '',
  member1Name: '',
  member1USN: '',
  member1Email: '',
  member1Section: '',
  member2Name: '',
  member2USN: '',
  member2Email: '',
  member2Section: '',
};

// Utility: RVCE email check
const endsWithRvce = (email: string) => /@rvce\.edu\.in$/i.test(email.trim());

// Utility: simple "any field provided" check for a member block
const anyProvided = (vals: string[]) => vals.some(v => v.trim().length > 0);

type FieldErrors = Partial<Record<keyof RegistrationFormData, string>>;

export default function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData);
  const [errors, setErrors] = useState<FieldErrors>({});

  const validateForm = (): FieldErrors => {
    const newErrors: FieldErrors = {};

    // Team Leader required fields
    if (!formData.teamLeaderName.trim()) newErrors.teamLeaderName = 'Team leader name is required';
    if (!formData.teamLeaderUSN.trim()) newErrors.teamLeaderUSN = 'Team leader USN is required';
    if (!formData.teamLeaderEmail.trim()) {
      newErrors.teamLeaderEmail = 'Team leader email is required';
    } else if (!endsWithRvce(formData.teamLeaderEmail)) {
      newErrors.teamLeaderEmail = 'Use your RVCE email address (ends with @rvce.edu.in)';
    }
    if (!formData.teamLeaderSection.trim()) newErrors.teamLeaderSection = 'Team leader section is required';

    // Member 1 block
    const m1 = [
      formData.member1Name,
      formData.member1USN,
      formData.member1Email,
      formData.member1Section,
    ];
    if (anyProvided(m1)) {
      if (!formData.member1Name.trim()) newErrors.member1Name = 'Member 1 name is required';
      if (!formData.member1USN.trim()) newErrors.member1USN = 'Member 1 USN is required';
      if (!formData.member1Email.trim()) {
        newErrors.member1Email = 'Member 1 email is required';
      } else if (!endsWithRvce(formData.member1Email)) {
        newErrors.member1Email = 'Member 1 must use @rvce.edu.in email';
      }
      if (!formData.member1Section.trim()) newErrors.member1Section = 'Member 1 section is required';
    } else {
      // If provided only email (rare), still check domain
      if (formData.member1Email && !endsWithRvce(formData.member1Email)) {
        newErrors.member1Email = 'Member 1 must use @rvce.edu.in email';
      }
    }

    // Member 2 block
    const m2 = [
      formData.member2Name,
      formData.member2USN,
      formData.member2Email,
      formData.member2Section,
    ];
    if (anyProvided(m2)) {
      if (!formData.member2Name.trim()) newErrors.member2Name = 'Member 2 name is required';
      if (!formData.member2USN.trim()) newErrors.member2USN = 'Member 2 USN is required';
      if (!formData.member2Email.trim()) {
        newErrors.member2Email = 'Member 2 email is required';
      } else if (!endsWithRvce(formData.member2Email)) {
        newErrors.member2Email = 'Member 2 must use @rvce.edu.in email';
      }
      if (!formData.member2Section.trim()) newErrors.member2Section = 'Member 2 section is required';
    } else {
      if (formData.member2Email && !endsWithRvce(formData.member2Email)) {
        newErrors.member2Email = 'Member 2 must use @rvce.edu.in email';
      }
    }

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-level error on change
    if (errors[name as keyof RegistrationFormData]) {
      const next = { ...errors };
      delete next[name as keyof RegistrationFormData];
      setErrors(next);
    }

    // Clear banner error if any
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setIsSubmitting(false);
      setError('Please fix the highlighted fields and try again.');
      return;
    }

    try {
      const payload: RegistrationPayload = {
        // Team Leader (required)
        team_leader_name: formData.teamLeaderName.trim(),
        team_leader_usn: formData.teamLeaderUSN.trim().toUpperCase(),
        team_leader_email: formData.teamLeaderEmail.trim().toLowerCase(),
        team_leader_section: formData.teamLeaderSection.trim().toUpperCase(),

        // Member 1 (optional)
        ...(anyProvided([
          formData.member1Name,
          formData.member1USN,
          formData.member1Email,
          formData.member1Section,
        ]) && {
          member1_name: formData.member1Name.trim(),
          member1_usn: formData.member1USN.trim().toUpperCase(),
          member1_email: formData.member1Email.trim().toLowerCase(),
          member1_section: formData.member1Section.trim().toUpperCase(),
        }),

        // Member 2 (optional)
        ...(anyProvided([
          formData.member2Name,
          formData.member2USN,
          formData.member2Email,
          formData.member2Section,
        ]) && {
          member2_name: formData.member2Name.trim(),
          member2_usn: formData.member2USN.trim().toUpperCase(),
          member2_email: formData.member2Email.trim().toLowerCase(),
          member2_section: formData.member2Section.trim().toUpperCase(),
        }),
      };

      await createRegistration(payload);
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form?')) {
      setFormData(initialFormData);
      setErrors({});
      setError(null);
    }
  };

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

  // Helper to render inline input error
  const InlineError = ({ id, message }: { id: string; message?: string }) =>
    message ? (
      <p id={id} role="alert" className="mt-2 text-sm text-alert-red">
        {message}
      </p>
    ) : null;

  // Build grouped member errors for compact display
  const m1Errors = [
    errors.member1Name,
    errors.member1USN,
    errors.member1Email,
    errors.member1Section,
  ].filter(Boolean) as string[];

  const m2Errors = [
    errors.member2Name,
    errors.member2USN,
    errors.member2Email,
    errors.member2Section,
  ].filter(Boolean) as string[];

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

      {/* Team Leader Section */}
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
            <label htmlFor="teamLeaderName" className="block text-sm font-semibold text-gray-300 mb-2">
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
                aria-describedby={errors.teamLeaderName ? 'err-teamLeaderName' : undefined}
              />
            </div>
            <InlineError id="err-teamLeaderName" message={errors.teamLeaderName} />
          </div>

          {/* USN */}
          <div>
            <label htmlFor="teamLeaderUSN" className="block text-sm font-semibold text-gray-300 mb-2">
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
                aria-describedby={errors.teamLeaderUSN ? 'err-teamLeaderUSN' : undefined}
              />
            </div>
            <InlineError id="err-teamLeaderUSN" message={errors.teamLeaderUSN} />
          </div>

          {/* RVCE Email */}
          <div>
            <label htmlFor="teamLeaderEmail" className="block text-sm font-semibold text-gray-300 mb-2">
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
                aria-describedby={errors.teamLeaderEmail ? 'err-teamLeaderEmail' : undefined}
              />
            </div>
            <InlineError id="err-teamLeaderEmail" message={errors.teamLeaderEmail} />
          </div>

          {/* Section */}
          <div>
            <label htmlFor="teamLeaderSection" className="block text-sm font-semibold text-gray-300 mb-2">
              Section <span className="text-alert-red">*</span>
            </label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                id="teamLeaderSection"
                type="text"
                name="teamLeaderSection"
                value={formData.teamLeaderSection}
                onChange={handleChange}
                required
                placeholder="A, B, C, etc."
                maxLength={2}
                className="input-cyber pl-11"
                aria-invalid={!!errors.teamLeaderSection}
                aria-describedby={errors.teamLeaderSection ? 'err-teamLeaderSection' : undefined}
              />
            </div>
            <InlineError id="err-teamLeaderSection" message={errors.teamLeaderSection} />
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
            Team Members (Optional)
          </span>
        </div>
      </div>

      {/* Team Member 1 */}
      <TeamMemberFields
        memberNumber={1}
        formData={{
          name: formData.member1Name,
          usn: formData.member1USN,
          email: formData.member1Email,
          section: formData.member1Section,
        }}
        onChange={(field, value) => {
          setFormData({
            ...formData,
            [`member1${field.charAt(0).toUpperCase() + field.slice(1)}`]: value,
          } as RegistrationFormData);
          // clear specific field error if any
          const key = `member1${field.charAt(0).toUpperCase() + field.slice(1)}` as keyof RegistrationFormData;
          if (errors[key]) {
            const next = { ...errors };
            delete next[key];
            setErrors(next);
          }
          if (error) setError(null);
        }}
      />
      {/* Inline summary of Member 1 issues */}
      {m1Errors.length > 0 && (
        <div role="alert" className="mt-3 p-3 bg-alert-red/10 border border-alert-red/30 rounded text-alert-red text-sm">
          Please complete Member 1 details: {m1Errors.join('; ')}.
        </div>
      )}

      {/* Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />

      {/* Team Member 2 */}
      <TeamMemberFields
        memberNumber={2}
        formData={{
          name: formData.member2Name,
          usn: formData.member2USN,
          email: formData.member2Email,
          section: formData.member2Section,
        }}
        onChange={(field, value) => {
          setFormData({
            ...formData,
            [`member2${field.charAt(0).toUpperCase() + field.slice(1)}`]: value,
          } as RegistrationFormData);
          // clear specific field error if any
          const key = `member2${field.charAt(0).toUpperCase() + field.slice(1)}` as keyof RegistrationFormData;
          if (errors[key]) {
            const next = { ...errors };
            delete next[key];
            setErrors(next);
          }
          if (error) setError(null);
        }}
      />
      {/* Inline summary of Member 2 issues */}
      {m2Errors.length > 0 && (
        <div role="alert" className="mt-3 p-3 bg-alert-red/10 border border-alert-red/30 rounded text-alert-red text-sm">
          Please complete Member 2 details: {m2Errors.join('; ')}.
        </div>
      )}

      {/* Error Message (banner already at top, keep this as additional context if desired) */}
      {/* You can remove this block if you prefer only the top banner */}
      {/* {error && (
        <div className="mt-4 p-4 bg-alert-red/10 border border-alert-red/30 rounded-lg">
          <p className="text-alert-red text-sm">{error}</p>
        </div>
      )} */}

      {/* Submit Button */}
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

      {/* Info Note */}
      <div className="mt-6 p-4 glass-panel rounded-lg">
        <p className="text-sm text-gray-400 text-center">
          <span className="text-cyber-blue-400 font-semibold">Note:</span> Team members are optional.
          You can participate with up to 2 additional members (3 total).
        </p>
      </div>
    </form>
  );
}
