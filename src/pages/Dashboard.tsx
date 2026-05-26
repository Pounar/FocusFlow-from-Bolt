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
      className="px-4 py-6 md:px-6 w-full"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={staggerItem} className="mb-6">
        <p className="text-zinc-500 text-xs mb-0.5">{format(new Date(), 'EEEE, MMMM d')}</p>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Good {getGreeting()}!
        </h1>
        <p className="text-zinc-500 text-sm mt-1">Here's your productivity overview</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <motion.div variants={staggerItem}>
          <GlassCard className="p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.08] via-transparent to-cyan-500/[0.08] pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-zinc-400 text-xs mb-0.5 font-medium">Daily Progress</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">{completedToday}<span className="text-zinc-500">/{todayHabits.length}</span></p>
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
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={staggerItem}>
          <GlassCard className="p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.08] via-transparent to-cyan-500/[0.15] pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-zinc-400 text-xs mb-0.5 font-medium">Focus Time</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">{todayFocusMinutes}</p>
                  <p className="text-zinc-500 text-[10px]">minutes today</p>
                </div>
                <motion.div
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500/30 to-cyan-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                  animate={{ boxShadow: ['0 0 20px rgba(99,102,241,0.3)', '0 0 30px rgba(34,211,238,0.4)', '0 0 20px rgba(99,102,241,0.3)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Timer className="text-indigo-300" size={24} />
                </motion.div>
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
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={staggerItem}>
          <GlassCard className="p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.08] via-transparent to-red-500/[0.08] pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-zinc-400 text-xs mb-0.5 font-medium">Streak</p>
                  <p className="text-zinc-500 text-[10px]">Keep it going!</p>
                </div>
                <motion.div
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500/30 to-red-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(251,146,60,0.3)]"
                  animate={stats?.currentStreak ? {
                    boxShadow: ['0 0 20px rgba(251,146,60,0.3)', '0 0 30px rgba(251,146,60,0.5)', '0 0 20px rgba(251,146,60,0.3)']
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-xl font-bold bg-gradient-to-br from-orange-300 to-orange-500 bg-clip-text text-transparent">{stats?.currentStreak || 0}</span>
                </motion.div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <TrendingUp className="text-emerald-400" size={14} />
                <span className="text-zinc-400">Longest: <span className="font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">{stats?.longestStreak || 0}d</span></span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
        <motion.div variants={staggerItem}>
          <GlassCard className="p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold flex items-center gap-2">
                  <Target className="text-indigo-400" size={18} />
                  <span className="bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">Today's Habits</span>
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
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] hover:border-white/[0.1] transition-all cursor-pointer"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        habit.todayCompleted
                          ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
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
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={staggerItem}>
          <GlassCard className="p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-fuchsia-500/10 via-indigo-500/5 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold flex items-center gap-2">
                  <Sparkles className="text-fuchsia-400" size={18} />
                  <span className="bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">AI Daily Plan</span>
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setCurrentView('planner')} className="text-xs">
                  View All
                </Button>
              </div>

              <motion.div
                className="p-3 rounded-xl bg-gradient-to-br from-fuchsia-500/15 via-indigo-500/10 to-cyan-500/15 border border-fuchsia-500/20 mb-3 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                style={{ boxShadow: '0 0 30px rgba(168,85,247,0.15)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <motion.div
                    className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500/30 to-pink-500/30 flex items-center justify-center"
                    animate={{ boxShadow: ['0 0 15px rgba(168,85,247,0.3)', '0 0 25px rgba(168,85,247,0.5)', '0 0 15px rgba(168,85,247,0.3)'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="text-fuchsia-300" size={16} />
                  </motion.div>
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

              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Tasks</span>
                  <span className="font-medium bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">{completedTasks}/{tasks.length} done</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full relative"
                    style={{
                      background: 'linear-gradient(90deg, #6366f1 0%, #818cf8 50%, #22d3ee 100%)',
                      boxShadow: '0 0 10px rgba(99,102,241,0.4)'
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
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
