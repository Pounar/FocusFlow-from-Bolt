import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from './stores'
import { Logo } from './components/ui/Logo'
import { Sidebar } from './components/layout/Sidebar'
import { Onboarding } from './components/layout/Onboarding'
import { Dashboard } from './pages/Dashboard'
import { Habits } from './pages/Habits'
import { Planner } from './pages/Planner'
import { FocusMode } from './pages/FocusMode'
import { Notes } from './pages/Notes'
import { Reminders } from './pages/Reminders'
import { Analytics } from './pages/Analytics'
import { Settings } from './pages/Settings'
import { Assistant } from './pages/Assistant'
import { Toaster } from 'react-hot-toast'

function App() {
  const { currentView, showOnboarding, isFocusModeActive } = useStore()

  if (isFocusModeActive) {
    return (
      <>
        <FocusMode />
        <Toaster position="bottom-right" />
      </>
    )
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#050507] relative">
      {/* Animated background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px]"
          animate={{
            x: [-100, 100, -100],
            y: [-50, 50, -50],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[150px]"
          animate={{
            x: [100, -100, 100],
            y: [50, -50, 50],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-0 left-1/2 w-[400px] h-[400px] bg-fuchsia-500/8 rounded-full blur-[120px]"
          animate={{
            x: [-50, 50, -50],
            y: [30, -30, 30],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <Logo />
      <Sidebar />

      <AnimatePresence mode="wait">
        {showOnboarding && <Onboarding key="onboarding" />}
      </AnimatePresence>

      {!showOnboarding && (
        <main className="h-full overflow-y-auto flex justify-center relative z-10">
          <div className="w-full max-w-6xl">
            <AnimatePresence mode="wait">
              {currentView === 'dashboard' && <Dashboard key="dashboard" />}
              {currentView === 'habits' && <Habits key="habits" />}
              {currentView === 'planner' && <Planner key="planner" />}
              {currentView === 'focus' && <FocusMode key="focus" />}
              {currentView === 'notes' && <Notes key="notes" />}
              {currentView === 'reminders' && <Reminders key="reminders" />}
              {currentView === 'analytics' && <Analytics key="analytics" />}
              {currentView === 'settings' && <Settings key="settings" />}
              {currentView === 'assistant' && <Assistant key="assistant" />}
            </AnimatePresence>
          </div>
        </main>
      )}

      <Toaster position="bottom-right" />
    </div>
  )
}

export default App