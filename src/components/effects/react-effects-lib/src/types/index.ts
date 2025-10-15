export interface TeamMember {
  name: string;
  usn: string;
  email: string;
  section: string;
}

export interface RegistrationData {
  teamLeader: TeamMember;
  member1: TeamMember;
  member2: TeamMember;
  timestamp?: string;
}

export interface EventTimelineItem {
  date: string;
  title: string;
  description: string;
  icon?: string;
}

export interface OpportunityCard {
  title: string;
  description: string;
  icon: string;
  features?: string[];
}

export type Section = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';