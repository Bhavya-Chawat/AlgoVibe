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
    <div className="glass-panel-strong p-4 rounded-2xl">
      <div className="flex items-center gap-2 mb-4">
        <Users className="text-cyber-blue-400" size={20} />
        <h2 className="text-xl font-bold text-cyber-blue-400">Team Details</h2>
        <Badge variant="success">Registered</Badge>
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">{teamName}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {teamMembers.map((member) => (
          <div 
            key={member.id} 
            className="bg-hack-navy/30 backdrop-blur-sm border border-cyber-blue-400/20 rounded-lg p-3 hover:border-cyber-blue-400/50 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-white text-sm">{member.name}</h4>
              <Badge variant={member.role === 'Leader' ? 'success' : 'default'} className="text-xs">
                {member.role}
              </Badge>
            </div>
            
            <div className="space-y-1 text-xs text-gray-300">
              <p className="flex justify-between">
                <span>Email:</span>
                <span className="text-cyber-blue-400 truncate max-w-[120px]">{member.email}</span>
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