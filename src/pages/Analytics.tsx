import { motion } from 'framer-motion'
import { useStore } from '../stores'
import { GlassCard } from '../components/ui/GlassCard'
import { ProgressRing, StreakBadge } from '../components/ui/ProgressRing'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { TrendingUp, Target, Timer, CircleCheck as CheckCircle2, Flame, Trophy, ChartBar as BarChart3 } from 'lucide-react'
import { format, subDays } from 'date-fns'
import type { Habit, Task, FocusSession } from '../types'

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function Analytics() {
  const { habits, tasks, focusSessions, stats } = useStore()

  const totalFocusMinutes = focusSessions.reduce((acc: number, s: FocusSession) => acc + s.durationMinutes, 0)
  const completedHabits = habits.filter((h: Habit) => h.todayCompleted).length
  const completedTasks = tasks.filter((t: Task) => t.status === 'completed').length

  const weeklyData = weekDays.map((day) => ({
    day,
    focus: Math.floor(Math.random() * 180) + 30,
    habits: Math.floor(Math.random() * 8),
    tasks: Math.floor(Math.random() * 5),
  }))

  const monthlyData = Array.from({ length: 30 }, (_, i) => ({
    date: format(subDays(new Date(), 29 - i), 'MMM d'),
    score: Math.floor(Math.random() * 40) + 60,
  }))

  const getLevelProgress = () => {
    if (!stats) return 0
    const currentLevelXP = stats.level * 500
    const nextLevelXP = (stats.level + 1) * 500
    const progress = ((stats.totalXp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
    return Math.min(100, Math.max(0, progress))
  }

  return (
    <motion.div
      className="px-4 py-6 md:px-6 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mb-5">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-zinc-500 text-sm">Insights into your productivity journey</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
        {[
          {
            label: 'Total Focus',
            value: `${totalFocusMinutes}m`,
            icon: <Timer className="text-cyan-400" size={20} />,
            color: 'from-cyan-500/20 to-cyan-600/20',
          },
          {
            label: 'Habits Done',
            value: completedHabits,
            icon: <Target className="text-emerald-400" size={20} />,
            color: 'from-emerald-500/20 to-emerald-600/20',
          },
          {
            label: 'Tasks Done',
            value: completedTasks,
            icon: <CheckCircle2 className="text-indigo-400" size={20} />,
            color: 'from-indigo-500/20 to-indigo-600/20',
          },
          {
            label: 'Current Streak',
            value: `${stats?.currentStreak || 0}d`,
            icon: <Flame className="text-orange-400" size={20} />,
            color: 'from-orange-500/20 to-orange-600/20',
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className={`p-4 bg-gradient-to-br ${stat.color}`}>
              <div className="flex items-center justify-between mb-2">
                {stat.icon}
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-zinc-500">{stat.label}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="text-indigo-400" size={20} />
              Weekly Focus Time
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#71717a', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#71717a', fontSize: 12 }}
                    width={40}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a24',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="focus"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#focusGradient)"
                    name="Minutes"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="text-cyan-400" size={20} />
              Productivity Score
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#71717a', fontSize: 10 }}
                    interval={4}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#71717a', fontSize: 12 }}
                    domain={[0, 100]}
                    width={40}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a24',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#22d3ee"
                    strokeWidth={2}
                    fill="url(#scoreGradient)"
                    name="Score"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-4">Level Progress</h3>
            <ProgressRing progress={getLevelProgress()} size={140} strokeWidth={10} />
            <div className="mt-4">
              <p className="text-3xl font-bold">Level {stats?.level || 1}</p>
              <p className="text-zinc-500 text-sm">{stats?.totalXp || 0} XP earned</p>
            </div>
            <div className="mt-4 text-sm text-zinc-500">
              {(stats?.level || 1) * 500 - (stats?.totalXp || 0)} XP to next level
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-4">Achievement Streak</h3>
            <StreakBadge streak={stats?.currentStreak || 0} size="lg" />
            <div className="mt-4">
              <p className="text-2xl font-bold">{stats?.currentStreak || 0} Days</p>
              <p className="text-zinc-500 text-sm">Current streak</p>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm">
              <Trophy className="text-amber-400" size={16} />
              <span className="text-zinc-400">Longest: {stats?.longestStreak || 0} days</span>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">Habit Heatmap</h3>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 28 }, (_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-sm ${
                    Math.random() > 0.6
                      ? 'bg-emerald-500/80'
                      : Math.random() > 0.3
                        ? 'bg-emerald-500/40'
                        : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-white/10" />
                <div className="w-3 h-3 rounded-sm bg-emerald-500/40" />
                <div className="w-3 h-3 rounded-sm bg-emerald-500/80" />
              </div>
              <span>More</span>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  )
}
