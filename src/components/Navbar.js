'use client'
import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { useTheme } from '@/context/ThemeContext'
import LogoReveal from './utility/LogoReveal'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'; // ONLY import X for the cancel button
import ThemeToggle from './utility/ThemeToggle'

export default function Navbar() {
  const { isDark, setTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home'); // State to track active section
  const navRef = useRef(null) // This ref is for the entire header/navbar wrapper (will remain transparent)
  const desktopNavGroupRef = useRef(null); // Ref for the desktop nav group itself (this will get the background)

  // Modified navItems to include a 'path' for external routes like /blog
  // For in-page sections, keep 'href' as '#sectionId'
  const navItems = [
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Blog', href: '/blog' }, // This is the key change for the blog page
    { name: 'Connect', href: '#connect' }
  ];

  // Handle scroll for both 'scrolled' state AND 'activeSection' state
  useEffect(() => {
    const handleScroll = () => {
      // Update 'scrolled' state (used for nav group background)
      const show = window.scrollY > 10
      if (show !== scrolled) setScrolled(show)

      // Update 'activeSection' for tab highlighting for *in-page* sections
      const scrollY = window.scrollY;
      let currentActive = 'home';

      // Only check sections that are part of the current page for active highlighting
      const inPageSections = navItems.filter(item => item.href.startsWith('#'))
        .map(item => ({
          id: item.name.toLowerCase(),
          element: document.getElementById(item.name.toLowerCase())
        })).filter(s => s.element);

      for (let i = inPageSections.length - 1; i >= 0; i--) {
        const section = inPageSections[i].element;
        if (section) {
          const offset = navRef.current ? navRef.current.offsetHeight + 10 : 70;
          if (scrollY + offset >= section.offsetTop) {
            currentActive = inPageSections[i].id;
            break;
          }
        }
      }
      // If the current path is /blog, set 'blog' as active, overriding scroll detection
      if (window.location.pathname === '/blog') {
        currentActive = 'blog';
      }

      if (activeSection !== currentActive) {
        setActiveSection(currentActive);
      }
    }

    // Attach scroll listener only if window is defined (client-side)
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll)
      // Call on mount and on route change (e.g., if navigating to /blog)
      handleScroll() 
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [scrolled, navItems, activeSection]) // Added navItems to dependency array

  // GSAP animation for the BACKGROUND OF THE DESKTOP NAV GROUP ONLY
  useEffect(() => {
    if (desktopNavGroupRef.current) {
      gsap.to(desktopNavGroupRef.current, {
        backgroundColor: scrolled
          ? isDark
            ? 'rgba(255, 255, 255, 0.1)' // Light background for dark mode nav items
            : 'rgba(0, 0, 0, 0.05)'   // Dark background for light mode nav items
          : 'transparent', // Transparent when not scrolled
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  }, [scrolled, isDark]);


  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header
      ref={navRef} // This ref is for the entire fixed header, it will remain transparent by default
      className="fixed top-0 left-0 w-full z-50 transition-all duration-300"
      // NO background style or class here, it should be transparent
    >
      <div className=" mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="#home" onClick={() => setActiveSection('home')}>
            <LogoReveal />
          </Link>
        </div>

        {/* Desktop Navigation - THIS IS THE GROUP OF NAV ITEMS */}
        <nav
          ref={desktopNavGroupRef} // Apply the ref here to target this specific element
          className="max-w-11/12 hidden md:flex gap-8 items-center absolute p-3 left-1/2 transform -translate-x-1/2 rounded-2xl"
          style={{
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(70px)', // Kept your original value here
            // Background color for this nav element is controlled by GSAP from useEffect above
          }}
        >
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href} // Use item.href
              // Conditionally set onClick for hash links to update active section
              onClick={() => {
                if (item.href.startsWith('#')) {
                  setActiveSection(item.name.toLowerCase());
                } else {
                  // For external links, close mobile menu if open
                  if (mobileMenuOpen) setMobileMenuOpen(false);
                }
              }}
              className={`relative py-2 px-1 text-sm font-medium transition-colors hover:border-b-2 hover:border-red-500
                ${isDark ? 'text-white' : 'text-gray-900'}
                ${activeSection === item.name.toLowerCase()
                  ? 'text-red-500 border-b-2 border-red-500' // Desktop Active CSS (border on individual link)
                  : ''
                }`}
            >
              {item.name}
              <motion.span
                className="absolute bottom-0 left-0 w-full h-0.5"
                initial={{ scaleX: 0 }}
                // Only show underline for active section when scrolled
                animate={{ scaleX: (scrolled && activeSection === item.name.toLowerCase()) ? 1 : 0 }}
                style={{ backgroundColor: isDark ? '#e50914' : '#e50914' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </Link>
          ))}
        </nav>

        {/* Right-side controls */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Theme toggle */}
          <ThemeToggle/>

          {/* Mobile menu button */}
          <button
            className="md:hidden w-8 h-8 flex flex-col justify-center items-center"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 mb-1.5 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}
              style={{ background: isDark ? '#fff' : '#000' }}></span>
            <span className={`block w-6 h-0.5 mb-1.5 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}
              style={{ background: isDark ? '#fff' : '#000' }}></span>
            <span className={`block w-6 h-0.5 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}
              style={{ background: isDark ? '#fff' : '#000' }}></span>
          </button>
        </div>
      </div>


      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-40 pt-20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              background: isDark
                ? 'linear-gradient(to bottom, rgba(0,0,0,0.95), rgba(20,20,20,0.9))'
                : 'linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(245,245,245,0.9))'
            }}
          >
            <div className="flex flex-col items-center py-8 relative">
              {/* Close Button */}
              <button
                onClick={toggleMobileMenu}
                className="absolute top-4 right-6 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                style={{ color: isDark ? '#fff' : '#000' }}
                aria-label="Close menu"
              >
                <X className="w-8 h-8" />
              </button>

              {/* Mobile Navigation Items */}
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href} // Use item.href
                  className={`py-4 px-8 text-xl font-medium transition-colors duration-200 w-full text-center
                    ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}
                    ${activeSection === item.name.toLowerCase()
                      ? 'bg-red-500/10 text-red-500 font-bold border-l-4 border-red-500' // Mobile Active CSS
                      : ''
                    }`}
                  onClick={() => {
                    toggleMobileMenu();
                    // Set active section if it's an in-page link, otherwise rely on Next.js routing
                    setActiveSection(item.name.toLowerCase());
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}