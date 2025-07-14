'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useTheme } from '@/context/ThemeContext';
import BottomBeam from './BottomBeam';

const typingLines = [
  "Web Developer 💻",
  "UI/UX Enthusiast 🎨",
  "Motion Crafter ⚡",
  "React & Next.js Ninja ⚔️",
];

export default function Hero() {
  const { isDark } = useTheme();
  const containerRef = useRef(null);
  const orbsRef = useRef([]);

  const [typedText, setTypedText] = useState('');
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);


  // Typing Effect
  useEffect(() => {
    const currentLine = typingLines[lineIndex];
    if (charIndex < currentLine.length) {
      const timeout = setTimeout(() => {
        setTypedText((prev) => prev + currentLine[charIndex]);
        setCharIndex(charIndex + 1);
      }, 80);
      return () => clearTimeout(timeout);
    } else {
      const restartTimeout = setTimeout(() => {
        setTypedText('');
        setCharIndex(0);
        setLineIndex((prev) => (prev + 1) % typingLines.length);
      }, 1800);
      return () => clearTimeout(restartTimeout);
    }
  }, [charIndex, lineIndex]);


  

  return (
    <section 
      ref={containerRef}
      className="min-h-screen flex flex-col justify-center px-4 sm:px-6 relative overflow-hidden"
      style={{
        background: isDark 
          ? 'radial-gradient(ellipse at top, #0f0f15, #000)'
          : 'radial-gradient(ellipse at top, #f9f9ff, #fff)',
      }}
    >
      
      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
        <motion.h1 
          className={`text-4xl md:text-5xl font-bold tracking-tight mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          Hii there! I’m{' '}
          <span className="bg-gradient-to-r from-red-500 via-purple-500 to-fuchsia-600 bg-clip-text text-transparent">
            Shreyansh Gupta ✨
          </span>
        </motion.h1>

        {/* Auto-Restarting Typing */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`text-lg md:text-xl font-medium mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
        >
          <span className="inline-block whitespace-nowrap">
            {typedText}
            <span className="ml-1 animate-blink">|</span>
          </span>
        </motion.div>

        {/* Soft Paragraph */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className={`text-sm md:text-base max-w-xl mx-auto leading-relaxed ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          I craft delightful digital experiences that merge animation, clean code, and intuitive design.
        </motion.p>

        {/* Enhanced Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <motion.a
            href="#projects"
            className="px-6 py-3 rounded-full font-semibold relative overflow-hidden group"
            style={{
              background: isDark 
                ? 'linear-gradient(45deg, rgba(20,20,25,0.8), rgba(10,10,15,0.9))' 
                : 'linear-gradient(45deg, rgba(250,250,255,0.9), rgba(255,255,255,0.95))',
              color: isDark ? '#ffffff' : '#1a1a1a',
              border: isDark 
                ? '1px solid rgba(255, 59, 59, 0.15)' 
                : '1px solid rgba(229, 9, 20, 0.15)',
              boxShadow: isDark 
                ? '0 4px 15px rgba(0,0,0,0.3)' 
                : '0 4px 15px rgba(0,0,0,0.08)',
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: isDark 
                ? '0 6px 20px rgba(255, 59, 59, 0.2)' 
                : '0 6px 20px rgba(229, 9, 20, 0.15)'
            }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="relative z-10">View Projects</span>
            <motion.div 
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100"
              style={{
                background: 'linear-gradient(45deg, rgba(229,9,20,0.1), rgba(255,59,59,0.05))'
              }}
              animate={{
                opacity: [0, 0.15, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            />
          </motion.a>
          
          <motion.a
            href="#connect"
            className="px-6 py-3 rounded-full font-semibold relative overflow-hidden group"
            style={{
              background: isDark
                ? 'linear-gradient(45deg, rgba(229,9,20,0.15), rgba(255,59,59,0.1))'
                : 'linear-gradient(45deg, rgba(229,9,20,0.08), rgba(255,59,59,0.05))',
              color: isDark ? '#ff9b9b' : '#e50914',
              border: isDark 
                ? '1px solid rgba(255, 59, 59, 0.2)' 
                : '1px solid rgba(229, 9, 20, 0.15)',
            }}
            whileHover={{ 
              scale: 1.05,
              background: isDark
                ? 'linear-gradient(45deg, rgba(229,9,20,0.25), rgba(255,59,59,0.2))'
                : 'linear-gradient(45deg, rgba(229,9,20,0.15), rgba(255,59,59,0.1))'
            }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="relative z-10">Get in Touch</span>
            <motion.div 
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100"
              style={{
                background: 'linear-gradient(45deg, rgba(229,9,20,0.1), rgba(255,59,59,0.05))'
              }}
              animate={{
                opacity: [0, 0.15, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            />
          </motion.a>
        </motion.div>
      </div>

      {/* Enhanced Scroll Mouse Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
        animate={{ y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <div className="w-9 h-14 rounded-full flex justify-center border" style={{
          borderColor: isDark ? 'rgba(255, 100, 100, 0.3)' : 'rgba(229, 9, 20, 0.2)',
        }}>
          <motion.div 
            className="w-1.5 h-1.5 rounded-full mt-3"
            style={{ backgroundColor: isDark ? '#ff3b3b' : '#e50914' }}
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          />
        </div>
        <p className="text-xs mt-2 opacity-70 -ml-6" style={{
          color: isDark ? '#a0a0b0' : '#555',
        }}>Scroll to explore</p>
      </motion.div>
      <BottomBeam />
    </section>
  );
}