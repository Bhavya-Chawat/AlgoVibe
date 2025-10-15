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

export default function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData);

  const validateForm = (): string | null => {
    if (!formData.teamLeaderName.trim()) return 'Team leader name is required';
    if (!formData.teamLeaderUSN.trim()) return 'Team leader USN is required';
    if (!formData.teamLeaderEmail.endsWith('@rvce.edu.in')) {
      return 'Team leader must use an RVCE email address';
    }
    if (!formData.teamLeaderSection.trim()) return 'Team leader section is required';
    
    if (formData.member1Email && !formData.member1Email.endsWith('@rvce.edu.in')) {
      return 'Member 1 must use an RVCE email address';
    }
    if (formData.member2Email && !formData.member2Email.endsWith('@rvce.edu.in')) {
      return 'Member 2 must use an RVCE email address';
    }
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null); // Clear any previous errors
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      const payload: RegistrationPayload = {
        // Team Leader (required)
        team_leader_name: formData.teamLeaderName.trim(),
        team_leader_usn: formData.teamLeaderUSN.toUpperCase(),
        team_leader_email: formData.teamLeaderEmail.toLowerCase(),
        team_leader_section: formData.teamLeaderSection.toUpperCase(),
        
        // Member 1 (optional)
        ...(formData.member1Name && {
          member1_name: formData.member1Name.trim(),
          member1_usn: formData.member1USN.toUpperCase(),
          member1_email: formData.member1Email.toLowerCase(),
          member1_section: formData.member1Section.toUpperCase(),
        }),
        
        // Member 2 (optional)
        ...(formData.member2Name && {
          member2_name: formData.member2Name.trim(),
          member2_usn: formData.member2USN.toUpperCase(),
          member2_email: formData.member2Email.toLowerCase(),
          member2_section: formData.member2Section.toUpperCase(),
        })
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
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel-strong p-8 md:p-12">
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
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Full Name <span className="text-alert-red">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                name="teamLeaderName"
                value={formData.teamLeaderName}
                onChange={handleChange}
                required
                placeholder="Enter full name"
                className="input-cyber pl-11"
              />
            </div>
          </div>

          {/* USN */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              USN <span className="text-alert-red">*</span>
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                name="teamLeaderUSN"
                value={formData.teamLeaderUSN}
                onChange={handleChange}
                required
                placeholder="1RV21CS001"
                className="input-cyber pl-11"
              />
            </div>
          </div>

          {/* RVCE Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              RVCE Email ID <span className="text-alert-red">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                name="teamLeaderEmail"
                value={formData.teamLeaderEmail}
                onChange={handleChange}
                required
                placeholder="student@rvce.edu.in"
                pattern=".+@rvce\.edu\.in"
                className="input-cyber pl-11"
              />
            </div>
          </div>

          {/* Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Section <span className="text-alert-red">*</span>
            </label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                name="teamLeaderSection"
                value={formData.teamLeaderSection}
                onChange={handleChange}
                required
                placeholder="A, B, C, etc."
                maxLength={2}
                className="input-cyber pl-11"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="relative my-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
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
          });
        }}
      />

      {/* Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-8"></div>

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
          });
        }}
      />

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-alert-red/10 border border-alert-red/30 rounded-lg">
          <p className="text-alert-red text-sm">{error}</p>
        </div>
      )}

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
          You can participate individually or with up to 2 additional members (3 total).
        </p>
      </div>
    </form>
  );
}