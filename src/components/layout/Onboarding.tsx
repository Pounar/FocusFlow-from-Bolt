import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useStore } from '../../stores'
import { Button } from '../ui/GlassCard'
import {
  Sparkles,
  Target,
  Timer,
  Sun,
  Moon,
  Zap,
  Heart,
  ChevronRight,
  Check,
} from 'lucide-react'

const steps = [
  {
    title: 'Welcome to FocusFlow',
    subtitle: 'Your AI-powered productivity companion',
    icon: <Sparkles className="text-fuchsia-400" size={48} />,
    content: `FocusFlow helps you achieve peak productivity through intelligent habit tracking, focused work sessions, and personalized AI guidance.

Let's set up your personalized experience.`,
  },
  {
    title: 'What describes you best?',
    subtitle: 'This helps us personalize your experience',
    icon: null,
    options: [
      { id: 'student', label: 'Student', icon: '📚' },
      { id: 'professional', label: 'Professional', icon: '💼' },
      { id: 'entrepreneur', label: 'Entrepreneur', icon: '🚀' },
      { id: 'creator', label: 'Creator', icon: '🎨' },
    ],
  },
  {
    title: 'Your main focus',
    subtitle: 'What do you want to achieve?',
    icon: null,
    options: [
      { id: 'productivity', label: 'Be more productive', icon: <Zap className="text-amber-400" size={24} /> },
      { id: 'habits', label: 'Build better habits', icon: <Target className="text-emerald-400" size={24} /> },
      { id: 'focus', label: 'Improve focus', icon: <Timer className="text-cyan-400" size={24} /> },
      { id: 'wellbeing', label: 'Work-life balance', icon: <Heart className="text-pink-400" size={24} /> },
    ],
  },
  {
    title: 'Work style preference',
    subtitle: 'When are you most productive?',
    icon: null,
    options: [
      { id: 'morning', label: 'Morning person', icon: <Sun className="text-amber-400" size={24} /> },
      { id: 'night', label: 'Night owl', icon: <Moon className="text-indigo-400" size={24} /> },
      { id: 'flexible', label: 'Flexible', icon: '🔄' },
    ],
  },
  {
    title: "You're all set!",
    subtitle: 'Your personalized dashboard awaits',
    icon: <Check className="text-emerald-400" size={48} />,
    content: `FocusFlow is ready to help you achieve your goals.

Your personalized productivity journey begins now. Let's make every day count!`,
  },
]

export function Onboarding() {
  const { onboardingStep, nextOnboardingStep, completeOnboarding } = useStore()
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({})

  const currentStep = steps[onboardingStep]
  const isLastStep = onboardingStep === steps.length - 1
  const hasOptions = currentStep.options && currentStep.options.length > 0

  const handleNext = () => {
    if (isLastStep) {
      completeOnboarding()
    } else {
      nextOnboardingStep()
    }
  }

  const handleOptionSelect = (optionId: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [onboardingStep]: optionId,
    }))
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0f]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-500/10 rounded-full blur-[200px]" />
      </div>

      <motion.div
        className="relative max-w-lg w-full mx-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-center mb-8">
          <motion.div
            className="flex justify-center gap-1.5 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {steps.map((_, index) => (
              <motion.div
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index <= onboardingStep ? 'bg-indigo-500' : 'bg-white/10'
                }`}
                animate={{ width: index === onboardingStep ? 24 : 8 }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={onboardingStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep.icon && (
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center"
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: onboardingStep === 0 ? [0, 5, -5, 0] : 0,
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {currentStep.icon}
                </motion.div>
              )}

              <h1 className="text-3xl font-bold mb-2">{currentStep.title}</h1>
              <p className="text-zinc-500">{currentStep.subtitle}</p>

              {currentStep.content && (
                <p className="text-zinc-400 mt-4 max-w-md mx-auto leading-relaxed">
                  {currentStep.content}
                </p>
              )}

              {hasOptions && (
                <motion.div
                  className="grid gap-3 mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {currentStep.options?.map((option, index) => (
                    <motion.button
                      key={option.id}
                      onClick={() => handleOptionSelect(option.id)}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                        selectedOptions[onboardingStep] === option.id
                          ? 'bg-indigo-500/20 border border-indigo-500/30'
                          : 'bg-white/5 hover:bg-white/10 border border-transparent'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl">
                        {typeof option.icon === 'string' ? option.icon : option.icon}
                      </div>
                      <span className="font-medium">{option.label}</span>
                      {selectedOptions[onboardingStep] === option.id && (
                        <motion.div
                          className="ml-auto w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500 }}
                        >
                          <Check size={14} />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={handleNext}
            disabled={hasOptions && !selectedOptions[onboardingStep]}
            className="min-w-[200px]"
          >
            {isLastStep ? (
              <>
                <Sparkles size={18} />
                Get Started
              </>
            ) : (
              <>
                Continue
                <ChevronRight size={18} />
              </>
            )}
          </Button>
        </motion.div>

        {!isLastStep && onboardingStep > 0 && (
          <motion.button
            onClick={completeOnboarding}
            className="w-full text-center text-sm text-zinc-500 hover:text-zinc-400 transition-colors mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Skip onboarding
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  )
}
