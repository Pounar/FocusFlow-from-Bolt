import { motion } from 'framer-motion'
import { useStore } from '../stores'
import { GlassCard, Button, Input } from '../components/ui/GlassCard'
import {
  User,
  Moon,
  Sun,
  Timer,
  Bell,
  Palette,
  Shield,
} from 'lucide-react'

export function Settings() {
  const { theme, setTheme, preferences, stats } = useStore()

  const handleExportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      stats,
      preferences,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `focusflow-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      className="px-4 py-6 md:px-6 w-full max-w-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mb-5">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-zinc-500 text-sm">Customize your FocusFlow experience</p>
      </div>

      <div className="space-y-4">
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="text-indigo-400" size={20} />
            Profile
          </h2>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
              <User size={28} />
            </div>
            <div>
              <p className="font-medium text-lg">Local User</p>
              <p className="text-sm text-zinc-500">Sign in to sync across devices</p>
            </div>
          </div>

          <Button variant="secondary" className="w-full">
            Sign In to Sync
          </Button>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Palette className="text-fuchsia-400" size={20} />
            Appearance
          </h2>

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-zinc-500">Choose your preferred color scheme</p>
            </div>
            <div className="flex gap-2">
              <motion.button
                onClick={() => setTheme('dark')}
                className={`p-3 rounded-xl transition-all ${
                  theme === 'dark'
                    ? 'bg-indigo-500/20 border border-indigo-500/30'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Moon className={theme === 'dark' ? 'text-indigo-400' : 'text-zinc-400'} size={20} />
              </motion.button>
              <motion.button
                onClick={() => setTheme('light')}
                className={`p-3 rounded-xl transition-all ${
                  theme === 'light'
                    ? 'bg-indigo-500/20 border border-indigo-500/30'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sun className={theme === 'light' ? 'text-amber-400' : 'text-zinc-400'} size={20} />
              </motion.button>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Timer className="text-cyan-400" size={20} />
            Focus Settings
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-zinc-500 mb-2 block">Focus Duration (minutes)</label>
              <Input
                value={preferences?.focusDuration?.toString() || '25'}
                onChange={() => {}}
                type="number"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-500 mb-2 block">Break Duration (minutes)</label>
              <Input
                value={preferences?.breakDuration?.toString() || '5'}
                onChange={() => {}}
                type="number"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-500 mb-2 block">Daily Focus Goal (hours)</label>
              <Input
                value={preferences?.dailyGoal?.toString() || '8'}
                onChange={() => {}}
                type="number"
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bell className="text-orange-400" size={20} />
            Notifications
          </h2>

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-zinc-500">Get reminded even when app is closed</p>
            </div>
            <motion.button
              className={`w-12 h-6 rounded-full px-1 transition-colors ${
                'Notification' in window && Notification.permission === 'granted'
                  ? 'bg-indigo-500'
                  : 'bg-white/20'
              }`}
              onClick={() => {
                if ('Notification' in window) {
                  Notification.requestPermission()
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-4 h-4 rounded-full bg-white"
                animate={{
                  x: 'Notification' in window && Notification.permission === 'granted' ? 20 : 0,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="text-emerald-400" size={20} />
            Data & Privacy
          </h2>

          <div className="space-y-3">
            <Button variant="secondary" className="w-full" onClick={handleExportData}>
              Export Data
            </Button>
            <Button variant="danger" className="w-full">
              Clear All Data
            </Button>
          </div>
        </GlassCard>

        <div className="text-center py-8">
          <p className="text-zinc-600 text-sm">Built by Pounar</p>
          <p className="text-zinc-700 text-xs mt-1">FocusFlow v1.0.0</p>
        </div>
      </div>
    </motion.div>
  )
}
