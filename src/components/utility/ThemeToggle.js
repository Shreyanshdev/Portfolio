'use client'
import {motion} from "framer-motion"
import React from 'react'
import { useTheme } from '@/context/ThemeContext'
import { Sun, Moon } from 'lucide-react'
import './../../app/blog/blog.css'

export default function ThemeToggle() {
  const { isDark, setTheme } = useTheme()
  
  return (
    <motion.button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`${isDark ? 'glass-float-dark' : 'glass-float-light'} scrollbar-hide p-3 rounded-full hover-float ${isDark ? 'text-red-400' : ''}  group`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      style={{
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(20px)', // Kept your original value here
        // Background color for this nav element is controlled by GSAP from useEffect above
      }}
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
