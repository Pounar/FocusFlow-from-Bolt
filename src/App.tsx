import { AnimatePresence } from 'framer-motion'
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
    <div className="min-h-screen bg-[#0a0a0f]">
      <Logo />
      <Sidebar />

      <AnimatePresence mode="wait">
        {showOnboarding && <Onboarding key="onboarding" />}
      </AnimatePresence>

      {!showOnboarding && (
        <main className="ml-0 transition-all duration-300">
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
        </main>
      )}

      <Toaster position="bottom-right" />
    </div>
  )
}

export default App
