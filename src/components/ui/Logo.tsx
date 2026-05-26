import { motion } from 'framer-motion'
import { useStore } from '../../stores'

export function Logo() {
  const { toggleSidebar, sidebarOpen } = useStore()

  return (
    <motion.button
      onClick={toggleSidebar}
      className="fixed top-6 left-6 z-50 p-3 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative w-8 h-8">
        <motion.svg
          viewBox="0 0 32 32"
          className="w-full h-full"
          initial={false}
          animate={{ rotate: sidebarOpen ? 180 : 0 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
        >
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>

          <motion.path
            d="M16 4 L28 12 L28 20 L16 28 L4 20 L4 12 Z"
            fill="url(#logoGradient)"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.circle
            cx="16"
            cy="16"
            r="4"
            fill="white"
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.path
            d="M16 8 L16 16 L22 16"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />
        </motion.svg>

        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-0"
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: 'blur(8px)' }}
        />
      </div>
    </motion.button>
  )
}
