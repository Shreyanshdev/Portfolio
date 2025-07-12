// src/components/SkillsServicesSection.js
'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '@/context/ThemeContext';
import { Code, Layout, BrainCircuit } from 'lucide-react'; // Example icons for services

gsap.registerPlugin(ScrollTrigger);

export default function SkillsServicesSection() {
  const { isDark } = useTheme();
  const sectionRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || !svgRef.current) return;

    const ctx = gsap.context(() => {
      const svg = svgRef.current;
      const paths = [
        { id: '#svgPath1', textId: '#svgText1', textDelay: 0.1 },
        { id: '#svgPath2', textId: '#svgText2', textDelay: 0.3 },
        { id: '#svgPath3', textId: '#svgText3', textDelay: 0.2 },
        // Add more paths and text IDs as you expand the SVG
      ];

      // --- SVG Drawing and Text Reveal Animation ---
      const masterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top', // Start when section hits top of viewport
          end: 'bottom bottom', // End when section leaves bottom of viewport
          scrub: 0.8, // Link animation to scroll position, with a little lag for smoothness
          pin: true, // Pin the section while scrolling through its animation
          // markers: true, // Uncomment for debugging ScrollTrigger
        },
      });

      paths.forEach((item) => {
        const path = svg.querySelector(item.id);
        const text = svg.querySelector(item.textId);

        if (path) {
          const length = path.getTotalLength();
          gsap.set(path, {
            strokeDasharray: length + ' ' + length,
            strokeDashoffset: length,
          });

          // Animate path drawing in sync with scroll
          masterTimeline.to(path, { strokeDashoffset: 0, ease: 'none' }, '<'); // Use '<' to start simultaneously with previous
        }

        if (text) {
          // Animate text opacity
          masterTimeline.to(text, { opacity: 1, ease: 'power2.out' }, `+=${item.textDelay}`); // Reveal text shortly after path starts drawing
        }
      });

      // --- Other Section Animations (independent of SVG drawing but triggered by scroll) ---

      // Animate service cards fading/sliding in
      gsap.from('.service-card', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%', // Adjust start to be lower so it doesn't clash with SVG
          toggleActions: 'play none none reverse', // Play on scroll down, reverse on scroll up
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });

      // Animate skill tags popping in
      gsap.from('.skill-tag', {
        scrollTrigger: {
          trigger: '.skill-tags-container', // Trigger based on skill tags container
          start: 'top 90%', // Adjust start for a smooth entry
          toggleActions: 'play none none reverse',
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'back.out(1.7)',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isDark]);

  const serviceData = [
    {
      title: 'Frontend Development',
      desc: 'Pixel-perfect, responsive UIs with React, Next.js & TailwindCSS, delivering exceptional user experiences.',
      image: '/images/frontend-icon.svg', // Placeholder image URL
      Icon: Layout // Lucide icon
    },
    {
      title: 'Backend & APIs',
      desc: 'Building robust, scalable RESTful APIs and microservices with Node, Express, PostgreSQL & MongoDB.',
      image: '/images/backend-icon.svg', // Placeholder image URL
      Icon: Code // Lucide icon
    },
    {
      title: 'AI Integrations',
      desc: 'Automating workflows and enhancing applications with OpenAI API, Inngest & serverless functions.',
      image: '/images/ai-icon.svg', // Placeholder image URL
      Icon: BrainCircuit // Lucide icon
    },
  ];

  const skills = [
    'Next.js', 'React', 'TypeScript', 'HTML5', 'CSS3', 'TailwindCSS',
    'Node.js', 'Express', 'REST API', 'GraphQL', 'PostgreSQL', 'MongoDB',
    'Vercel', 'AWS', 'Git/GitHub', 'Redux', 'Zustand', 'Inngest', 'OpenAI API', 'Docker', 'Kubernetes'
  ];

  const svgStrokeColor = isDark ? '#ff3b3b' : '#e50914'; // Primary theme color for stroke
  const svgTextColor = isDark ? '#e50914' : '#ff3b3b'; // Primary theme color for text

  return (
    <section
      ref={sectionRef}
      id="skills-services"
      className={`relative min-h-screen py-24 px-6 sm:px-8 flex flex-col justify-center items-center overflow-hidden transition-colors duration-500 ${
        isDark ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'
      }`}
    >
      

      {/* Main content layer */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <h2 className="text-3xl sm:text-5xl font-bold text-center mb-16 tracking-tight">
          My <span className="bg-gradient-to-r from-red-500 to-fuchsia-600 bg-clip-text text-transparent">Services</span> &{' '}
          <span className="bg-gradient-to-r from-red-500 to-fuchsia-600 bg-clip-text text-transparent">Skills</span>
        </h2>

        {/* Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {serviceData.map(({ title, desc, image, Icon }, i) => (
            <div
              key={title}
              className={`service-card p-6 rounded-3xl border transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center text-center ${
                isDark
                  ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50 hover:border-red-500/50 shadow-md shadow-gray-800/30'
                  : 'bg-gradient-to-br from-white/70 to-gray-100/70 border-gray-200/50 hover:border-red-300/50 shadow-md shadow-gray-200/30'
              }`}
              style={{
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)', // For Safari support
              }}
            >
              {/* Using Lucide Icon for demonstration, you can switch back to img if preferred */}
              {Icon && <Icon className="w-16 h-16 mb-4" style={{ color: svgTextColor }} />}
              {/* Or use an image if you have them:
              <img src={image} alt={title} className="w-20 h-20 mb-4 object-contain" />
              */}
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-red-500 to-fuchsia-600 bg-clip-text text-transparent">
                {title}
              </h3>
              <p className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="max-w-4xl mx-auto skill-tags-container px-4">
          <h3
            className={`text-3xl font-bold mb-8 text-center bg-gradient-to-r from-red-500 to-fuchsia-600 bg-clip-text text-transparent`}
          >
            My Core Tech Stack
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className={`skill-tag px-4 py-2 rounded-full text-base font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  isDark
                    ? 'bg-gray-800 text-gray-200 border border-red-500/30'
                    : 'bg-gray-100 text-gray-800 border border-red-200'
                }`}
                style={{
                    boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.05)'
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}