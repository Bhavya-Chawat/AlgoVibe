import React from 'react';
import { User, Mail, Hash, BookOpen } from 'lucide-react';

interface TeamMemberFieldsProps {
  memberNumber: number;
  formData: {
    name: string;
    usn: string;
    email: string;
    section: string;
  };
  onChange: (field: string, value: string) => void;
}

export default function TeamMemberFields({
  memberNumber,
  formData,
  onChange,
}: TeamMemberFieldsProps) {
  const prefix = `member${memberNumber}`;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">
        Team Member {memberNumber}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Enter full name"
              className="input-cyber pl-11"
            />
          </div>
        </div>

        {/* USN Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            USN
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={formData.usn}
              onChange={(e) => onChange('usn', e.target.value)}
              placeholder="1RV21CS001"
              className="input-cyber pl-11"
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            RVCE Email ID
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="student@rvce.edu.in"
              pattern=".+@rvce\.edu\.in"
              className="input-cyber pl-11"
            />
          </div>
        </div>

        {/* Section Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Section
          </label>
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={formData.section}
              onChange={(e) => onChange('section', e.target.value)}
              placeholder="A, B, C, etc."
              maxLength={2}
              className="input-cyber pl-11"
            />
          </div>
        </div>
      </div>
    </div>
  );
}