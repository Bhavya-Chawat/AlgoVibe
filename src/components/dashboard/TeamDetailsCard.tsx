"use client";

import { Users } from 'lucide-react';
import { Badge } from '@/components/ui/modern-ui/src/components/ui/Badge';

interface TeamMember {
  id: string;
  name: string;
  role: 'Leader' | 'Member';
  email: string;
  phone: string;
  section?: string;
  github?: string;
  linkedin?: string;
}

interface TeamDetailsCardProps {
  teamName: string;
  teamMembers: TeamMember[];
}

const TeamDetailsCard: React.FC<TeamDetailsCardProps> = ({ teamName, teamMembers }) => {
  return (
    <div className="glass-panel-strong p-6 rounded-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Users className="text-cyber-blue-400" size={24} />
        <h2 className="text-2xl font-bold text-cyber-blue-400">Team Details</h2>
        <Badge variant="success">Registered</Badge>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">{teamName}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers.map((member) => (
          <div 
            key={member.id} 
            className="bg-hack-navy/30 backdrop-blur-sm border border-cyber-blue-400/20 rounded-xl p-4 hover:border-cyber-blue-400/50 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-bold text-white">{member.name}</h4>
              <Badge variant={member.role === 'Leader' ? 'success' : 'default'}>
                {member.role}
              </Badge>
            </div>
            
            <div className="space-y-2 text-sm text-gray-300">
              <p className="flex justify-between">
                <span>Email:</span>
                <span className="text-cyber-blue-400">{member.email}</span>
              </p>
              <p className="flex justify-between">
                <span>Phone:</span>
                <span>{member.phone}</span>
              </p>
              {member.section && (
                <p className="flex justify-between">
                  <span>Section:</span>
                  <span>{member.section}</span>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamDetailsCard;