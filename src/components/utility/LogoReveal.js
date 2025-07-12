// src/components/LogoReveal.js
'use client'
import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import Particle from './Particle'
import MouseTrail from '../MouseTrail'
import { useTheme } from '@/context/ThemeContext'

const BRAND = 'Shreyansh'.toUpperCase().split('')

export default function LogoReveal() {
  const { isDark } = useTheme()
  const container = useRef(null)
  const [hover, setHover] = useState(false)


  useEffect(() => {
    const t = gsap.timeline()
    t.to(container.current, {
      textShadow: isDark
        ? '0 0 20px rgba(255,0,0,0.9),0 0 40px rgba(255,0,0,0.6)'
        : '0 0 12px rgba(255,0,0,0.6),0 0 24px rgba(255,0,0,0.3)',
      scale: 1.05,
      duration: 0.4,
      ease: 'power1.inOut',
    }).to(container.current, { scale: 1, duration: 0.4 })
    return () => t.kill()
  }, [ isDark])

  return (
    <div className="relative flex items-center z-10 justify-center ">
      <MouseTrail isDark={isDark} />
      <div
        ref={container}
        className="relative inline-block cursor-pointer"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => {
          const burst = document.createElement('div')
          Object.assign(burst.style, {
            position: 'absolute', width: '100px', height: '100px',
            background: 'rgba(255,0,0,0.3)', borderRadius: '50%',
            top: '50%', left: '50%', transform: 'translate(-50%, -50%) scale(0)',
            pointerEvents: 'none', zIndex: 1,
          })
          container.current.append(burst)
          gsap.to(burst, { scale: 3, opacity: 0, duration: 0.6, ease: 'power1.out', onComplete: () => burst.remove() })
        }}
      >
        {/* Glow aura */}
        <div
          className="absolute -inset-4 rounded-full pointer-events-none"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(255,0,0,0.3), transparent)'  
              : 'radial-gradient(circle, rgba(255,100,100,0.2), transparent)',
            filter: 'blur(300px)',
          }}
        />

        {/* Brand letters */}
        {BRAND.map((ch, i) => (
          <motion.span
            key={i}
            className="letter inline-block font-extrabold text-4xl leading-none"
            style={{
              color: 'transparent', WebkitTextStroke: '1px rgba(229,9,20,0.8)',
              backgroundClip: 'text', backgroundImage: `linear-gradient(90deg, ${isDark ? '#ff3b3b' : '#e50914'}, ${isDark ? '#e50914' : '#ff7878'})`,
            }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.2, rotate: 2, transition: { type: 'tween', duration: 0.3 } }}
          >
            {ch}
          </motion.span>
        ))}

        {/* Particles on hover */}
        {hover &&
          Array.from({ length: 50 }).map((_, i) => (
            <Particle key={i} id={i} size={4 + Math.random() * 6} delay={i * 0.1} isDark={isDark} />
          ))
        }
      </div>
    </div>
  )
}


