'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { Code, Layout, BrainCircuit, Lightbulb, TrendingUp, ShieldCheck } from 'lucide-react';

// --- Framer Motion Variants ---
const sectionTitleVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const skillTagVariants = {
  hidden: { scale: 0.4, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 15 } },
};

const serviceContentVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut", delay: 0.1 } },
};

// --- Data ---
const serviceData = [
  {
    title: 'Frontend Development',
    desc: 'Crafting responsive, performant UIs with modern frameworks like React, Next.js, and Tailwind CSS for exceptional user experiences.',
    Icon: Layout
  },
  {
    title: 'Backend & APIs',
    desc: 'Building robust, scalable, and secure server-side applications and RESTful APIs using Node.js, Express, and databases like PostgreSQL/MongoDB.',
    Icon: Code
  },
  {
    title: 'AI/LLM Integrations',
    desc: 'Integrating AI capabilities and Large Language Models (LLMs) into applications, automating workflows and enhancing intelligence with tools like OpenAI API.',
    Icon: BrainCircuit
  },
  {
    title: 'Performance Optimization',
    desc: 'Optimizing web applications for speed, efficiency, and SEO. Ensuring fast load times and smooth interactions across all devices.',
    Icon: TrendingUp
  },
  {
    title: 'Deployment & DevOps',
    desc: 'Setting up continuous integration/delivery (CI/CD) pipelines, deploying applications on platforms like Vercel and AWS, and managing infrastructure.',
    Icon: ShieldCheck
  },
  {
    title: 'Technical Consulting',
    desc: 'Providing expert guidance on technology stack, architecture design, and best practices to help clients make informed decisions and achieve their project goals.',
    Icon: Lightbulb
  },
];

const skills = [
  'Next.js', 'React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'TailwindCSS', 'Shadcn/ui',
  'Node.js', 'Express', 'REST API', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Prisma', 'Supabase',
  'Vercel', 'AWS', 'Netlify', 'Git/GitHub', 'Redux', 'Zustand', 'Inngest', 'OpenAI API', 'Docker',
  'Figma', 'Stripe API', 'WebSockets', 'Jest', 'Cypress'
];

// Individual Service Item Component
const ServiceScrollItem = ({ service, isDark, index, itemRefs, currentSegmentProgress, lineActive }) => {
  const iconRef = useRef(null);
  const itemRef = useRef(null);
  itemRefs.current[index] = { itemRef, iconRef };

  const glowStyles = {
    current: isDark
      ? '0 0 25px rgba(255, 59, 59, 0.9), 0 0 50px rgba(255, 59, 59, 0.6)'
      : '0 0 20px rgba(229, 9, 20, 0.7), 0 0 40px rgba(229, 9, 20, 0.5)',
    past: isDark
      ? '0 0 10px rgba(255, 59, 59, 0.4), 0 0 20px rgba(255, 59, 59, 0.2)'
      : '0 0 8px rgba(229, 9, 20, 0.3), 0 0 16px rgba(229, 9, 20, 0.1)',
    default: '0 0 0px rgba(0,0,0,0)'
  };

  const hasLineTouched = lineActive >= index;
  const isLineCurrentlyOn = lineActive === index;

  const iconScale = useTransform(currentSegmentProgress, [0, 0.5, 1], [
    hasLineTouched ? 1.0 : 0.9,
    isLineCurrentlyOn ? 1.2 : 1.0,
    1.0
  ]);

  const iconOpacity = useTransform(currentSegmentProgress, [0, 0.2, 0.8, 1], [
    hasLineTouched ? 1 : 0.4,
    1,
    1,
    1
  ]);

  const iconShadow = useTransform(currentSegmentProgress, [0, 0.2, 0.5, 0.8, 1], [
    hasLineTouched ? glowStyles.past : glowStyles.default,
    isLineCurrentlyOn ? glowStyles.current : glowStyles.past,
    isLineCurrentlyOn ? glowStyles.current : glowStyles.past,
    isLineCurrentlyOn ? glowStyles.current : glowStyles.past,
    glowStyles.past
  ]);

  const contentVisibility = hasLineTouched ? "visible" : "hidden";

  return (
    <motion.div
      ref={itemRef}
      className="flex items-start space-x-4 relative z-20"
    >
      {service.Icon && (
        <div
          className='relative z-30' // Static wrapper
          ref={iconRef}
        >
          <motion.div
            className="flex-shrink-0 p-2 rounded-full"
            style={{
              backgroundColor: isDark ? '#e5091420' : '#ff3b3b10',
              scale: iconScale,
              opacity: iconOpacity,
              boxShadow: iconShadow,
              transition: 'transform 0.2s ease-out, opacity 0.2s ease-out, box-shadow 0.2s ease-out'
            }}
          >
            <service.Icon className="w-8 h-8 text-red-500 " />
          </motion.div>
        </div>
      )}

      <motion.div
        initial="hidden"
        animate={contentVisibility}
        variants={serviceContentVariants}
        className="relative z-40"
      >
        <h4 className="text-xl font-semibold mb-1 bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent">
          {service.title}
        </h4>
        <p className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {service.desc}
        </p>
      </motion.div>
    </motion.div>
  );
};



