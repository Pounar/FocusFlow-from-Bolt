import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { ViewType, Theme, Habit, Task, Note, FocusSession, Reminder, User, UserStats, UserPreferences } from '../types'

interface AppState {
  // UI State
  currentView: ViewType
  sidebarOpen: boolean
  theme: Theme
  isLoading: boolean

  // User State
  user: User | null
  isAuthenticated: boolean
  preferences: UserPreferences

  // Data State
  habits: Habit[]
  tasks: Task[]
  notes: Note[]
  focusSessions: FocusSession[]
  reminders: Reminder[]
  stats: UserStats | null

  // Focus Mode State
  isFocusModeActive: boolean
  currentFocusSession: FocusSession | null

  // Onboarding State
  showOnboarding: boolean
  onboardingStep: number

  // UI Actions
  setCurrentView: (view: ViewType) => void
  toggleSidebar: () => void
  setTheme: (theme: Theme) => void
  setLoading: (loading: boolean) => void

  // User Actions
  setUser: (user: User | null) => void
  setAuthenticated: (auth: boolean) => void

  // Data Actions
  setHabits: (habits: Habit[]) => void
  addHabit: (habit: Habit) => void
  updateHabit: (id: string, updates: Partial<Habit>) => void
  deleteHabit: (id: string) => void

  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void

  setNotes: (notes: Note[]) => void
  addNote: (note: Note) => void
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void

  setFocusSessions: (sessions: FocusSession[]) => void
  addFocusSession: (session: FocusSession) => void
  updateFocusSession: (id: string, updates: Partial<FocusSession>) => void

  setReminders: (reminders: Reminder[]) => void
  addReminder: (reminder: Reminder) => void
  updateReminder: (id: string, updates: Partial<Reminder>) => void
  deleteReminder: (id: string) => void

  setStats: (stats: UserStats | null) => void

  // Focus Mode Actions
  setFocusModeActive: (active: boolean) => void
  setCurrentFocusSession: (session: FocusSession | null) => void

  // Onboarding Actions
  setShowOnboarding: (show: boolean) => void
  setOnboardingStep: (step: number) => void
  nextOnboardingStep: () => void
  completeOnboarding: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // UI State
      currentView: 'dashboard',
      sidebarOpen: false,
      theme: 'dark',
      isLoading: false,

      // User State
      user: null,
      isAuthenticated: false,
      preferences: {
        theme: 'dark',
        focusDuration: 25,
        breakDuration: 5,
        dailyGoal: 8,
        weeklyGoal: 56,
      },

      // Data State
      habits: [],
      tasks: [],
      notes: [],
      focusSessions: [],
      reminders: [],
      stats: null,

      // Focus Mode State
      isFocusModeActive: false,
      currentFocusSession: null,

      // Onboarding State
      showOnboarding: true,
      onboardingStep: 0,

      // UI Actions
      setCurrentView: (view) => set({ currentView: view, sidebarOpen: false }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setTheme: (theme) => set({ theme }),
      setLoading: (loading) => set({ isLoading: loading }),

      // User Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAuthenticated: (auth) => set({ isAuthenticated: auth }),

      // Data Actions
      setHabits: (habits) => set({ habits }),
      addHabit: (habit) => set((state) => ({ habits: [habit, ...state.habits] })),
      updateHabit: (id, updates) => set((state) => ({
        habits: state.habits.map((h) => h.id === id ? { ...h, ...updates } : h)
      })),
      deleteHabit: (id) => set((state) => ({
        habits: state.habits.filter((h) => h.id !== id)
      })),

      setTasks: (tasks) => set({ tasks }),
      addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map((t) => t.id === id ? { ...t, ...updates } : t)
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id)
      })),

      setNotes: (notes) => set({ notes }),
      addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
      updateNote: (id, updates) => set((state) => ({
        notes: state.notes.map((n) => n.id === id ? { ...n, ...updates } : n)
      })),
      deleteNote: (id) => set((state) => ({
        notes: state.notes.filter((n) => n.id !== id)
      })),

      setFocusSessions: (focusSessions) => set({ focusSessions }),
      addFocusSession: (session) => set((state) => ({
        focusSessions: [session, ...state.focusSessions]
      })),
      updateFocusSession: (id, updates) => set((state) => ({
        focusSessions: state.focusSessions.map((s) =>
          s.id === id ? { ...s, ...updates } : s
        )
      })),

      setReminders: (reminders) => set({ reminders }),
      addReminder: (reminder) => set((state) => ({
        reminders: [reminder, ...state.reminders]
      })),
      updateReminder: (id, updates) => set((state) => ({
        reminders: state.reminders.map((r) =>
          r.id === id ? { ...r, ...updates } : r
        )
      })),
      deleteReminder: (id) => set((state) => ({
        reminders: state.reminders.filter((r) => r.id !== id)
      })),

      setStats: (stats) => set({ stats }),

      // Focus Mode Actions
      setFocusModeActive: (active) => set({ isFocusModeActive: active }),
      setCurrentFocusSession: (session) => set({ currentFocusSession: session }),

      // Onboarding Actions
      setShowOnboarding: (show) => set({ showOnboarding: show }),
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      nextOnboardingStep: () => set((state) => ({
        onboardingStep: state.onboardingStep + 1
      })),
      completeOnboarding: () => set({
        showOnboarding: false,
        onboardingStep: 0
      }),
    }),
    {
      name: 'focusflow-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        showOnboarding: state.showOnboarding,
        onboardingStep: state.onboardingStep,
        currentView: state.currentView,
      }),
    }
  )
)
