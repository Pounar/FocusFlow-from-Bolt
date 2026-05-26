import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../stores'
import { LayoutDashboard, Target, Calendar, Timer, FileText, ChartBar as BarChart3, Bell, Settings, Sparkles, User, X } from 'lucide-react'
import type { ViewType } from '../../types'

interface NavItem {
  id: ViewType
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'habits', label: 'Habits', icon: <Target size={20} /> },
  { id: 'planner', label: 'Planner', icon: <Calendar size={20} /> },
  { id: 'focus', label: 'Focus Mode', icon: <Timer size={20} /> },
  { id: 'notes', label: 'Notes', icon: <FileText size={20} /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
  { id: 'reminders', label: 'Reminders', icon: <Bell size={20} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
]

const bottomItems: NavItem[] = [
  { id: 'assistant', label: 'AI Assistant', icon: <Sparkles size={20} /> },
]

export function Sidebar() {
  const { sidebarOpen, toggleSidebar, currentView, setCurrentView, user, stats } = useStore()

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />

          <motion.aside
            className="fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-[#111118] to-[#0a0a0f] border-r border-white/10 z-50 flex flex-col"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                  <svg viewBox="0 0 32 32" className="w-6 h-6">
                    <path
                      d="M16 4 L28 12 L28 20 L16 28 L4 20 L4 12 Z"
                      fill="white"
                    />
                    <circle cx="16" cy="16" r="4" fill="url(#logoGradient)" />
                  </svg>
                </div>
                <div>
                  <h1 className="font-semibold text-lg">FocusFlow</h1>
                  <p className="text-xs text-zinc-500">Peak Productivity</p>
                </div>
              </motion.div>

              <motion.button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} className="text-zinc-400" />
              </motion.button>
            </div>

            <nav className="flex-1 py-4 overflow-y-auto">
              <div className="px-3 space-y-1">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      currentView === item.id
                        ? 'bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-white border border-indigo-500/30'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className={currentView === item.id ? 'text-indigo-400' : ''}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                    {currentView === item.id && (
                      <motion.div
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400"
                        layoutId="activeIndicator"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              <div className="mt-6 px-3">
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>

              <div className="px-3 mt-4 space-y-1">
                {bottomItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      currentView === item.id
                        ? 'bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20 text-white border border-fuchsia-500/30'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * (navItems.length + index) }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className={currentView === item.id ? 'text-fuchsia-400' : ''}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </nav>

            <div className="p-4 border-t border-white/5">
              {user ? (
                <motion.div
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                    <User size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{user.displayName || 'User'}</p>
                    <p className="text-xs text-zinc-500">
                      Level {stats?.level || 1} · {stats?.totalXp || 0} XP
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => setCurrentView('settings')}
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <User size={18} className="text-zinc-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-zinc-400">Sign In</p>
                    <p className="text-xs text-zinc-500">Sync your progress</p>
                  </div>
                </motion.div>
              )}

              <motion.p
                className="text-center text-xs text-zinc-600 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Built by Pounar
              </motion.p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
