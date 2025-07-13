// src/components/AnimatedQuote.js
'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function AnimatedQuote() {
  const blockRef = useRef(null)
  const topLineRef = useRef(null)
  const bottomLineRef = useRef(null)
  const textTopRef = useRef(null)
  const textBottomRef = useRef(null)

  const personalImages = [
    '/images/nainital1.jpeg',
    '/images/nainital2.jpeg',
    '/images/nainital3.jpeg',
    '/images/nainital4.jpeg',
  ]
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Prepare each polyline for a “draw” animation
      function prepLine(line) {
        const length = line.getTotalLength()
        line.style.strokeDasharray = length
        line.style.strokeDashoffset = length
      }
      if (topLineRef.current && bottomLineRef.current) {
        prepLine(topLineRef.current)
        prepLine(bottomLineRef.current)
      }

      // Build a scroll‑linked timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: blockRef.current,
          start: 'top 90%',
          end: 'bottom 20%',
          scrub: true,
        }
      })

      tl
        // draw the top line
        .to(topLineRef.current, {
          strokeDashoffset: 0,
          duration: 1,
          ease: 'power1.out'
        })
        // fade in the top text
        .from(textTopRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: 'power2.out'
        }, '<0.3')
        // draw the bottom line
        .to(bottomLineRef.current, {
          strokeDashoffset: 0,
          duration: 1,
          ease: 'power1.out'
        }, '>-0.4')
        // fade in the bottom text
        .from(textBottomRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: 'power2.out'
        }, '<0.3')

    }, blockRef)

    return () => ctx.revert()
  }, [])

  return (
    <blockquote
      ref={blockRef}
      className="relative my-20 mx-auto w-full max-w-3xl"
    >
      <div className="fixed top-6 right-6 z-50 flex justify-between items-center w-full px-6">
        <LogoReveal />
        <ThemeToggle />
      </div>
      <svg
        viewBox="0 0 455.3 443"
        className="w-full h-auto"
      >
        <polyline
          ref={topLineRef}
          points="199.1,74.2 164.9,15 17.1,271 312.7,271 240.7,146.3"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <polyline
          ref={bottomLineRef}
          points="256.8,364 293.7,428 441.4,172 145.9,172 216.2,293.8"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <rect x="169.9" y="69.9" width="93" height="82" fill="transparent"/>
        <rect x="192.4" y="289.5" width="93" height="82" fill="transparent"/>

        <text
          ref={textTopRef}
          x="183.7"
          y="137.4"
          className="text-2xl font-semibold fill-current opacity-0"
        >
          “EVER POSITIVE
        </text>
        <text
          ref={textBottomRef}
          x="0"
          y="356.3"
          className="text-2xl font-semibold fill-current opacity-0"
        >
          NEVER NEGATIVE”
        </text>
      </svg>
      <div
                          className={`
                            rounded-xl p-4
                            transition-all duration-300

                            hover:-translate-y-4
                            ${isDark ? 'glass-base-dark' : 'glass-base-light'}

                            // Dynamic background-color
                            ${isDark ? 'bg-[rgba(10,10,10,0.15)]' : 'bg-[rgba(245,245,245,0.4)]'}

                            ${isDark ? 'border-red-dark' : 'border-red-light'}

                            // Hover shadow
                            hover:shadow-[0_8px_32px_0_rgba(214,51,83,0.37)]
                            ${isDark ? '' : 'hover:shadow-[0_8px_32px_0_rgba(185,28,64,0.25)]'} 
                          `}
                        ></div>
    </blockquote>
  )
}
