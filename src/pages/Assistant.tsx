import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { useStore } from '../stores'
import { GlassCard } from '../components/ui/GlassCard'
import {
  Sparkles,
  Send,
  User,
  Bot,
} from 'lucide-react'
import { format } from 'date-fns'
import type { Habit, Task } from '../types'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const suggestions = [
  "How can I be more productive today?",
  "Suggest a morning routine for focus",
  "Help me plan my deep work sessions",
  "What habits should I track?",
]

const aiResponses: Record<string, string> = {
  "How can I be more productive today?": `Here are some strategies to boost your productivity:

1. **Start with your most important task** - Tackle your hardest task when your energy is highest (usually morning).

2. **Use the Pomodoro Technique** - Work in focused 25-minute blocks with 5-minute breaks.

3. **Batch similar tasks** - Group related tasks to reduce context switching.

4. **Eliminate distractions** - Put your phone in another room, use website blockers.

5. **Take proper breaks** - Rest intentionally, not by scrolling social media.

Would you like me to help you create a specific plan for today?`,

  "Suggest a morning routine for focus": `Here's an optimal morning routine for maximum focus:

**6:00-6:30** - Wake up, hydrate, light stretching
**6:30-7:00** - Mindfulness or meditation
**7:00-7:30** - Healthy breakfast, no screens
**7:30-8:00** - Review daily goals, plan your top 3 priorities
**8:00-10:00** - Deep work block #1 (most important task)
**10:00-10:30** - Break, movement, refresh

Key principles:
- No phone/social media for first hour
- Natural light exposure
- Protein-rich breakfast for sustained energy
- Start with hardest task first

Want me to adjust this timing based on your schedule?`,

  "Help me plan my deep work sessions": `Let's optimize your deep work schedule:

**Optimal Deep Work Windows:**
Based on typical energy patterns:
- Morning (8-11am): Peak cognitive performance
- After lunch lull (1-3pm): Lighter tasks only
- Afternoon recovery (3-5pm): Second wind period

**Recommended Structure:**
1. **Block 1** (9am-11am): 2 hours, hardest project
2. **Block 2** (3pm-5pm): 1.5-2 hours, secondary focus

**Environment Setup:**
- Dedicated workspace
- Phone silenced and away
- "Do Not Disturb" mode on all devices
- Water and snacks prepared
- Clear desk, only essential materials

**Between Sessions:**
- Walk outside
- No screens
- Hydrate
- Light meal

Would you like me to set up focus reminders?`,

  "What habits should I track?": `Here are the most impactful habits to track:

**Foundation Habits:**
1. **Sleep** - 7-8 hours, consistent bedtime
2. **Hydration** - 8 glasses of water
3. **Movement** - 30 min exercise
4. **Mindfulness** - 10 min meditation

**Productivity Habits:**
5. **Morning routine** - Start the day right
6. **Deep work** - 2+ hours focused time
7. **Planning** - Review tomorrow's goals
8. **Reading** - 20 minutes learning

**Well-being Habits:**
9. **Gratitude** - Write 3 things
10. **No screens before bed** - 1 hour buffer

**Tracking Strategy:**
Start with just 3-4 habits. Once consistent for 2 weeks, add 1-2 more. Stack habits with existing routines.

Which of these resonate most with your goals?`,
}

export function Assistant() {
  const { stats, habits, tasks } = useStore()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm your AI productivity assistant. I can help you:

- Plan your day for maximum focus
- Suggest habit improvements
- Optimize your work schedule
- Provide motivation and tips

What would you like help with today?`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')

    setTimeout(() => {
      const response = aiResponses[input.trim()] || `I understand you're asking about "${input.trim()}".

Based on your current progress:
- You've completed ${habits.filter((h: Habit) => h.todayCompleted).length}/${habits.length} habits today
- You have ${tasks.filter((t: Task) => t.status === 'pending').length} pending tasks
- Your current streak is ${stats?.currentStreak || 0} days

Here are my suggestions:
1. Focus on completing your remaining habits to maintain your streak
2. Prioritize high-impact tasks from your pending list
3. Schedule a deep work session for your most important task

Would you like more specific advice on any of these areas?`

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
    }, 1000)
  }

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion)
  }

  return (
    <motion.div
      className="h-full flex flex-col w-full px-4 py-6 md:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-fuchsia-500 to-indigo-500 flex items-center justify-center">
            <Sparkles size={18} />
          </div>
          <div>
            <h1 className="text-xl font-bold">AI Assistant</h1>
            <p className="text-xs text-zinc-500">Your personal productivity coach</p>
          </div>
        </div>
      </div>

      <GlassCard className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                  message.role === 'user'
                    ? 'bg-indigo-500/20'
                    : 'bg-gradient-to-br from-fuchsia-500 to-indigo-500'
                }`}>
                  {message.role === 'user' ? (
                    <User size={16} />
                  ) : (
                    <Bot size={16} />
                  )}
                </div>

                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-indigo-500/20'
                    : 'bg-white/5'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs text-zinc-600 mt-2">
                    {format(message.timestamp, 'h:mm a')}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="px-4 pb-4">
            <p className="text-xs text-zinc-500 mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <motion.button
                  key={suggestion}
                  onClick={() => handleSuggestion(suggestion)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-zinc-400 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 border-t border-white/5">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about productivity..."
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500/50 transition-colors"
            />
            <motion.button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Send size={20} />
            </motion.button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
