// src/app/blog/page.js
'use client'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

// Import your mock data
import mockBlogPosts from '../../constants/mockBlogPosts'
import LogoReveal from '@/components/utility/LogoReveal'
import ThemeToggle from '@/components/utility/ThemeToggle'

export default function BlogListingPage() {
    const { isDark } = useTheme()
  const containerRef = useRef(null)
  const cardRefs = useRef([])
  const [activeImage, setActiveImage] = useState(0)
  
  const personalImages = [
    '/images/nainital1.jpeg',
    '/images/nainital2.jpeg',
    '/images/nainital3.jpeg',
    '/images/nainital4.jpeg',
  ]

  // GSAP animations for the personal journey section
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return
    
    const ctx = gsap.context(() => {
      // Animate the personal journey text blocks
      gsap.utils.toArray('.personal-text-block').forEach((block, i) => {
        gsap.from(block, {
          opacity: 0,
          y: 40,
          duration: 1,
          delay: i * 0.3,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: block,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        })
      })
      
      // Animate the image carousel
      gsap.from('.personal-image', {
        opacity: 0,
        scale: 0.8,
        duration: 1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.personal-images',
          start: 'top 85%',
        }
      })
      
      // Animate blog cards
      cardRefs.current.forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
          }
        })
      })
      
      // Animated SVG paths
      gsap.from('.svg-path', {
        strokeDashoffset: 800,
        duration: 3,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top center',
        }
      })
    }, containerRef)
    
    return () => ctx.revert()
  }, [])

  // Rotate through personal images
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage(prev => (prev + 1) % personalImages.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      ref={containerRef}
      className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'} transition-colors duration-300 relative overflow-hidden`}
    >
        <div className=' justify-between flex'>
            {/**Logo */}
            <LogoReveal/>
            {/**Theme toggle */}
            <ThemeToggle/>
        </div>
      {/* Decorative SVG Background */}
      <svg
        className="absolute top-0 left-0 w-full h-full z-0 opacity-10 pointer-events-none"
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? "rgba(229,9,20,0.5)" : "rgba(255,59,59,0.3)"} />
            <stop offset="100%" stopColor={isDark ? "rgba(150,0,50,0.5)" : "rgba(255,100,100,0.3)"} />
          </linearGradient>
        </defs>
        
        {/* Abstract handwriting strokes */}
        <path
          className="svg-path"
          d="M100,200 Q250,100 400,300 T700,200"
          fill="none"
          stroke="url(#redGradient)"
          strokeWidth="3"
          strokeDasharray="800"
          strokeDashoffset="800"
        />
        <path
          className="svg-path"
          d="M800,500 Q600,400 500,700 T400,800"
          fill="none"
          stroke="url(#redGradient)"
          strokeWidth="3"
          strokeDasharray="1000"
          strokeDashoffset="1000"
        />
        <path
          className="svg-path"
          d="M200,800 Q300,600 600,900"
          fill="none"
          stroke="url(#redGradient)"
          strokeWidth="3"
          strokeDasharray="1200"
          strokeDashoffset="1200"
        />
      </svg>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <motion.h1
          className={`text-4xl md:text-6xl font-bold mb-20 text-center tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          My{' '}
          <span className="bg-gradient-to-r from-red-500 to-fuchsia-600 bg-clip-text text-transparent">
            Journey
          </span>{' '}
          & Thoughts
        </motion.h1>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Personal Journey (2/3 width) */}
          <div className="lg:col-span-2 relative">
            <div className="personal-text-block">
              <motion.h2 
                className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                <span className="bg-gradient-to-r from-red-500 to-fuchsia-600 bg-clip-text text-transparent">
                  Who I Am
                </span>
              </motion.h2>
              
              <p className={`text-lg mb-8 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                I'm a passionate developer and storyteller who believes in the power of code to create meaningful experiences. 
                When I'm not crafting digital worlds, you'll find me exploring real ones - camera in hand, friends by my side.
              </p>
              
              <div className="personal-text-block">
                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Adventures in Nainital
                </h3>
                
                <p className={`text-lg mb-8 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Last summer, my friends and I traveled to Nainital - a beautiful hill station nestled in the Himalayas. 
                  We spent days boating on the lake, trekking through pine forests, and evenings sharing stories over chai. 
                  These moments remind me that life's best experiences happen off-screen.
                </p>
              </div>
            </div>
            
            {/* Image Carousel */}
            <div className="personal-images mb-12 relative">
              <div className="grid grid-cols-2 gap-4">
                {personalImages.map((src, i) => (
                  <motion.div
                    key={i}
                    className={`personal-image overflow-hidden rounded-xl ${
                      i === activeImage ? 'ring-4 ring-red-500' : 'opacity-80'
                    }`}
                    whileHover={{ scale: 1.03 }}
                  >
                    <Image
                      src={src}
                      alt={`Personal image ${i+1}`}
                      width={600}
                      height={400}
                      className="w-full h-96 object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </motion.div>
                ))}
              </div>
              
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
                {personalImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-3 h-3 rounded-full ${
                      i === activeImage 
                        ? 'bg-red-500' 
                        : isDark 
                          ? 'bg-gray-600' 
                          : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Handwritten note */}
            <div className="personal-text-block mt-16 relative">
              <div className="absolute -top-8 -left-8 text-8xl opacity-20" style={{ fontFamily: 'Dancing Script, cursive' }}>
                “
              </div>
              
              <blockquote className={`text-xl italic pl-12 relative ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                <p>
                  Creating is my meditation. Each line of code, each captured moment - they're love letters to a world 
                  that inspires me daily. The journey matters more than the destination, and I'm grateful for every step.
                </p>
              </blockquote>
              
              <div className="mt-6 flex items-center">
                <div className="mr-4">
                  <Image
                    src="/images/signature.png"
                    alt="Signature"
                    width={150}
                    height={60}
                    className="opacity-90"
                  />
                </div>
                <div className={`border-l-2 pl-4 ${isDark ? 'border-red-900' : 'border-red-300'}`}>
                  <p className={`font-bold ${isDark ? 'text-gray-50' : 'text-gray-900'}`}>Shreyansh Gupta</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Developer & Storyteller</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Blog Listing (1/3 width) */}
          <div className="lg:col-span-1 hidden">
            <div className={`sticky top-24 max-h-[85vh] overflow-y-auto scrollbar-hide p-4 rounded-2xl ${
              isDark 
                ? 'bg-gray-900/80 backdrop-blur-md border border-gray-800' 
                : 'bg-white/80 backdrop-blur-md border border-gray-200'
            }`}>
              <h2 className={`text-2xl font-bold mb-6 pb-3 border-b ${
                isDark ? 'text-white border-gray-800' : 'text-gray-900 border-gray-200'
              }`}>
                Latest Writings
              </h2>
              
              <div className="space-y-6">
                {mockBlogPosts.map((post, i) => (
                  <motion.div
                    key={post.slug}
                    ref={el => cardRefs.current[i] = el}
                    className={`relative group rounded-xl overflow-hidden p-4 transition-all ${
                      isDark 
                        ? 'bg-gray-800/50 hover:bg-gray-800' 
                        : 'bg-gray-100 hover:bg-white'
                    }`}
                    whileHover={{ 
                      translateY: -5,
                      boxShadow: isDark 
                        ? '0 10px 25px rgba(0,0,0,0.3)' 
                        : '0 10px 25px rgba(0,0,0,0.08)'
                    }}
                  >
                    <Link href={`/blog/${post.slug}`} className="block">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                            <Image
                              src={post.featuredImage}
                              alt={post.imageAlt}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        </div>
                        
                        <div>
                          <h3 className={`font-bold mb-1 group-hover:text-red-500 transition-colors ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {post.title}
                          </h3>
                          <p className={`text-sm mb-2 line-clamp-2 ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {post.excerpt}
                          </p>
                          <div className={`text-xs flex items-center ${
                            isDark ? 'text-gray-500' : 'text-gray-500'
                          }`}>
                            <span>{post.date}</span>
                            <span className="mx-2">•</span>
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                <Link 
                  href="#" 
                  className={`inline-flex items-center text-sm font-medium ${
                    isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'
                  }`}
                >
                  View all posts
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-1/4 left-10 w-24 opacity-10">
        <svg viewBox="0 0 200 200">
          <path 
            d="M100,20 C140,40 160,80 140,120 C120,160 80,160 40,140 C0,120 0,80 20,40 C40,0 80,0 100,20 Z" 
            fill={isDark ? "#e50914" : "#ff3b3b"} 
          />
        </svg>
      </div>
      <div className="absolute bottom-1/3 right-20 w-16 opacity-10 rotate-45">
        <svg viewBox="0 0 200 200">
          <rect 
            x="50" y="50" width="100" height="100"
            fill={isDark ? "#e50914" : "#ff3b3b"} 
          />
        </svg>
      </div>
    </div>
  )
}