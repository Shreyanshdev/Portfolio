// src/app/blog/[slug]/page.js
'use client'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'; // Import React to use React.use()

import mockBlogPosts from '@/constants/mockBlogPosts' // Import your mock data
import LogoReveal from '@/components/utility/LogoReveal'
import ThemeToggle from '@/components/utility/ThemeToggle'

// SVG for a decorative background element (abstract code/crafting theme) - Reused for consistency
const DecorativeSVG = ({ isDark }) => (
  <svg
    className="absolute top-0 left-0 w-full h-full z-0 opacity-10"
    viewBox="0 0 1000 1000"
    xmlns="http://www.w3.org/2000/svg"
    style={{ pointerEvents: 'none' }}
  >
    <defs>
      <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={isDark ? "rgba(229,9,20,0.5)" : "rgba(255,59,59,0.3)"} />
        <stop offset="100%" stopColor={isDark ? "rgba(150,0,50,0.5)" : "rgba(255,100,100,0.3)"} />
      </linearGradient>
    </defs>
    <g fill="url(#redGradient)">
      {/* Abstract code lines */}
      <rect x="50" y="100" width="150" height="5" rx="2" ry="2" />
      <rect x="70" y="120" width="100" height="5" rx="2" ry="2" />
      <rect x="90" y="140" width="120" height="5" rx="2" ry="2" />

      <rect x="800" y="200" width="150" height="5" rx="2" ry="2" />
      <rect x="820" y="220" width="100" height="5" rx="2" ry="2" />

      {/* Gears/Cogs for crafting/engineering */}
      <circle cx="250" cy="750" r="40" />
      <path d="M250 710 L255 700 L265 705 L260 715 Z" transform="rotate(0 250 750)" />
      <path d="M250 710 L255 700 L265 705 L260 715 Z" transform="rotate(45 250 750)" />
      <path d="M250 710 L255 700 L265 705 L260 715 Z" transform="rotate(90 250 750)" />
      <path d="M250 710 L255 700 L265 705 L260 715 Z" transform="rotate(135 250 750)" />
      <path d="M250 710 L255 700 L265 705 L260 715 Z" transform="rotate(180 250 750)" />
      <path d="M250 710 L255 700 L265 705 L260 715 Z" transform="rotate(225 250 750)" />
      <path d="M250 710 L255 700 L265 705 L260 715 Z" transform="rotate(270 250 750)" />
      <path d="M250 710 L255 700 L265 705 L260 715 Z" transform="rotate(315 250 750)" />

      {/* Abstract data points/nodes */}
      <circle cx="700" cy="400" r="10" />
      <circle cx="750" cy="450" r="12" />
      <circle cx="650" cy="480" r="8" />
      <line x1="700" y1="400" x2="750" y2="450" stroke="url(#redGradient)" strokeWidth="2" />
      <line x1="700" y1="400" x2="650" y2="480" stroke="url(#redGradient)" strokeWidth="2" />
    </g>
  </svg>
);

// For App Router: get dynamic params via props
export default function BlogPostPage({ params }) {
  const { isDark } = useTheme();

  // --- KEY CHANGE HERE ---
  // Unwrap the 'params' Promise using React.use()
  const resolvedParams = React.use(params);
  const { slug } = resolvedParams;
  // --- END KEY CHANGE ---

  // Find the blog post
  const post = mockBlogPosts.find(p => p.slug === slug);

  // If post not found, you might want to redirect or show a 404 message
  if (!post) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
        <p className="text-2xl font-bold">Blog post not found.</p>
        <Link href="/blog" className="mt-4 text-red-500 hover:underline">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${isDark ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'} transition-colors duration-300 relative overflow-hidden`}
    >
        <LogoReveal/>
        <ThemeToggle/>
      {/* Decorative SVG Background */}
      <DecorativeSVG isDark={isDark} />

      {/* Main Content Area */}
      <main className="relative z-10 max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className={`inline-flex items-center text-sm font-medium mb-8 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to all posts
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`rounded-xl p-6 md:p-10 lg:p-12 shadow-xl ${
            isDark
              ? 'bg-gray-900 border border-red-900/40'
              : 'bg-white border border-red-100/80'
          }`}
        >
          {/* Featured Image */}
          <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-8 shadow-md">
            <Image
              src={post.featuredImage}
              alt={post.imageAlt}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Blog Post Header */}
          <header className="mb-8 text-center">
            <h1 className={`text-3xl md:text-4xl font-extrabold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {post.title}
            </h1>
            <p className={`mt-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              By <span className="font-semibold">{post.author}</span> on {post.date} &bull; {post.readTime}
            </p>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {post.tags.map(tag => (
                  <span key={tag} className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Blog Post Content */}
          <div className={`prose max-w-none ${isDark ? 'prose-invert prose-red' : 'prose-red'}`}>
            {post.content.map((block, index) => {
              if (block.type === "paragraph") {
                return <p key={index}>{block.text}</p>;
              } else if (block.type === "heading") {
                const HeadingTag = `h${block.level}`;
                return <HeadingTag key={index}>{block.text}</HeadingTag>;
              } else if (block.type === "code") {
                return (
                  <pre key={index} className={`${isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} p-4 rounded-md overflow-x-auto text-sm`}>
                    <code>{block.text}</code>
                  </pre>
                );
              }
              return null;
            })}
          </div>

          {/* Optional: Call to Action or Social Links */}
          <footer className="mt-12 pt-8 border-t text-center space-y-4">
            <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Found this helpful? Connect with me!
            </p>
            <Link
              href="/contact" // Placeholder for a contact page
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-red-600 to-fuchsia-700 hover:from-red-700 hover:to-fuchsia-800 transition-all duration-300"
            >
              Get in Touch
              <svg className="ml-2 -mr-1 w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </footer>
        </motion.article>
      </main>

      {/* Optional: Simple Footer */}
      <footer className={`relative z-10 py-8 text-center text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
        <p>&copy; {new Date().getFullYear()} My Blog. All rights reserved.</p>
      </footer>
    </div>
  );
}