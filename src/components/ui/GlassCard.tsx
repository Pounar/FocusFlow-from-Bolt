import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export function GlassCard({ children, className = '', hover = true, onClick }: GlassCardProps) {
  return (
    <motion.div
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-xl
        bg-gradient-to-br from-white/[0.07] via-white/[0.04] to-white/[0.01]
        backdrop-blur-2xl
        border border-white/[0.08]
        shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        ${hover ? 'hover:border-white/20 hover:shadow-[0_8px_32px_rgba(99,102,241,0.15)]' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      whileHover={hover ? { y: -1 } : undefined}
      whileTap={onClick ? { scale: 0.995 } : undefined}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      {children}

      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-cyan-500/[0.03] pointer-events-none" />

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
    </motion.div>
  )
}

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
  disabled?: boolean
  icon?: ReactNode
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  icon,
}: ButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-500 via-indigo-500 to-cyan-500 text-white shadow-[0_4px_16px_rgba(99,102,241,0.4)] hover:shadow-[0_4px_24px_rgba(99,102,241,0.6)] hover:from-indigo-400 hover:via-indigo-500 hover:to-cyan-400',
    secondary: 'bg-white/[0.08] text-white hover:bg-white/[0.15] border border-white/10 hover:border-white/20 shadow-sm',
    ghost: 'text-zinc-400 hover:text-white hover:bg-white/[0.05]',
    danger: 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30',
  }

  const sizes = {
    sm: 'px-2.5 py-1 text-xs gap-1.5 rounded-lg',
    md: 'px-3.5 py-2 text-sm gap-1.5 rounded-lg',
    lg: 'px-5 py-2.5 text-sm gap-2 rounded-xl',
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center font-medium
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </motion.button>
  )
}

interface InputProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'password' | 'number'
  className?: string
  icon?: ReactNode
}

export function Input({
  placeholder,
  value,
  onChange,
  type = 'text',
  className = '',
  icon,
}: InputProps) {
  return (
    <div className={`relative ${className}`}>
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
          {icon}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full px-3 py-2 rounded-lg text-sm
          bg-white/[0.04] border border-white/[0.08]
          text-white placeholder-zinc-600
          focus:border-indigo-500/50 focus:bg-white/[0.06]
          focus:shadow-[0_0_0_2px_rgba(99,102,241,0.1)]
          transition-all duration-200
          ${icon ? 'pl-9' : ''}
        `}
      />
    </div>
  )
}
