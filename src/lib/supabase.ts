import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          display_name: string
          avatar_url: string
          timezone: string
          preferences: {
            theme: string
            focusDuration: number
            breakDuration: number
            dailyGoal: number
            weeklyGoal: number
          }
          onboarding_completed: boolean
          onboarding_step: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          display_name?: string
          avatar_url?: string
          timezone?: string
          preferences?: object
          onboarding_completed?: boolean
          onboarding_step?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string
          avatar_url?: string
          timezone?: string
          preferences?: object
          onboarding_completed?: boolean
          onboarding_step?: number
          created_at?: string
          updated_at?: string
        }
      }
      habits: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string
          icon: string
          color: string
          frequency: string
          target_count: number
          reminder_time: string | null
          is_active: boolean
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string
          icon?: string
          color?: string
          frequency?: string
          target_count?: number
          reminder_time?: string | null
          is_active?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string
          icon?: string
          color?: string
          frequency?: string
          target_count?: number
          reminder_time?: string | null
          is_active?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      habit_completions: {
        Row: {
          id: string
          habit_id: string
          user_id: string
          completed_at: string
          completed_date: string
          count: number
          notes: string
          created_at: string
        }
        Insert: {
          id?: string
          habit_id: string
          user_id: string
          completed_at?: string
          completed_date?: string
          count?: number
          notes?: string
          created_at?: string
        }
        Update: {
          id?: string
          habit_id?: string
          user_id?: string
          completed_at?: string
          completed_date?: string
          count?: number
          notes?: string
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          status: string
          priority: number
          category: string
          tags: string[]
          due_date: string | null
          completed_at: string | null
          estimated_duration: number | null
          actual_duration: number | null
          is_recurring: boolean
          recurrence_rule: string | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string
          status?: string
          priority?: number
          category?: string
          tags?: string[]
          due_date?: string | null
          completed_at?: string | null
          estimated_duration?: number | null
          actual_duration?: number | null
          is_recurring?: boolean
          recurrence_rule?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          status?: string
          priority?: number
          category?: string
          tags?: string[]
          due_date?: string | null
          completed_at?: string | null
          estimated_duration?: number | null
          actual_duration?: number | null
          is_recurring?: boolean
          recurrence_rule?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          content_type: string
          folder: string
          is_pinned: boolean
          is_archived: boolean
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string
          content?: string
          content_type?: string
          folder?: string
          is_pinned?: boolean
          is_archived?: boolean
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          content_type?: string
          folder?: string
          is_pinned?: boolean
          is_archived?: boolean
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      focus_sessions: {
        Row: {
          id: string
          user_id: string
          task_id: string | null
          session_type: string
          duration_minutes: number
          started_at: string
          ended_at: string | null
          was_completed: boolean
          distractions_count: number
          notes: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_id?: string | null
          session_type?: string
          duration_minutes: number
          started_at: string
          ended_at?: string | null
          was_completed?: boolean
          distractions_count?: number
          notes?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string | null
          session_type?: string
          duration_minutes?: number
          started_at?: string
          ended_at?: string | null
          was_completed?: boolean
          distractions_count?: number
          notes?: string
          created_at?: string
        }
      }
      reminders: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          type: string
          scheduled_for: string
          recurrence_rule: string | null
          is_active: boolean
          is_dismissed: boolean
          dismissed_at: string | null
          related_habit_id: string | null
          related_task_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string
          type?: string
          scheduled_for: string
          recurrence_rule?: string | null
          is_active?: boolean
          is_dismissed?: boolean
          dismissed_at?: string | null
          related_habit_id?: string | null
          related_task_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          type?: string
          scheduled_for?: string
          recurrence_rule?: string | null
          is_active?: boolean
          is_dismissed?: boolean
          dismissed_at?: string | null
          related_habit_id?: string | null
          related_task_id?: string | null
          created_at?: string
        }
      }
      daily_plans: {
        Row: {
          id: string
          user_id: string
          plan_date: string
          schedule: object
          insights: string
          energy_prediction: object
          is_accepted: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_date: string
          schedule?: object
          insights?: string
          energy_prediction?: object
          is_accepted?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_date?: string
          schedule?: object
          insights?: string
          energy_prediction?: object
          is_accepted?: boolean
          created_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          achievement_type: string
          achievement_data: object
          earned_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_type: string
          achievement_data?: object
          earned_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_type?: string
          achievement_data?: object
          earned_at?: string
          created_at?: string
        }
      }
      user_stats: {
        Row: {
          id: string
          user_id: string
          total_focus_minutes: number
          total_habits_completed: number
          total_tasks_completed: number
          current_streak: number
          longest_streak: number
          total_xp: number
          level: number
          weekly_focus_minutes: number
          last_activity_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_focus_minutes?: number
          total_habits_completed?: number
          total_tasks_completed?: number
          current_streak?: number
          longest_streak?: number
          total_xp?: number
          level?: number
          weekly_focus_minutes?: number
          last_activity_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_focus_minutes?: number
          total_habits_completed?: number
          total_tasks_completed?: number
          current_streak?: number
          longest_streak?: number
          total_xp?: number
          level?: number
          weekly_focus_minutes?: number
          last_activity_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
