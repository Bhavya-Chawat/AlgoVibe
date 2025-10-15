export interface Database {
  public: {
    Tables: {
      registrations: {
        Row: {
          id: number
          team_name: string
          college: string
          team_size: number
          team_members: TeamMember[]
          created_at: string
        }
        Insert: {
          id?: number
          team_name: string
          college: string
          team_size: number
          team_members: TeamMember[]
          created_at?: string
        }
        Update: {
          id?: number
          team_name?: string
          college?: string
          team_size?: number
          team_members?: TeamMember[]
          created_at?: string
        }
      }
    }
  }
}

export interface TeamMember {
  name: string
  email: string
  phone: string
  role: string
}