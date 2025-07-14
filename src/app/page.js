// src/app/page.js  (or wherever your Home component lives)
'use client'
import { useRef} from 'react'
import { useTheme } from '@/context/ThemeContext'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import ProjectsStack from '@/components/ProjectsSection'
import { projects } from '@/constants/projectData'
import BottomBeam from '@/components/BottomBeam'
import ConnectSection from '@/components/ConnectSection'
import {motion} from 'framer-motion'
import SkillsServicesSection from '@/components/SkillsServicesSection'


export default function Home() {
  const heroRef = useRef(null)
  const connectRef=useRef(null)
  const skillRef=useRef(null)
  const { isDark } = useTheme()

  return (
    <div className={`relative overflow-hidden transition-colors duration-500
      ${isDark ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>

    <Navbar />
    {/* ... floating shapes, Hero, ProjectsStack ... */}
    
    <Hero ref={heroRef} />
    <ProjectsStack projects={projects} />
    <SkillsServicesSection ref={skillRef}/>
    <ConnectSection ref = {connectRef}/>
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          className="absolute top-[10%] left-[20%] w-[200px] h-[200px] rounded-full bg-pink-500 opacity-20 blur-3xl"
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-[10%] right-[20%] w-[300px] h-[300px] rounded-full bg-fuchsia-600 opacity-10 blur-2xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>
    <BottomBeam />
  </div>
  )
}
