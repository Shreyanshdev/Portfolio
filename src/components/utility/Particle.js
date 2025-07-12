'use client'

import { motion } from 'framer-motion'

export default function Particle({ id, size, delay, theme }) {
  // Create random positions and movement multipliers for uniqueness
  const xMultiplier = (Math.random() * 2 - 1) * 20
  const yMultiplier = (Math.random() * 2 - 1) * 20
  const blurLevel = Math.random() > 0.5 ? 'blur-sm' : 'blur-md'
  const opacityLevel = theme === 'dark' ? 0.4 + Math.random() * 0.4 : 0.2 + Math.random() * 0.3

  const bgColor =
    theme === 'dark'
      ? 'radial-gradient(circle, rgba(255,0,0,0.4) 0%, rgba(0,0,0,0) 70%)'
      : 'radial-gradient(circle, rgba(255,100,100,0.4) 0%, rgba(255,255,255,0) 70%)'

  return (
    <motion.span
      className={`absolute rounded-full ${blurLevel} mix-blend-screen pointer-events-none`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        opacity: opacityLevel,
        backgroundImage: bgColor,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        y: [0, yMultiplier, -yMultiplier, 0],
        x: [0, xMultiplier, -xMultiplier, 0],
        scale: [0.7, 1.2 + Math.random() * 0.5, 0.7],
        opacity: [0, opacityLevel, 0],
        rotate: [0, 360],
      }}
      transition={{
        duration: 4 + id * 0.5,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}
