'use client'
import { useEffect, useState } from 'react'

export default function SpotlightGlow({ isDark }) {
  const [coords, setCoords] = useState({ x: -200, y: -200 })

  useEffect(() => {
    const handleMove = (e) => {
      setCoords({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('pointermove', handleMove)
    return () => window.removeEventListener('pointermove', handleMove)
  }, [])

  return (
    <div
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999] mix-blend-lighten"
      style={{
        background: `radial-gradient(
          120px circle at ${coords.x}px ${coords.y}px,
          ${isDark ? 'rgba(255, 0, 0, 0.15)' : 'rgba(255, 100, 100, 0.1)'},
          transparent 80%
        )`,
        transition: 'background 0.1s ease-out',
      }}
    />
  )
}
