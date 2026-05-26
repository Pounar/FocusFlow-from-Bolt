import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useStore } from '../stores'
import { GlassCard, Button, Input } from '../components/ui/GlassCard'
import { ProgressRing } from '../components/ui/ProgressRing'
import { Target, Plus, Check, X, Flame, CreditCard as Edit3, Trash2 } from 'lucide-react'
import type { Habit } from '../types'

const habitColors = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316',
  '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
]

export function Habits() {
  const { habits, addHabit, updateHabit, deleteHabit, stats } = useStore()
  const [showAddHabit, setShowAddHabit] = useState(false)
  const [newHabitName, setNewHabitName] = useState('')
  const [newHabitColor, setNewHabitColor] = useState(habitColors[0])

  const activeHabits = habits.filter((h: Habit) => h.isActive)
  const completedToday = activeHabits.filter((h: Habit) => h.todayCompleted).length
  const progress = activeHabits.length > 0 ? (completedToday / activeHabits.length) * 100 : 0

  const handleAddHabit = () => {
    if (!newHabitName.trim()) return

    const habit: Habit = {
      id: crypto.randomUUID(),
      userId: 'local',
      name: newHabitName.trim(),
      description: '',
      icon: 'star',
      color: newHabitColor,
      frequency: 'daily',
      targetCount: 1,
      reminderTime: null,
      isActive: true,
      orderIndex: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      todayCompleted: false,
      todayCount: 0,
      streak: 0,
    }

    addHabit(habit)
    setNewHabitName('')
    setShowAddHabit(false)
  }

  const toggleHabitComplete = (habitId: string) => {
    const habit = habits.find((h: Habit) => h.id === habitId)
    if (!habit) return

    updateHabit(habitId, {
      todayCompleted: !habit.todayCompleted,
      todayCount: habit.todayCompleted ? 0 : 1,
      streak: habit.todayCompleted ? Math.max(0, (habit.streak || 0) - 1) : (habit.streak || 0) + 1,
    })
  }

  return (
    <motion.div
      className="px-4 py-6 md:px-6 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold">Habits</h1>
          <p className="text-zinc-500 text-sm">Build consistency, achieve greatness</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-zinc-500">Today's Progress</p>
            <p className="text-lg font-bold">{completedToday}/{activeHabits.length}</p>
          </div>
          <ProgressRing progress={progress} size={52} strokeWidth={5} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <GlassCard className="p-3">
          <div className="flex items-center gap-2">
            <Flame className="text-orange-400" size={18} />
            <div>
              <p className="text-[10px] text-zinc-500">Streak</p>
              <p className="text-base font-bold">{stats?.currentStreak || 0}d</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-3">
          <div className="flex items-center gap-2">
            <Target className="text-indigo-400" size={20} />
            <div>
              <p className="text-xs text-zinc-500">Total</p>
              <p className="text-lg font-bold">{activeHabits.length}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="mb-4">
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowAddHabit(true)}
          icon={<Plus size={16} />}
        >
          Add Habit
        </Button>
      </div>

      <AnimatePresence>
        {showAddHabit && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <GlassCard className="p-4">
              <div className="flex items-center gap-4 mb-4">
                <Input
                  placeholder="Habit name..."
                  value={newHabitName}
                  onChange={setNewHabitName}
                  className="flex-1"
                />
                <Button variant="primary" onClick={handleAddHabit}>
                  <Check size={18} />
                </Button>
                <Button variant="ghost" onClick={() => setShowAddHabit(false)}>
                  <X size={18} />
                </Button>
              </div>

              <div className="flex gap-2 flex-wrap">
                {habitColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewHabitColor(color)}
                    className={`w-8 h-8 rounded-lg transition-all ${
                      newHabitColor === color ? 'ring-2 ring-white scale-110' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {activeHabits.map((habit: Habit, index: number) => (
            <motion.div
              key={habit.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, x: -100 }}
              transition={{ delay: index * 0.03 }}
            >
              <GlassCard
                className={`p-3 ${habit.todayCompleted ? 'opacity-75' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={() => toggleHabitComplete(habit.id)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                      habit.todayCompleted
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-white/5 hover:bg-white/10 text-zinc-400'
                    }`}
                    style={{ borderLeft: `3px solid ${habit.color}` }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {habit.todayCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500 }}
                      >
                        <Check size={20} />
                      </motion.div>
                    ) : (
                      <Target size={20} />
                    )}
                  </motion.button>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium">{habit.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Flame size={12} className="text-orange-400" />
                        {habit.streak || 0}d
                      </span>
                      {habit.frequency === 'daily' && (
                        <span>Daily</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <motion.button
                      className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Edit3 size={16} />
                    </motion.button>
                    <motion.button
                      onClick={() => deleteHabit(habit.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>

        {activeHabits.length === 0 && !showAddHabit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Target className="mx-auto mb-3 text-zinc-600" size={40} />
            <h3 className="text-lg font-semibold mb-1 text-zinc-400">No habits yet</h3>
            <p className="text-zinc-500 mb-4">Start building your daily routine</p>
            <Button variant="primary" onClick={() => setShowAddHabit(true)}>
              <Plus size={18} />
              Add Your First Habit
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
