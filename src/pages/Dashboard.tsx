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
      className="px-4 py-5 md:px-6 lg:px-8 max-w-6xl mx-auto"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={staggerItem} className="mb-6">
        <p className="text-zinc-500 text-xs mb-0.5">{format(new Date(), 'EEEE, MMMM d')}</p>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Good {getGreeting()}!
        </h1>
        <p className="text-zinc-500 text-sm mt-1">Here's your productivity overview</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div variants={staggerItem}>
          <GlassCard className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-zinc-500 text-xs mb-0.5">Daily Progress</p>
                <p className="text-xl font-bold">{completedToday}/{todayHabits.length}</p>
                <p className="text-zinc-500 text-[10px]">habits completed</p>
              </div>
              <ProgressRing progress={habitProgress} size={64} strokeWidth={5} />
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentView('habits')}
                className="flex-1 text-xs"
              >
                <Target size={14} />
                View Habits
              </Button>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={staggerItem}>
          <GlassCard className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-zinc-500 text-xs mb-0.5">Focus Time</p>
                <p className="text-xl font-bold">{todayFocusMinutes}</p>
                <p className="text-zinc-500 text-[10px]">minutes today</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center">
                <Timer className="text-indigo-400" size={24} />
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setCurrentView('focus')}
              className="w-full text-xs"
            >
              <Zap size={14} />
              Start Focus
            </Button>
          </GlassCard>
        </motion.div>

        <motion.div variants={staggerItem}>
          <GlassCard className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-zinc-500 text-xs mb-0.5">Streak</p>
                <p className="text-zinc-400 text-[10px]">Keep it going!</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                <span className="text-xl font-bold text-orange-400">{stats?.currentStreak || 0}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <TrendingUp className="text-emerald-400" size={14} />
              <span className="text-zinc-400">Longest: <span className="text-white font-medium">{stats?.longestStreak || 0}d</span></span>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
        <motion.div variants={staggerItem}>
          <GlassCard className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold flex items-center gap-2">
                <Target className="text-indigo-400" size={18} />
                Today's Habits
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setCurrentView('habits')} className="text-xs">
                View All
              </Button>
            </div>

            <div className="space-y-2">
              {todayHabits.slice(0, 3).map((habit: Habit, index: number) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      habit.todayCompleted
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-white/5 text-zinc-400'
                    }`}
                    style={{ borderLeft: `2px solid ${habit.color}` }}
                  >
                    {habit.todayCompleted ? <CheckCircle2 size={16} /> : <Target size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{habit.name}</p>
                    <p className="text-[10px] text-zinc-500">
                      {habit.streak || 0}d streak
                    </p>
                  </div>
                </motion.div>
              ))}

              {todayHabits.length === 0 && (
                <div className="text-center py-6 text-zinc-500">
                  <Target className="mx-auto mb-2 opacity-50" size={28} />
                  <p className="text-sm">No habits yet. Add your first habit!</p>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={staggerItem}>
          <GlassCard className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold flex items-center gap-2">
                <Sparkles className="text-fuchsia-400" size={18} />
                AI Daily Plan
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setCurrentView('planner')} className="text-xs">
                View All
              </Button>
            </div>

            <motion.div
              className="p-3 rounded-lg bg-gradient-to-br from-fuchsia-500/10 to-indigo-500/10 border border-fuchsia-500/20 mb-3"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-fuchsia-500/20 flex items-center justify-center">
                  <Sparkles className="text-fuchsia-400" size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium">Optimize Your Day</p>
                  <p className="text-[10px] text-zinc-500">AI-powered scheduling</p>
                </div>
              </div>

              <p className="text-xs text-zinc-400 mb-2">
                Let AI analyze your habits and create an optimized daily schedule.
              </p>

              <Button variant="primary" size="sm" className="w-full text-xs" onClick={() => setCurrentView('planner')}>
                <Sparkles size={14} />
                Generate My Day
              </Button>
            </motion.div>

            <div className="p-3 rounded-lg bg-white/5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Tasks</span>
                <span className="font-medium">{completedTasks}/{tasks.length} done</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
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

      <motion.div variants={staggerItem} className="mt-4">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Calendar className="text-cyan-400" size={18} />
              Quick Actions
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { label: 'Add Habit', view: 'habits' as const, icon: <Target size={16} /> },
              { label: 'New Task', view: 'planner' as const, icon: <CheckCircle2 size={16} /> },
              { label: 'Start Focus', view: 'focus' as const, icon: <Timer size={16} /> },
              { label: 'Quick Note', view: 'notes' as const, icon: <Sparkles size={16} /> },
            ].map((action, index) => (
              <motion.button
                key={action.label}
                onClick={() => setCurrentView(action.view)}
                className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all flex flex-col items-center gap-1.5"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center text-indigo-400">
                  {action.icon}
                </div>
                <span className="text-xs font-medium">{action.label}</span>
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