export default function SkillsServicesSection() {
  const { isDark } = useTheme();
  const servicesContainerRef = useRef(null);
  const serviceItemRefs = useRef([]);
  const [svgPath, setSvgPath] = useState('');
  const [viewBoxDimensions, setViewBoxDimensions] = useState({ width: 1, height: 1 });

  const { scrollYProgress: containerScrollProgress } = useScroll({
    target: servicesContainerRef,
    offset: ["start center", "end center"]
  });

  const pathLength = useTransform(containerScrollProgress, [0, 1], [0, 1]);

  // State to determine which icon is currently being passed by the line
  const [lineActive, setLineActive] = useState(-1); // Changed from activeIndex to lineActive for clarity

  // Effect to calculate SVG path and viewBox on mount/resize
  useEffect(() => {
    const calculateSvgPath = () => {
      if (!servicesContainerRef.current || serviceItemRefs.current.length === 0) return;

      const containerRect = servicesContainerRef.current.getBoundingClientRect();
      const newPathPoints = [];

      serviceItemRefs.current.forEach((refs) => {
        const iconElement = refs.iconRef.current;
        if (iconElement) {
          const iconRect = iconElement.getBoundingClientRect();
          // Calculate center of icon relative to container's top-left
          const x = (iconRect.left + iconRect.width / 2 - containerRect.left);
          const y = (iconRect.top + iconRect.height / 2 - containerRect.top);
          newPathPoints.push({ x, y });
        }
      });

      if (newPathPoints.length > 0) {
        let pathData = `M ${newPathPoints[0].x} ${newPathPoints[0].y}`;
        for (let i = 1; i < newPathPoints.length; i++) {
          pathData += ` L ${newPathPoints[i].x} ${newPathPoints[i].y}`;
        }
        setSvgPath(pathData);

        const maxIconX = Math.max(...newPathPoints.map(p => p.x));
        const maxIconY = Math.max(...newPathPoints.map(p => p.y));
        setViewBoxDimensions({
          width: Math.max(containerRect.width, maxIconX + 50),
          height: Math.max(containerRect.height, maxIconY + 50)
        });
      }
    };

    calculateSvgPath();
    window.addEventListener('resize', calculateSvgPath);
    const timeoutId = setTimeout(calculateSvgPath, 200);

    return () => {
      window.removeEventListener('resize', calculateSvgPath);
      clearTimeout(timeoutId);
    };
  }, []);

  // Effect to update lineActive index based on overall scroll progress
  useEffect(() => {
    const updateLineActive = (latestProgress) => {
      if (!servicesContainerRef.current || serviceItemRefs.current.length === 0) {
        setLineActive(-1); // No items, no active line
        return;
      }

      const totalItems = serviceData.length;
      // Scale scroll progress (0-1) to the number of segments (items)
      const segmentProgress = latestProgress * totalItems;

      let currentActiveSegment = -1;
      for (let i = 0; i < totalItems; i++) {
        // If the line's progress is within this segment's range
        if (segmentProgress >= i && (i === totalItems - 1 || segmentProgress < i + 1)) {
          currentActiveSegment = i;
          break;
        }
      }
      setLineActive(currentActiveSegment);
    };

    const unsubscribe = containerScrollProgress.onChange(updateLineActive);
    return () => unsubscribe();
  }, [containerScrollProgress]);


  return (
    <section
      id="skills-services"
      className='relative min-h-screen py-24 px-6 sm:px-8 flex flex-col justify-center items-center overflow-hidden transition-colors duration-500'
    >
      {/* Main content layer */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <motion.h2
          className="text-4xl sm:text-6xl font-extrabold text-center mb-16 tracking-tight leading-tight"
          variants={sectionTitleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          My <span className="bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent">Expertise</span>
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12">
          {/* Left Column: Skills (Mobile smaller text) */}
          <div className="flex flex-col items-center">
            <h3
              className={`text-3xl sm:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent`}
            >
              Core Tech Stack
            </h3>
            <motion.div
              className="flex flex-wrap justify-center gap-3 md:gap-4 w-full"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              transition={{ staggerChildren: 0.07 }}
            >
              {skills.map((skill, i) => (
                <motion.span
                  key={i}
                  className={`skill-tag px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500
                    ${isDark
                      ? 'bg-gray-900 text-gray-200 border border-red-500/30'
                      : 'bg-gray-100 text-gray-800 border border-red-200'
                    }`}
                  style={{ boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.05)' }}
                  variants={skillTagVariants}
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Services with Scroll-Driven Icons and Progress Line */}
          <div ref={servicesContainerRef} className="flex flex-col items-center relative">
            <h3
              className={`text-3xl sm:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent`}
            >
              My Services
            </h3>
            <div className="space-y-8 w-full">
              {serviceData.map((service, i) => (
                <ServiceScrollItem
                  key={i}
                  service={service}
                  isDark={isDark}
                  index={i}
                  itemRefs={serviceItemRefs}
                  lineActive={lineActive} // Pass lineActive for dynamic Z-index & visibility
                  currentSegmentProgress={containerScrollProgress} // Pass overall scroll progress
                />
              ))}

              {/* Progress Line SVG */}
              {svgPath && (
                <svg
                className="absolute top-0 left-0 w-full h-full pointer-events-none z-0" // ↓ changed z-10 to z-0
                viewBox={`0 0 ${viewBoxDimensions.width} ${viewBoxDimensions.height}`}
                preserveAspectRatio="xMinYMin meet"
              >
                <motion.path
                  d={svgPath}
                  stroke={isDark ? '#E50914' : '#FF3B3B'}
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  style={{ pathLength: pathLength ,
                    zIndex:'0',
                  }}
                />
              </svg>
              
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}