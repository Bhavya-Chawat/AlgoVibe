"use client";

import { Users, Mail, Phone, BookOpen, ShieldCheck, User } from "lucide-react";
import { Badge } from "@/components/ui/modern-ui/src/components/ui/Badge";

interface TeamMember {
  id: string;
  name: string;
  role: "Leader" | "Member";
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

const TeamDetailsCard: React.FC<TeamDetailsCardProps> = ({
  teamName,
  teamMembers,
}) => {
  return (
    <div className="glass-panel-strong p-6 md:p-8 rounded-3xl border border-cyber-blue-400/30 shadow-2xl glow-card relative overflow-hidden">
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyber-blue-400/10 border border-cyber-blue-400/30 flex items-center justify-center">
            <Users className="text-cyber-blue-400 w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">Registered Team</span>
            <h2 className="text-2xl font-extrabold text-white font-heading">{teamName}</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-matrix-green animate-ping"></span>
          <Badge variant="success" className="px-3 py-1 text-xs font-bold uppercase tracking-wider">
            Verified Team
          </Badge>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {teamMembers.map((member) => {
          const isLeader = member.role === "Leader";
          return (
            <div
              key={member.id}
              className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-cyber-blue-400/40 hover:scale-[1.02] transition-all duration-300 relative group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg ${isLeader ? 'bg-cyber-blue-400/20 text-cyber-blue-400 border border-cyber-blue-400/40' : 'bg-white/10 text-gray-300'} flex items-center justify-center`}>
                      {isLeader ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <h4 className="font-extrabold text-white text-base font-heading group-hover:text-cyber-blue-400 transition-colors">
                      {member.name}
                    </h4>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isLeader
                        ? "bg-cyber-blue-400/15 text-cyber-blue-400 border border-cyber-blue-400/30"
                        : "bg-white/10 text-gray-300 border border-white/10"
                    }`}
                  >
                    {member.role}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-gray-300 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <Mail className="w-3 h-3 text-cyber-blue-400" />
                      Email
                    </span>
                    <span className="text-gray-200 truncate max-w-[140px] font-mono" title={member.email}>
                      {member.email}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <Phone className="w-3 h-3 text-neon-blue" />
                      Phone
                    </span>
                    <span className="text-gray-200 font-mono">{member.phone}</span>
                  </div>

                  {member.section && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 text-gray-400">
                        <BookOpen className="w-3 h-3 text-matrix-green" />
                        Section
                      </span>
                      <span className="text-gray-200 font-mono font-bold">{member.section}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamDetailsCard;