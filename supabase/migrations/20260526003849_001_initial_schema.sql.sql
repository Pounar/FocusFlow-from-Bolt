/*
  # FocusFlow Initial Schema

  Creates the complete database structure for the FocusFlow productivity app.

  1. New Tables
    - `users`: User profiles with preferences and settings
    - `habits`: Daily habits with tracking metadata
    - habit_completions: Daily habit completion records
    - `tasks`: Tasks with priorities, deadlines, and categories
    - `notes`: Quick notes with markdown support
    - `focus_sessions`: Pomodoro/focus session records
    - `reminders`: Smart reminders and alarms
    - `daily_plans`: AI-generated daily schedules
    - `achievements`: User achievements and milestones
    - `user_stats`: Aggregated productivity statistics

  2. Security
    - RLS enabled on all tables
    - Policies restrict access to authenticated users' own data only

  3. Important Notes
    - All tables use UUID primary keys
    - Timestamps use timestamptz for timezone awareness
    - Cascading deletes ensure data integrity
    - Indexes optimize common query patterns
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  display_name text DEFAULT '',
  avatar_url text DEFAULT '',
  timezone text DEFAULT 'UTC',
  preferences jsonb DEFAULT '{"theme": "dark", "focusDuration": 25, "breakDuration": 5, "dailyGoal": 8, "weeklyGoal": 56}'::jsonb,
  onboarding_completed boolean DEFAULT false,
  onboarding_step integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habits table
CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT 'star',
  color text DEFAULT '#6366f1',
  frequency text DEFAULT 'daily',
  target_count integer DEFAULT 1,
  reminder_time text,
  is_active boolean DEFAULT true,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habit completions
CREATE TABLE IF NOT EXISTS habit_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  completed_date date NOT NULL DEFAULT CURRENT_DATE,
  count integer DEFAULT 1,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(habit_id, completed_date)
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority integer DEFAULT 2 CHECK (priority BETWEEN 1 AND 4),
  category text DEFAULT 'general',
  tags text[] DEFAULT '{}',
  due_date timestamptz,
  completed_at timestamptz,
  estimated_duration integer,
  actual_duration integer,
  is_recurring boolean DEFAULT false,
  recurrence_rule text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text DEFAULT 'Untitled',
  content text DEFAULT '',
  content_type text DEFAULT 'markdown',
  folder text DEFAULT 'default',
  is_pinned boolean DEFAULT false,
  is_archived boolean DEFAULT false,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Focus sessions
CREATE TABLE IF NOT EXISTS focus_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id uuid REFERENCES tasks(id) ON DELETE SET NULL,
  session_type text DEFAULT 'pomodoro' CHECK (session_type IN ('pomodoro', 'deep_work', 'custom')),
  duration_minutes integer NOT NULL,
  started_at timestamptz NOT NULL,
  ended_at timestamptz,
  was_completed boolean DEFAULT false,
  distractions_count integer DEFAULT 0,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Reminders table
CREATE TABLE IF NOT EXISTS reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  type text DEFAULT 'one_time' CHECK (type IN ('one_time', 'recurring', 'habit', 'task')),
  scheduled_for timestamptz NOT NULL,
  recurrence_rule text,
  is_active boolean DEFAULT true,
  is_dismissed boolean DEFAULT false,
  dismissed_at timestamptz,
  related_habit_id uuid REFERENCES habits(id) ON DELETE CASCADE,
  related_task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Daily plans (AI-generated)
CREATE TABLE IF NOT EXISTS daily_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_date date NOT NULL,
  schedule jsonb DEFAULT '[]'::jsonb,
  insights text DEFAULT '',
  energy_prediction jsonb DEFAULT '{}'::jsonb,
  is_accepted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, plan_date)
);

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_type text NOT NULL,
  achievement_data jsonb DEFAULT '{}'::jsonb,
  earned_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- User stats (aggregated)
CREATE TABLE IF NOT EXISTS user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  total_focus_minutes integer DEFAULT 0,
  total_habits_completed integer DEFAULT 0,
  total_tasks_completed integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  total_xp integer DEFAULT 0,
  level integer DEFAULT 1,
  weekly_focus_minutes integer DEFAULT 0,
  last_activity_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_id ON habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_user_date ON habit_completions(user_id, completed_date);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(user_id, due_date);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_user_id ON focus_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_started ON focus_sessions(user_id, started_at);
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_scheduled ON reminders(user_id, scheduled_for);
CREATE INDEX IF NOT EXISTS idx_daily_plans_user_date ON daily_plans(user_id, plan_date);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own profile" ON users FOR SELECT TO authenticated USING (auth.uid()::uuid = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE TO authenticated USING (auth.uid()::uuid = id) WITH CHECK (auth.uid()::uuid = id);

-- Habits policies
CREATE POLICY "Users can manage own habits" ON habits FOR ALL TO authenticated USING (auth.uid()::uuid = user_id) WITH CHECK (auth.uid()::uuid = user_id);

-- Habit completions policies
CREATE POLICY "Users can manage own habit completions" ON habit_completions FOR ALL TO authenticated USING (auth.uid()::uuid = user_id) WITH CHECK (auth.uid()::uuid = user_id);

-- Tasks policies
CREATE POLICY "Users can manage own tasks" ON tasks FOR ALL TO authenticated USING (auth.uid()::uuid = user_id) WITH CHECK (auth.uid()::uuid = user_id);

-- Notes policies
CREATE POLICY "Users can manage own notes" ON notes FOR ALL TO authenticated USING (auth.uid()::uuid = user_id) WITH CHECK (auth.uid()::uuid = user_id);

-- Focus sessions policies
CREATE POLICY "Users can manage own focus sessions" ON focus_sessions FOR ALL TO authenticated USING (auth.uid()::uuid = user_id) WITH CHECK (auth.uid()::uuid = user_id);

-- Reminders policies
CREATE POLICY "Users can manage own reminders" ON reminders FOR ALL TO authenticated USING (auth.uid()::uuid = user_id) WITH CHECK (auth.uid()::uuid = user_id);

-- Daily plans policies
CREATE POLICY "Users can manage own daily plans" ON daily_plans FOR ALL TO authenticated USING (auth.uid()::uuid = user_id) WITH CHECK (auth.uid()::uuid = user_id);

-- Achievements policies
CREATE POLICY "Users can read own achievements" ON achievements FOR SELECT TO authenticated USING (auth.uid()::uuid = user_id);
CREATE POLICY "Users can insert own achievements" ON achievements FOR INSERT TO authenticated WITH CHECK (auth.uid()::uuid = user_id);

-- User stats policies
CREATE POLICY "Users can read own stats" ON user_stats FOR SELECT TO authenticated USING (auth.uid()::uuid = user_id);
CREATE POLICY "Users can update own stats" ON user_stats FOR UPDATE TO authenticated USING (auth.uid()::uuid = user_id) WITH CHECK (auth.uid()::uuid = user_id);
CREATE POLICY "Users can insert own stats" ON user_stats FOR INSERT TO authenticated WITH CHECK (auth.uid()::uuid = user_id);
