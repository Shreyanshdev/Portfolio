'use client'
import { useState, useEffect, useRef, useLayoutEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

// Mock Project Data (added 'type' for filtering)
const mockProjects = [
  {
    id: 1,
    name: 'SkillSense.ai (Featured)',
    type: 'Web',
    featured: true,
    description: 'AI-powered platform to track and master skills through goal-based roadmaps, tests, and reports.',
    tech: ['Next.js', 'TailwindCSS', 'Framer Motion', 'Redux' ,'Gemini Api', 'RestFUL APIS' ,'MongoDb', 'PostgreSQL' ,'NeonDb','TypeScript', 'Oauth','Vercel','Nodemailer' ],
    github: 'https://github.com/Shreyanshdev/Skillsense.ai',
    live: 'https://skillsense-ai-iota.vercel.app',
    image: '/mock/skillsense.png',
  },
  {
    id: 2,
    name: 'PortfolioX',
    type: 'Web',
    featured: false,
    description: 'Personal portfolio template with beautiful animations, typing effects and sections.',
    tech: ['React', 'GSAP', 'Framer Motion', 'TailwindCSS'],
    github: 'https://github.com/example/portfoliox',
    live: 'https://portfoliox.vercel.app',
    image: '/mock/portfoliox.png',
  },
  {
    id: 3,
    name: 'StudyNotion',
    type: 'Fullstack',
    featured: false,
    description: 'Fullstack eLearning platform where instructors create courses and students enroll, pay, and learn.',
    tech: ['React', 'Redux Toolkit', 'Node.js', 'Express', 'MongoDB', 'JWT', 'TailwindCSS', 'Razorpay', 'Cloudinary'],
    github: 'https://github.com/Shreyanshdev/StudyNotion',
    live: '',
    image: '/mock/studynotion.png',
  },
  {
    id: 4,
    name: "Parkinson’s Disease Detection",
    type: 'ML',
    featured: false,
    description: 'Machine learning project to classify Parkinson\'s patients based on vocal data.',
    tech: ['Python', 'Scikit-learn', 'SVM', 'Random Forest', 'Logistic Regression', 'SMOTE'],
    github: 'https://github.com/Shreyanshdev/analysis_parkinson',
    live: '',
    image: '/mock/parkinson.png',
  },
]

const filterOptions = ['All', 'Featured', 'Web','ML' , 'Mobile'];

export default function ProjectsSection() {
  const { isDark } = useTheme();
  const [selected, setSelected] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [hoveredCardId, setHoveredCardId] = useState(null); // State for hover effect

  const sectionRef = useRef(null); // Ref for the whole section to trigger ScrollTrigger
  const cardsContainerRef = useRef(null); // Ref for the grid container
  const cardRefs = useRef([]); // Refs for individual cards
  const progressCircleRef = useRef(null); // Ref for SVG progress circle

  // Filter projects based on activeFilter
  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') {
      return mockProjects;
    } else if (activeFilter === 'Featured') {
      return mockProjects.filter(p => p.featured);
    } else {
      return mockProjects.filter(p => p.type === activeFilter);
    }
  }, [activeFilter]);
  useEffect(() => {
    if (selected) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  
    // Cleanup on unmount or route change
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [selected]);

  useEffect(() => {
    cardRefs.current = [];
  }, [activeFilter]);

  return (
    <section
      id="projects"
      className="relative z-10 py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{
        background: isDark
          ? 'radial-gradient(ellipse at top, #0f0f15, #000)'
          : 'radial-gradient(ellipse at top, #f9f9ff, #fff)',
      }}
      ref={sectionRef} // Attach section ref
    >


      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h2
          className={`text-4xl md:text-5xl font-bold text-center mb-8 tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}
        >
          Projects I've{' '}
          <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-400 bg-clip-text text-transparent">
            Crafted
          </span>
        </motion.h2>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-16 px-4">
          {filterOptions.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 hover:cursor-pointer
                ${activeFilter === filter
                  ? 'bg-gradient-to-r from-red-500 via-red-600 to-red-400 text-white shadow-lg'
                  : `${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Container for cards - standard CSS grid */}
        {/* We add a min-h-screen for desktop to ensure enough scroll space for the animation */}
        <div
          ref={cardsContainerRef} // Attach ref for ScrollTrigger
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:min-h-[calc(100vh_-_200px)] items-center justify-center"
        >
          <AnimatePresence mode="sync"> {/* Use AnimatePresence for filter transitions */}
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project.id} // Key is crucial for AnimatePresence
                ref={el => cardRefs.current[i] = el} // Attach ref for GSAP
                className="rounded-2xl overflow-hidden group w-full relative" // Added relative for inner absolute overlay
                initial={{ opacity: 0, y: 50 }} // Framer motion initial for filter transitions
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                // Framer Motion hover effect
                onMouseEnter={() => setHoveredCardId(project.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                // Apply blur/opacity based on hoveredCardId state
                style={{
                  transition: 'filter 0.3s ease-out, opacity 0.3s ease-out',
                  filter: hoveredCardId && hoveredCardId !== project.id ? 'blur(5px)' : 'none',
                  opacity: hoveredCardId && hoveredCardId !== project.id ? 0.4 : 1,
                }}
              >
                {/* Card background (static) */}
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: isDark
                      ? 'linear-gradient(135deg, rgba(20,20,25,0.8), rgba(10,10,15,0.9))'
                      : 'linear-gradient(135deg, rgba(250,250,255,0.9), rgba(255,255,255,0.95))',
                    boxShadow: isDark
                      ? '0 10px 30px rgba(0,0,0,0.3)'
                      : '0 10px 30px rgba(0,0,0,0.08)',
                    border: isDark
                      ? '1px solid rgba(255,59,59,0.15)'
                      : '1px solid rgba(229,9,20,0.1)',
                  }}
                />

                {/* Hover overlay (managed by simple group-hover utility or direct CSS) */}
                <div
                  className="card-overlay absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: isDark
                      ? 'linear-gradient(135deg, rgba(229,9,20,0.1), rgba(255,59,59,0.05))'
                      : 'linear-gradient(135deg, rgba(229,9,20,0.05), rgba(255,59,59,0.03))',
                  }}
                />

                <motion.div
                  className="relative z-10"
                  // Framer Motion for actual scale on hover of this card
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className="relative h-60 overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized
                    />
                    {project.featured && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 via-red-600 to-red-400 text-white text-xs px-3 py-1 rounded-full shadow-lg">
                        Featured
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {project.name}
                    </h3>
                    <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className={`text-xs px-2.5 py-1 rounded-full ${
                            isDark
                              ? 'bg-gray-800/50 text-gray-300'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center gap-3">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium flex items-center gap-1 hover:border hover:bg-red-50 hover:text-white hover:rounded-3xl p-1"
                        style={{ color: isDark ? '#ff9b9b' : '#e50914' }}
                      >
                        <span>GitHub</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                      </a>
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium flex items-center gap-1 hover:border hover:bg-green-50 hover:rounded-3xl p-1"
                        style={{ color: isDark ? '#a0e0a0' : '#10b981' }}
                      >
                        <span>Live Demo</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 16 16 12 12 8"></polyline>
                          <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg>
                      </a>
                      <button
                        onClick={() => setSelected(project)}
                        className="text-sm font-medium flex items-center gap-1 ml-auto hover:cursor-pointer hover:border hover:rounded-2xl p-1 mres"
                        style={{ color: isDark ? '#ff9b9b' : '#e50914' }}
                      >
                        <span>Details</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="16" x2="12" y2="12"></line>
                          <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Enhanced Modal (remains unchanged from previous versions, included for completeness) */}
      <AnimatePresence>
      {selected && (
        // Outermost backdrop container
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // A simple tween for the backdrop opacity is usually very smooth
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={() => setSelected(null)} // Click anywhere on backdrop to close
        >
          {/* Backdrop Overlay */}
          <motion.div
            className={`absolute inset-0 ${isDark ? 'bg-black/70' : 'bg-gray-900/60'} backdrop-blur-md`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // Keep this simple, it's just fading in/out
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />

          {/* Modal Content Container */}
          <div
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl relative z-10"
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            // Changed from 'spring' to 'tween' for a smoother, more predictable feel.
            // Increased duration slightly for a more graceful entrance.
            transition={{ type: 'tween', duration: 0.1, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()} // IMPORTANT: Prevents click from bubbling to the backdrop
            style={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(20,20,25,0.9), rgba(10,10,15,0.95))'
                : 'linear-gradient(135deg, rgba(250,250,255,0.95), rgba(255,255,255,0.98))',
              border: isDark
                ? '1px solid rgba(255,59,59,0.2)'
                : '1px solid rgba(229,9,20,0.15)',
              boxShadow: isDark
                ? '0 25px 50px -12px rgba(0,0,0,0.5)'
                : '0 25px 50px -12px rgba(0,0,0,0.15)',
            }}
          >
            {/* Close Button */}
            <motion.button
              onClick={() => setSelected(null)}
              className={`absolute top-5 right-5 z-20 p-2 rounded-full cursor-pointer transition-all duration-200 ease-in-out`}
              style={{
                background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              }}
              whileHover={{
                scale: 1.1,
                backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(100,0,0,0.8)',
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#fff' : '#fff'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </motion.button>

            {/* Image Section */}
            <div className="relative h-52 sm:h-64 md:h-80 w-full">
              <Image
                src={selected.image}
                alt={selected.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="p-5 md:p-8">
              {/* Project Info */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h2 className={`text-xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {selected.name}
                </h2>
                {selected.featured && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-500 via-red-600 to-red-400 text-white">
                    Featured
                  </span>
                )}
              </div>

              <p className={`text-sm md:text-base mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {selected.description}
              </p>

              <div className="mb-8">
                <h3 className={`text-base md:text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selected.tech.map((t) => (
                    <span
                      key={t}
                      className={`px-3 py-1.5 rounded-full text-sm ${
                        isDark
                          ? 'bg-gray-800/70 text-gray-200'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons (GitHub and Live Demo) */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                {/* GitHub Button */}
                <motion.a
                  href={selected.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[150px] text-center px-5 py-3 rounded-xl font-medium flex items-center justify-center gap-2 border transition-all duration-200 ease-in-out"
                  style={{
                    background: isDark
                      ? 'linear-gradient(135deg, rgba(30,30,35,0.8), rgba(15,15,20,0.9))'
                      : 'linear-gradient(135deg, rgba(240,240,245,0.9), rgba(255,255,255,0.95))',
                    color: isDark ? '#fff' : '#1a1a1a',
                    border: isDark
                      ? '1px solid rgba(255,59,59,0.2)'
                      : '1px solid rgba(229,9,20,0.15)',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}
                  whileHover={{
                    scale: 1.03,
                    y: -2,
                    boxShadow: isDark
                      ? '0 6px 15px rgba(255,59,59,0.2)'
                      : '0 6px 15px rgba(229,9,20,0.2)',
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.97, y: 0 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                  GitHub
                </motion.a>

                {/* Live Demo Button */}
                <motion.a
                  href={selected.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[150px] text-center px-5 py-3 rounded-xl font-medium flex items-center justify-center gap-2 border transition-all duration-200 ease-in-out"
                  style={{
                    background: 'linear-gradient(135deg, rgba(229,9,20,0.1), rgba(255,59,59,0.05))',
                    color: isDark ? '#ff9b9b' : '#e50914',
                    border: isDark
                      ? '1px solid rgba(255,59,59,0.2)'
                      : '1px solid rgba(229,9,20,0.15)',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}
                  whileHover={{
                    scale: 1.03,
                    y: -2,
                    background: isDark
                      ? 'linear-gradient(135deg, rgba(255,59,59,0.15), rgba(229,9,20,0.2))'
                      : 'linear-gradient(135deg, rgba(229,9,20,0.2), rgba(255,59,59,0.1))',
                    boxShadow: isDark
                      ? '0 6px 15px rgba(255,59,59,0.3)'
                      : '0 6px 15px rgba(229,9,20,0.25)',
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.97, y: 0 }}
                >
                  <span>Live Demo</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 16 16 12 12 8"></polyline>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    </section>
  )
}