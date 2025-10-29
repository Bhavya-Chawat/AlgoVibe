export interface Database {
  public: {
    Tables: {
      teams: {
        Row: { team_id: number; team_name: string; pass: string };
        Insert: { team_id?: never; team_name: string; pass: string };
        Update: { team_id?: never; team_name?: string; pass?: string };
        Relationships: [];
      };
      members: {
        Row: {
          member_id: number;
          team_id: number;
          name: string;
          usn: string | null;
          email: string | null;
          phone_number: string | null;
          section: "A" | "B" | null;
          github_profile: string | null;
          linkedin_profile: string | null;
          role: "Leader" | "Member";
        };
        Insert: {
          member_id?: never;
          team_id: number;
          name: string;
          usn?: string | null;
          email?: string | null;
          phone_number?: string | null;
          section?: "A" | "B" | null;
          github_profile?: string | null;
          linkedin_profile?: string | null;
          role: "Leader" | "Member";
        };
        Update: {
          member_id?: never;
          team_id?: number;
          name?: string;
          usn?: string | null;
          email?: string | null;
          phone_number?: string | null;
          section?: "A" | "B" | null;
          github_profile?: string | null;
          linkedin_profile?: string | null;
          role?: "Leader" | "Member";
        };
        Relationships: [
          {
            foreignKeyName: "members_team_id_fkey";
            columns: ["team_id"];
            referencedRelation: "teams";
            referencedColumns: ["team_id"];
          }
        ];
      };
      contest: {
        Row: {
          contest_id: number;
          is_active: boolean;
          start_time: string | null;
          end_time: string | null;
          duration_minutes: number;
        };
        Insert: {
          contest_id?: number;
          is_active?: boolean;
          start_time?: string | null;
          end_time?: string | null;
          duration_minutes?: number;
        };
        Update: {
          contest_id?: number;
          is_active?: boolean;
          start_time?: string | null;
          end_time?: string | null;
          duration_minutes?: number;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}