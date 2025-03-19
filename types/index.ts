import { Database } from './supabase';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Team = Database['public']['Tables']['teams']['Row'];
export type TeamMember = Database['public']['Tables']['team_members']['Row'];
export type Task = Database['public']['Tables']['tasks']['Row'];

export type TaskWithProfile = Task & {
  profile: Profile;
};

export type TeamWithMembers = Team & {
  members: (TeamMember & { profile: Profile })[];
};

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum TeamRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

export interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: Date | null;
  team_id?: string | null;
}

export interface ProfileFormValues {
  full_name: string;
  avatar_url?: string | null;
} 