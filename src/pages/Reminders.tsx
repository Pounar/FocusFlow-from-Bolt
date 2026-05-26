import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useStore } from '../stores'
import { GlassCard, Button, Input } from '../components/ui/GlassCard'
import {
  Bell,
  Plus,
  Check,
  Clock,
  Trash2,
  Repeat,
  Calendar,
} from 'lucide-react'
import { format } from 'date-fns'
import type { Reminder } from '../types'

export function Reminders() {
  const { reminders, addReminder, updateReminder, deleteReminder } = useStore()
  const [showAddReminder, setShowAddReminder] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')

  const activeReminders = reminders
    .filter((r: Reminder) => r.isActive && !r.isDismissed)
    .sort((a: Reminder, b: Reminder) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime())

  const pastReminders = reminders
    .filter((r: Reminder) => r.isDismissed || new Date(r.scheduledFor) < new Date())
    .sort((a: Reminder, b: Reminder) => new Date(b.scheduledFor).getTime() - new Date(a.scheduledFor).getTime())

  const handleAddReminder = () => {
    if (!newTitle.trim() || !newDate || !newTime) return

    const scheduledFor = new Date(`${newDate}T${newTime}:00`)

    const reminder: Reminder = {
      id: crypto.randomUUID(),
      userId: 'local',
      title: newTitle.trim(),
      description: '',
      type: 'one_time',
      scheduledFor,
      recurrenceRule: null,
      isActive: true,
      isDismissed: false,
      dismissedAt: null,
      relatedHabitId: null,
      relatedTaskId: null,
      createdAt: new Date(),
    }

    addReminder(reminder)

    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission()
    }

    setNewTitle('')
    setNewDate('')
    setNewTime('')
    setShowAddReminder(false)
  }

  const dismissReminder = (id: string) => {
    updateReminder(id, {
      isDismissed: true,
      dismissedAt: new Date(),
    })
  }

  const getRelativeTime = (date: Date) => {
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))

    if (diff < 0) return 'Past'
    if (days > 0) return `in ${days} day${days > 1 ? 's' : ''}`
    if (hours > 0) return `in ${hours} hour${hours > 1 ? 's' : ''}`
    if (minutes > 0) return `in ${minutes} minute${minutes > 1 ? 's' : ''}`
    return 'Now'
  }

  return (
    <motion.div
      className="px-4 py-6 md:px-6 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold">Reminders</h1>
          <p className="text-zinc-500 text-sm">Never miss an important moment</p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowAddReminder(true)}
        >
          <Plus size={14} />
          Add
        </Button>
      </div>

      {'Notification' in window && Notification.permission !== 'granted' && (
        <GlassCard className="p-4 mb-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20">
          <div className="flex items-center gap-3">
            <Bell className="text-amber-400" size={24} />
            <div>
              <p className="font-medium">Enable Notifications</p>
              <p className="text-sm text-zinc-500">Get alerts even when the app is closed</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => Notification.requestPermission()}
              className="ml-auto"
            >
              Enable
            </Button>
          </div>
        </GlassCard>
      )}

      <AnimatePresence>
        {showAddReminder && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <GlassCard className="p-4">
              <h3 className="text-lg font-semibold mb-4">New Reminder</h3>

              <Input
                placeholder="Reminder title..."
                value={newTitle}
                onChange={setNewTitle}
                className="mb-3"
              />

              <div className="flex gap-3 mb-4">
                <div className="flex-1">
                  <label className="text-sm text-zinc-500 mb-1 block">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-indigo-500/50 transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-zinc-500 mb-1 block">Time</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-indigo-500/50 transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="primary" onClick={handleAddReminder}>
                  <Check size={16} />
                  Create
                </Button>
                <Button variant="ghost" onClick={() => setShowAddReminder(false)}>
                  Cancel
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Bell size={20} className="text-indigo-400" />
        Upcoming ({activeReminders.length})
      </h2>

      <div className="space-y-3 mb-8">
        <AnimatePresence mode="popLayout">
          {activeReminders.map((reminder: Reminder, index: number) => {
            const scheduledDate = new Date(reminder.scheduledFor)
            const relativeTime = getRelativeTime(scheduledDate)

            return (
              <motion.div
                key={reminder.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      relativeTime === 'Now'
                        ? 'bg-indigo-500/20 animate-pulse'
                        : 'bg-white/5'
                    }`}>
                      <Bell className={relativeTime === 'Now' ? 'text-indigo-400' : 'text-zinc-400'} size={20} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{reminder.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-zinc-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {format(scheduledDate, 'MMM d')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {format(scheduledDate, 'h:mm a')}
                        </span>
                        {reminder.type === 'recurring' && (
                          <span className="flex items-center gap-1 text-cyan-400">
                            <Repeat size={14} />
                            Recurring
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={`text-sm font-medium px-2 py-1 rounded-lg ${
                      relativeTime === 'Now' ? 'bg-indigo-500/20 text-indigo-400' :
                      relativeTime === 'Past' ? 'text-zinc-500' : 'text-zinc-400'
                    }`}>
                      {relativeTime}
                    </div>

                    <motion.button
                      onClick={() => dismissReminder(reminder.id)}
                      className="p-2 rounded-lg hover:bg-emerald-500/20 text-zinc-400 hover:text-emerald-400 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Check size={18} />
                    </motion.button>
                    <motion.button
                      onClick={() => deleteReminder(reminder.id)}
                      className="p-2 rounded-lg hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {activeReminders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-zinc-500"
          >
            <Bell className="mx-auto mb-2 opacity-50" size={32} />
            <p>No upcoming reminders</p>
          </motion.div>
        )}
      </div>

      {pastReminders.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-4 text-zinc-500">Past</h2>
          <div className="space-y-2 opacity-60">
            {pastReminders.slice(0, 5).map((reminder: Reminder) => (
              <div
                key={reminder.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
              >
                <Bell size={16} className="text-zinc-600" />
                <span className="text-zinc-400 line-through">{reminder.title}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  )
}
