import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useStore } from '../stores'
import { GlassCard, Button } from '../components/ui/GlassCard'
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Coffee,
  Target,
  Zap,
} from 'lucide-react'
import type { FocusSession } from '../types'

type TimerPhase = 'work' | 'break' | 'longBreak'

export function FocusMode() {
  const { addFocusSession, preferences } = useStore()

  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(preferences?.focusDuration || 25 * 60)
  const [phase, setPhase] = useState<TimerPhase>('work')
  const [sessions, setSessions] = useState(0)
  const [isMuted, setIsMuted] = useState(false)

  const focusDuration = preferences?.focusDuration || 25
  const breakDuration = preferences?.breakDuration || 5
  const longBreakDuration = 15

  const totalTime = phase === 'work'
    ? focusDuration * 60
    : phase === 'break'
      ? breakDuration * 60
      : longBreakDuration * 60

  const progress = ((totalTime - timeLeft) / totalTime) * 100

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handlePhaseComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning])

  const handlePhaseComplete = () => {
    setIsRunning(false)

    if (phase === 'work') {
      const newSessions = sessions + 1
      setSessions(newSessions)

      const session: FocusSession = {
        id: crypto.randomUUID(),
        userId: 'local',
        taskId: null,
        sessionType: 'pomodoro',
        durationMinutes: focusDuration,
        startedAt: new Date(Date.now() - focusDuration * 60 * 1000),
        endedAt: new Date(),
        wasCompleted: true,
        distractionsCount: 0,
        notes: '',
        createdAt: new Date(),
      }

      addFocusSession(session)

      if (newSessions % 4 === 0) {
        setPhase('longBreak')
        setTimeLeft(longBreakDuration * 60)
      } else {
        setPhase('break')
        setTimeLeft(breakDuration * 60)
      }
    } else {
      setPhase('work')
      setTimeLeft(focusDuration * 60)
    }
  }

  const toggleTimer = () => {
    if (!isRunning && timeLeft === 0) {
      resetTimer()
    }
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(phase === 'work' ? focusDuration * 60 : phase === 'break' ? breakDuration * 60 : longBreakDuration * 60)
  }

  const skipPhase = () => {
    setIsRunning(false)
    if (phase === 'work') {
      const newSessions = sessions + 1
      setSessions(newSessions)

      if (newSessions % 4 === 0) {
        setPhase('longBreak')
        setTimeLeft(longBreakDuration * 60)
      } else {
        setPhase('break')
        setTimeLeft(breakDuration * 60)
      }
    } else {
      setPhase('work')
      setTimeLeft(focusDuration * 60)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const enterFullscreen = () => {
    const elem = document.documentElement
    if (elem.requestFullscreen) {
      elem.requestFullscreen()
    }
  }

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <AnimatePresence mode="wait">
        {phase === 'work' ? (
          <motion.div
            key="work"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-8">
              <Target className="text-indigo-400" size={28} />
              <h1 className="text-3xl font-bold">Focus Time</h1>
            </div>
            <p className="text-zinc-500 mb-12">Stay focused and achieve your goals</p>
          </motion.div>
        ) : (
          <motion.div
            key="break"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-8">
              <Coffee className="text-cyan-400" size={28} />
              <h1 className="text-3xl font-bold">
                {phase === 'longBreak' ? 'Long Break' : 'Break Time'}
              </h1>
            </div>
            <p className="text-zinc-500 mb-12">Take a break and recharge</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative mb-12">
        <motion.div
          className="w-72 h-72 md:w-80 md:h-80 rounded-full relative flex items-center justify-center"
          style={{
            background: `conic-gradient(from 0deg, ${
              phase === 'work' ? '#6366f1' : '#22d3ee'
            } ${progress}%, rgba(255,255,255,0.1) ${progress}%)`,
          }}
          animate={{
            boxShadow: isRunning
              ? [
                  `0 0 60px ${phase === 'work' ? 'rgba(99,102,241,0.4)' : 'rgba(34,211,238,0.4)'}`,
                  `0 0 100px ${phase === 'work' ? 'rgba(99,102,241,0.6)' : 'rgba(34,211,238,0.6)'}`,
                  `0 0 60px ${phase === 'work' ? 'rgba(99,102,241,0.4)' : 'rgba(34,211,238,0.4)'}`,
                ]
              : '0 0 40px rgba(99,102,241,0.2)',
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="absolute inset-4 rounded-full bg-[#0a0a0f] flex items-center justify-center">
            <motion.span
              className="text-6xl md:text-7xl font-bold tabular-nums"
              animate={{
                color: isRunning
                  ? phase === 'work' ? '#ffffff' : '#22d3ee'
                  : '#a1a1aa'
              }}
            >
              {formatTime(timeLeft)}
            </motion.span>
          </div>
        </motion.div>

        {isRunning && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              scale: [1, 1.02, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background: `radial-gradient(circle, ${phase === 'work' ? 'rgba(99,102,241,0.1)' : 'rgba(34,211,238,0.1)'} 0%, transparent 70%)`,
            }}
          />
        )}
      </div>

      <div className="flex items-center gap-4 mb-8">
        <motion.button
          onClick={toggleTimer}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
            isRunning
              ? 'bg-white/10 hover:bg-white/20'
              : 'bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isRunning ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
        </motion.button>

        <motion.button
          onClick={resetTimer}
          className="p-4 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw size={20} />
        </motion.button>

        <motion.button
          onClick={skipPhase}
          className="p-4 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Zap size={20} />
        </motion.button>
      </div>

      <GlassCard className="p-4 mb-6">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-zinc-500 text-xs mb-1">Sessions</p>
            <p className="text-2xl font-bold">{sessions}</p>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-center">
            <p className="text-zinc-500 text-xs mb-1">Total Focus</p>
            <p className="text-2xl font-bold">{sessions * focusDuration}m</p>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-center">
            <p className="text-zinc-500 text-xs mb-1">XP</p>
            <motion.p
              className="text-2xl font-bold text-fuchsia-400"
              animate={sessions > 0 ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              +{sessions * 50}
            </motion.p>
          </div>
        </div>
      </GlassCard>

      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={() => setIsMuted(!isMuted)}>
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </Button>
        <Button variant="ghost" onClick={enterFullscreen}>
          <Maximize2 size={18} />
        </Button>
      </div>

      <motion.div
        className="fixed bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs text-zinc-600">
          Tip: Focus for optimal productivity. Take breaks to recharge.
        </p>
      </motion.div>
    </motion.div>
  )
}
