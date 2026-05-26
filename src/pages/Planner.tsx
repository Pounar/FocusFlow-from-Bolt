import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useStore } from '../stores'
import { GlassCard, Button, Input } from '../components/ui/GlassCard'
import {
  Calendar,
  Plus,
  Check,
  Sparkles,
  Clock,
  Flag,
  Trash2 as Trash,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { format, addDays, startOfWeek, isToday, isSameDay } from 'date-fns'
import type { Task } from '../types'

export function Planner() {
  const { tasks, addTask, updateTask, deleteTask } = useStore()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<1 | 2 | 3 | 4>(2)
  const [generatePlanOpen, setGeneratePlanOpen] = useState(false)

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const dayTasks = tasks.filter((t: Task) => {
    if (!t.dueDate) return isToday(selectedDate) && t.status === 'pending'
    return isSameDay(new Date(t.dueDate), selectedDate)
  })

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return

    const task: Task = {
      id: crypto.randomUUID(),
      userId: 'local',
      title: newTaskTitle.trim(),
      description: '',
      status: 'pending',
      priority: newTaskPriority,
      category: 'general',
      tags: [],
      dueDate: selectedDate,
      completedAt: null,
      estimatedDuration: null,
      actualDuration: null,
      isRecurring: false,
      recurrenceRule: null,
      orderIndex: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    addTask(task)
    setNewTaskTitle('')
    setShowAddTask(false)
  }

  const toggleTaskComplete = (taskId: string) => {
    const task = tasks.find((t: Task) => t.id === taskId)
    if (!task) return

    updateTask(taskId, {
      status: task.status === 'completed' ? 'pending' : 'completed',
      completedAt: task.status === 'completed' ? null : new Date(),
    })
  }

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'text-red-400 bg-red-500/20'
      case 2: return 'text-yellow-400 bg-yellow-500/20'
      case 3: return 'text-blue-400 bg-blue-500/20'
      case 4: return 'text-zinc-400 bg-zinc-500/20'
      default: return 'text-zinc-400 bg-zinc-500/20'
    }
  }

  return (
    <motion.div
      className="px-4 py-5 md:px-6 lg:px-8 max-w-5xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Planner</h1>
          <p className="text-zinc-500 text-sm">Plan your day for maximum productivity</p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setGeneratePlanOpen(true)}
        >
          <Sparkles size={16} />
          Generate My Day
        </Button>
      </div>

      <GlassCard className="p-3 mb-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setSelectedDate(addDays(weekStart, -7))}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex gap-1">
            {weekDays.map((day) => (
              <motion.button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`flex flex-col items-center p-2 rounded-lg transition-all min-w-[42px] ${
                  isSameDay(day, selectedDate)
                    ? 'bg-indigo-500/20 border border-indigo-500/30'
                    : 'hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-[10px] text-zinc-500">{format(day, 'EEE')}</span>
                <span className={`text-sm font-semibold ${isToday(day) ? 'text-indigo-400' : ''}`}>
                  {format(day, 'd')}
                </span>
              </motion.button>
            ))}
          </div>

          <button
            onClick={() => setSelectedDate(addDays(weekStart, 7))}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="flex items-center justify-center">
          <h2 className="text-sm font-medium">
            {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEE, MMM d')}
          </h2>
        </div>
      </GlassCard>

      <AnimatePresence>
        {generatePlanOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <GlassCard className="p-4 bg-gradient-to-br from-fuchsia-500/10 to-indigo-500/10 border-fuchsia-500/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-lg bg-fuchsia-500/20 flex items-center justify-center">
                  <Sparkles className="text-fuchsia-400" size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">AI Daily Plan Generator</h3>
                  <p className="text-[10px] text-zinc-500">Let AI optimize your schedule</p>
                </div>
              </div>

              <p className="text-xs text-zinc-400 mb-3">
                Our AI will analyze your habits, tasks, and preferences to create an optimized daily schedule.
              </p>

              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    const sampleTasks = [
                      { title: 'Morning routine', priority: 2 as const },
                      { title: 'Deep work block', priority: 1 as const },
                      { title: 'Lunch break', priority: 3 as const },
                      { title: 'Focus session', priority: 1 as const },
                      { title: 'Review & planning', priority: 2 as const },
                    ]

                    sampleTasks.forEach((t, i) => {
                      const task: Task = {
                        id: crypto.randomUUID(),
                        userId: 'local',
                        title: t.title,
                        description: '',
                        status: 'pending',
                        priority: t.priority,
                        category: 'general',
                        tags: [],
                        dueDate: selectedDate,
                        completedAt: null,
                        estimatedDuration: 60,
                        actualDuration: null,
                        isRecurring: false,
                        recurrenceRule: null,
                        orderIndex: i,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                      }
                      addTask(task)
                    })

                    setGeneratePlanOpen(false)
                  }}
                >
                  <Sparkles size={14} />
                  Generate
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setGeneratePlanOpen(false)}>
                  Cancel
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">
          Tasks ({dayTasks.filter((t: Task) => t.status === 'pending').length} pending)
        </h2>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowAddTask(true)}
        >
          <Plus size={14} />
          Add
        </Button>
      </div>

      <AnimatePresence>
        {showAddTask && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-3"
          >
            <GlassCard className="p-3">
              <Input
                placeholder="Task title..."
                value={newTaskTitle}
                onChange={setNewTaskTitle}
                className="mb-2"
              />

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-zinc-500">Priority:</span>
                {([1, 2, 3, 4] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setNewTaskPriority(p)}
                    className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                      newTaskPriority === p ? getPriorityColor(p) : 'bg-white/5 text-zinc-400'
                    }`}
                  >
                    {p === 1 ? 'High' : p === 2 ? 'Med' : p === 3 ? 'Low' : 'Opt'}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="primary" size="sm" onClick={handleAddTask}>
                  <Check size={14} />
                  Add
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowAddTask(false)}>
                  Cancel
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {dayTasks.map((task: Task, index: number) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, x: -100 }}
              transition={{ delay: index * 0.02 }}
            >
              <GlassCard
                className={`p-3 ${task.status === 'completed' ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={() => toggleTaskComplete(task.id)}
                    className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${
                      task.status === 'completed'
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-white/20 hover:border-indigo-400'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {task.status === 'completed' && <Check size={12} />}
                  </motion.button>

                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-zinc-500' : ''}`}>
                      {task.title}
                    </h3>
                    {task.estimatedDuration && (
                      <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                        <Clock size={10} />
                        <span>{task.estimatedDuration}m</span>
                      </div>
                    )}
                  </div>

                  <div className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getPriorityColor(task.priority)}`}>
                    <Flag size={10} className="inline mr-0.5" />
                    {task.priority === 1 ? 'H' : task.priority === 2 ? 'M' : task.priority === 3 ? 'L' : 'O'}
                  </div>

                  <motion.button
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash size={14} />
                  </motion.button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>

        {dayTasks.length === 0 && !showAddTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-zinc-500"
          >
            <Calendar className="mx-auto mb-2 opacity-50" size={32} />
            <p className="text-sm font-medium">No tasks for this day</p>
            <p className="text-xs">Add tasks or generate an AI plan</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
