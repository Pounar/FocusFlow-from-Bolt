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
  Trash,
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
      className="p-6 md:p-8 max-w-5xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Planner</h1>
          <p className="text-zinc-500">Plan your day for maximum productivity</p>
        </div>

        <Button
          variant="primary"
          onClick={() => setGeneratePlanOpen(true)}
        >
          <Sparkles size={18} />
          Generate My Day
        </Button>
      </div>

      <GlassCard className="p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setSelectedDate(addDays(weekStart, -7))}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-2">
            {weekDays.map((day) => (
              <motion.button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`flex flex-col items-center p-3 rounded-xl transition-all min-w-[60px] ${
                  isSameDay(day, selectedDate)
                    ? 'bg-indigo-500/20 border border-indigo-500/30'
                    : 'hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-xs text-zinc-500">{format(day, 'EEE')}</span>
                <span className={`text-lg font-semibold ${isToday(day) ? 'text-indigo-400' : ''}`}>
                  {format(day, 'd')}
                </span>
              </motion.button>
            ))}
          </div>

          <button
            onClick={() => setSelectedDate(addDays(weekStart, 7))}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex items-center justify-center">
          <h2 className="text-lg font-semibold">
            {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE, MMMM d')}
          </h2>
        </div>
      </GlassCard>

      <AnimatePresence>
        {generatePlanOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <GlassCard className="p-6 bg-gradient-to-br from-fuchsia-500/10 to-indigo-500/10 border-fuchsia-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-fuchsia-500/20 flex items-center justify-center">
                  <Sparkles className="text-fuchsia-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">AI Daily Plan Generator</h3>
                  <p className="text-sm text-zinc-500">Let AI optimize your schedule</p>
                </div>
              </div>

              <p className="text-sm text-zinc-400 mb-4">
                Our AI will analyze your habits, tasks, and preferences to create an optimized daily schedule.
              </p>

              <div className="flex gap-3">
                <Button
                  variant="primary"
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
                  <Sparkles size={16} />
                  Generate Plan
                </Button>
                <Button variant="ghost" onClick={() => setGeneratePlanOpen(false)}>
                  Cancel
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Tasks ({dayTasks.filter((t: Task) => t.status === 'pending').length} pending)
        </h2>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowAddTask(true)}
        >
          <Plus size={16} />
          Add Task
        </Button>
      </div>

      <AnimatePresence>
        {showAddTask && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4"
          >
            <GlassCard className="p-4">
              <Input
                placeholder="Task title..."
                value={newTaskTitle}
                onChange={setNewTaskTitle}
                className="mb-3"
              />

              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm text-zinc-500">Priority:</span>
                {([1, 2, 3, 4] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setNewTaskPriority(p)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      newTaskPriority === p ? getPriorityColor(p) : 'bg-white/5 text-zinc-400'
                    }`}
                  >
                    {p === 1 ? 'High' : p === 2 ? 'Medium' : p === 3 ? 'Low' : 'Optional'}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="primary" onClick={handleAddTask}>
                  <Check size={16} />
                  Add Task
                </Button>
                <Button variant="ghost" onClick={() => setShowAddTask(false)}>
                  Cancel
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {dayTasks.map((task: Task, index: number) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, x: -100 }}
              transition={{ delay: index * 0.03 }}
            >
              <GlassCard
                className={`p-4 ${task.status === 'completed' ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <motion.button
                    onClick={() => toggleTaskComplete(task.id)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${
                      task.status === 'completed'
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-white/20 hover:border-indigo-400'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {task.status === 'completed' && <Check size={14} />}
                  </motion.button>

                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-zinc-500' : ''}`}>
                      {task.title}
                    </h3>
                    {task.estimatedDuration && (
                      <div className="flex items-center gap-1 text-xs text-zinc-500 mt-1">
                        <Clock size={12} />
                        <span>{task.estimatedDuration} min</span>
                      </div>
                    )}
                  </div>

                  <div className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    <Flag size={12} className="inline mr-1" />
                    {task.priority === 1 ? 'High' : task.priority === 2 ? 'Med' : task.priority === 3 ? 'Low' : 'Opt'}
                  </div>

                  <motion.button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 rounded-lg hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash size={16} />
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
            className="text-center py-12 text-zinc-500"
          >
            <Calendar className="mx-auto mb-3 opacity-50" size={40} />
            <p className="font-medium mb-1">No tasks for this day</p>
            <p className="text-sm">Add tasks or generate an AI plan</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
