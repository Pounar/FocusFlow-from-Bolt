export type Theme = 'dark' | 'light'

export type ViewType = 'dashboard' | 'habits' | 'planner' | 'focus' | 'notes' | 'analytics' | 'reminders' | 'settings' | 'assistant'

export interface User {
  id: string
  email: string
  displayName: string
  avatarUrl: string
  timezone: string
  preferences: UserPreferences
  onboardingCompleted: boolean
  onboardingStep: number
  createdAt: Date
  updatedAt: Date
}

export interface UserPreferences {
  theme: Theme
  focusDuration: number
  breakDuration: number
  dailyGoal: number
  weeklyGoal: number
}

export interface Habit {
  id: string
  userId: string
  name: string
  description: string
  icon: string
  color: string
  frequency: 'daily' | 'weekly' | 'custom'
  targetCount: number
  reminderTime: string | null
  isActive: boolean
  orderIndex: number
  createdAt: Date
  updatedAt: Date
  completions?: HabitCompletion[]
  streak?: number
  todayCompleted?: boolean
  todayCount?: number
}

export interface HabitCompletion {
  id: string
  habitId: string
  userId: string
  completedAt: Date
  completedDate: string
  count: number
  notes: string
}

export interface Task {
  id: string
  userId: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: 1 | 2 | 3 | 4
  category: string
  tags: string[]
  dueDate: Date | null
  completedAt: Date | null
  estimatedDuration: number | null
  actualDuration: number | null
  isRecurring: boolean
  recurrenceRule: string | null
  orderIndex: number
  createdAt: Date
  updatedAt: Date
}

export interface Note {
  id: string
  userId: string
  title: string
  content: string
  contentType: 'markdown' | 'plain'
  folder: string
  isPinned: boolean
  isArchived: boolean
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface FocusSession {
  id: string
  userId: string
  taskId: string | null
  sessionType: 'pomodoro' | 'deep_work' | 'custom'
  durationMinutes: number
  startedAt: Date
  endedAt: Date | null
  wasCompleted: boolean
  distractionsCount: number
  notes: string
  createdAt: Date
}

export interface Reminder {
  id: string
  userId: string
  title: string
  description: string
  type: 'one_time' | 'recurring' | 'habit' | 'task'
  scheduledFor: Date
  recurrenceRule: string | null
  isActive: boolean
  isDismissed: boolean
  dismissedAt: Date | null
  relatedHabitId: string | null
  relatedTaskId: string | null
  createdAt: Date
}

export interface DailyPlan {
  id: string
  userId: string
  planDate: string
  schedule: PlanItem[]
  insights: string
  energyPrediction: EnergyLevel[]
  isAccepted: boolean
  createdAt: Date
}

export interface PlanItem {
  time: string
  duration: number
  type: 'habit' | 'task' | 'focus' | 'break'
  title: string
  description: string
  priority: number
  relatedId?: string
}

export interface EnergyLevel {
  time: string
  level: number
}

export interface Achievement {
  id: string
  userId: string
  achievementType: string
  achievementData: object
  earnedAt: Date
  createdAt: Date
}

export interface UserStats {
  id: string
  userId: string
  totalFocusMinutes: number
  totalHabitsCompleted: number
  totalTasksCompleted: number
  currentStreak: number
  longestStreak: number
  totalXp: number
  level: number
  weeklyFocusMinutes: number
  lastActivityAt: Date | null
  createdAt: Date
  updatedAt: Date
}
