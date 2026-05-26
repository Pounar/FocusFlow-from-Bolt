import { motion } from 'framer-motion'
import { useStore } from '../stores'
import { GlassCard, Button } from '../components/ui/GlassCard'
import { ProgressRing } from '../components/ui/ProgressRing'
import { Target, Timer, CircleCheck as CheckCircle2, TrendingUp, Sparkles, Calendar, Zap } from 'lucide-react'
import { format } from 'date-fns'
import type { Habit, Task, FocusSession } from '../types'

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function Dashboard() {
  const { habits, tasks, stats, focusSessions, setCurrentView } = useStore()

  const todayHabits = habits.filter((h: Habit) => h.isActive)
  const completedToday = todayHabits.filter((h: Habit) => h.todayCompleted).length
  const habitProgress = todayHabits.length > 0 ? (completedToday / todayHabits.length) * 100 : 0

  const completedTasks = tasks.filter((t: Task) => t.status === 'completed').length

  const todayFocusMinutes = focusSessions
    .filter((s: FocusSession) => new Date(s.startedAt).toDateString() === new Date().toDateString())
    .reduce((acc: number, s: FocusSession) => acc + s.durationMinutes, 0)

  return (
    <motion.div
      className="p-6 md:p-8 max-w-7xl mx-auto"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={staggerItem} className="mb-8">
        <p className="text-zinc-500 text-sm mb-1">{format(new Date(), 'EEEE, MMMM d')}</p>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Good {getGreeting()}!
        </h1>
        <p className="text-zinc-400 mt-2">Here's your productivity overview</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div variants={staggerItem}>
          <GlassCard className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-zinc-500 text-sm mb-1">Daily Progress</p>
                <p className="text-2xl font-bold">{completedToday}/{todayHabits.length}</p>
                <p className="text-zinc-500 text-xs">habits completed</p>
              </div>
              <ProgressRing progress={habitProgress} size={80} strokeWidth={6} />
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentView('habits')}
                className="flex-1"
              >
                <Target size={16} />
                View Habits
              </Button>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={staggerItem}>
          <GlassCard className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-zinc-500 text-sm mb-1">Focus Time</p>
                <p className="text-2xl font-bold">{todayFocusMinutes}</p>
                <p className="text-zinc-500 text-xs">minutes today</p>
              </div>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center">
                <Timer className="text-indigo-400" size={32} />
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setCurrentView('focus')}
              className="w-full"
            >
              <Zap size={16} />
              Start Focus
            </Button>
          </GlassCard>
        </motion.div>

        <motion.div variants={staggerItem}>
          <GlassCard className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-zinc-500 text-sm mb-1">Streak</p>
                <p className="text-zinc-400 text-xs mb-2">Keep it going!</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                <span className="text-2xl font-bold text-orange-400">{stats?.currentStreak || 0}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="text-emerald-400" size={16} />
              <span className="text-zinc-400">Longest: <span className="text-white font-medium">{stats?.longestStreak || 0} days</span></span>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={staggerItem}>
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Target className="text-indigo-400" size={20} />
                Today's Habits
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setCurrentView('habits')}>
                View All
              </Button>
            </div>

            <div className="space-y-3">
              {todayHabits.slice(0, 4).map((habit: Habit, index: number) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      habit.todayCompleted
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-white/5 text-zinc-400'
                    }`}
                    style={{ borderLeft: `3px solid ${habit.color}` }}
                  >
                    {habit.todayCompleted ? <CheckCircle2 size={20} /> : <Target size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{habit.name}</p>
                    <p className="text-xs text-zinc-500">
                      {habit.streak || 0} day streak
                    </p>
                  </div>
                </motion.div>
              ))}

              {todayHabits.length === 0 && (
                <div className="text-center py-8 text-zinc-500">
                  <Target className="mx-auto mb-2 opacity-50" size={32} />
                  <p>No habits yet. Add your first habit!</p>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={staggerItem}>
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="text-fuchsia-400" size={20} />
                AI Daily Plan
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setCurrentView('planner')}>
                View All
              </Button>
            </div>

            <motion.div
              className="p-4 rounded-xl bg-gradient-to-br from-fuchsia-500/10 to-indigo-500/10 border border-fuchsia-500/20"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-fuchsia-500/20 flex items-center justify-center">
                  <Sparkles className="text-fuchsia-400" size={20} />
                </div>
                <div>
                  <p className="font-medium">Optimize Your Day</p>
                  <p className="text-xs text-zinc-500">AI-powered scheduling</p>
                </div>
              </div>

              <p className="text-sm text-zinc-400 mb-3">
                Let AI analyze your habits and tasks to create an optimized daily schedule that maximizes productivity.
              </p>

              <Button variant="primary" size="sm" className="w-full" onClick={() => setCurrentView('planner')}>
                <Sparkles size={16} />
                Generate My Day
              </Button>
            </motion.div>

            <div className="mt-4 p-4 rounded-xl bg-white/5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Tasks</span>
                <span className="font-medium">{completedTasks}/{tasks.length} done</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <motion.div variants={staggerItem} className="mt-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="text-cyan-400" size={20} />
              Quick Actions
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Add Habit', view: 'habits' as const, icon: <Target size={20} /> },
              { label: 'New Task', view: 'planner' as const, icon: <CheckCircle2 size={20} /> },
              { label: 'Start Focus', view: 'focus' as const, icon: <Timer size={20} /> },
              { label: 'Quick Note', view: 'notes' as const, icon: <Sparkles size={20} /> },
            ].map((action, index) => (
              <motion.button
                key={action.label}
                onClick={() => setCurrentView(action.view)}
                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all flex flex-col items-center gap-2"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center text-indigo-400">
                  {action.icon}
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}
