// src/components/BottomBeam.js
'use client'

import { useTheme } from '@/context/ThemeContext'

export default function BottomBeam() {
  const { isDark } = useTheme()

  // tweak height (30vh) and color‑stops to taste
  const gradient = isDark
    ? 'linear-gradient(to top, rgba(200,20,20,0.2) 0%, rgba(200,20,20,0.2) 30%, transparent 100%)'
    : 'linear-gradient(to top, rgba(255,100,100,0.2) 0%, rgba(255,100,100,0.15) 30%, transparent 100%)'

  return (
    <div
      aria-hidden="true"
      className="fixed bottom-0 left-0 w-full h-[25vh] pointer-events-none z-1000"
      style={{ background: gradient }}
    />
  )
}
