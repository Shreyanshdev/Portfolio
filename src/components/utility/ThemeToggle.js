'use client'
import {motion} from "framer-motion"
import React from 'react'
import { useTheme } from '@/context/ThemeContext'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const { isDark, setTheme } = useTheme()
  
  return (
    <motion.button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="glass-float p-3 rounded-full hover-float glow-effect group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {isDark ? (
          <Moon className="h-5 w-5 text-primary-glow group-hover:text-primary transition-colors" />
        ) : (
          <Sun className="h-5 w-5 text-primary group-hover:text-primary-glow transition-colors" />
        )}
      </motion.div>
    </motion.button>
  )
}
