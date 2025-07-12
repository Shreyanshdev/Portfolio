// src/components/BlogCard.js
'use client';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';
import Link from 'next/link';

export default function BlogCard({ post, innerRef }) {
  const { isDark } = useTheme();

  return (
    <motion.div
      ref={innerRef}
      className={`relative rounded-xl overflow-hidden group shadow-lg transition-colors duration-300
        ${isDark ? 'bg-gray-900/60 border border-red-900/40' : 'bg-white/40 border border-red-100/80'}
        backdrop-blur-md glowing-element
      `}
      whileHover={{
        scale: 1.03,
        // Adjust shadows for glassmorphism and glow effect
        boxShadow: isDark
          ? '0 15px 30px rgba(0,0,0,0.6), 0 0 20px rgba(229,9,20,0.4)'
          : '0 15px 30px rgba(0,0,0,0.2), 0 0 15px rgba(229,9,20,0.2)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative w-full h-40 md:h-52 overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.imageAlt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            unoptimized // Remove for production
          />
          {post.tags && post.tags.length > 0 && (
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-vibrant-red to-accent-fuchsia text-white shadow-md">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 md:p-6">
          <h2 className={`text-lg md:text-xl font-bold mb-2 group-hover:text-vibrant-red transition-colors ${isDark ? 'text-white' : 'text-gray-900'} font-poppins`}>
            {post.title}
          </h2>
          <p className={`text-sm mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'} font-poppins`}>
            {post.excerpt}
          </p>
          <div className="flex justify-between items-center text-xs">
            <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'} font-poppins`}>
              {post.date} &bull; {post.readTime}
            </span>
            <span className={`font-semibold text-gradient-red-fuchsia`}>
              Read More &rarr;
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}