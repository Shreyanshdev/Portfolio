'use client'

import ThemeToggle from '@/components/utility/ThemeToggle'
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, Clock, User, Share2, ChevronUp, BookOpen, Heart } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import './../blog.css'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const BlogPostPage = () => {
  const params = useParams();
  const slug = params.slug;
  const router = useRouter();
  const { isDark } = useTheme();
  const containerRef = useRef(null);
  const progressRef = null; // Reading progress bar will use direct style
  const [readingProgress, setReadingProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/blog-posts');
        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }
        const allPosts = await response.json();

        const foundPost = allPosts.find(p => p.slug === slug);

        if (foundPost) {
          setPost(foundPost);
        } else {
          notFound();
        }
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPostData();
    }
  }, [slug]);

  useEffect(() => {
    if (!post || typeof window === 'undefined' || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Hero image parallax
      gsap.to('.hero-image', {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-image',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5
        }
      });

      // Content fade-in animations
      gsap.from('.content-block', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%'
        }
      });

      // Animated decorative elements (using glass-float as a trigger for floating-element styles)
      gsap.from('.floating-element', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.3,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%'
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [post]);

  useEffect(() => {
    if (!post || !containerRef.current) return;

    const updateProgress = () => {
      if (!document.documentElement || !window) return;

      const scrollTop = window.scrollY;
      const contentHeight = containerRef.current.scrollHeight;
      const viewportHeight = window.innerHeight;
      const scrollableContent = contentHeight - viewportHeight;

      let progress = 0;
      if (scrollableContent > 0) {
        progress = (scrollTop / scrollableContent) * 100;
        progress = Math.min(100, Math.max(0, progress));
      }

      setReadingProgress(progress);
      setShowScrollTop(scrollTop > 300);
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, [post]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sharePost = async () => {
    if (!post) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen ${isDark ? 'dark-theme' : 'light-theme'} text-2xl animate-pulse`}>
        Loading Post...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex justify-center items-center h-screen ${isDark ? 'dark-theme' : 'light-theme'} text-red-500 text-2xl`}>
        Error loading post: {error.message}. Please try again.
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div ref={containerRef} className={`min-h-screen ${isDark ? 'dark-theme' : 'light-theme'}`}>
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-red-500 z-50"
        style={{ width: `${readingProgress}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${readingProgress}%` }}
      />

      {/* Header */}
      <header className="fixed top-4 left-4 right-4 z-40 flex justify-between items-center">
        <Link
          href="/blog"
          className={`${isDark ? 'glass-float-dark' : 'glass-float-light'} scrollbar-hide p-3 rounded-full hover-float ${isDark ? 'dark-theme' : 'light-theme'} ${isDark ? 'glow-effect-dark' : 'glow-effect-light'} group`}
        >
          <ArrowLeft className={`h-5 w-5 ${isDark ? 'icon-primary-dark' : 'icon-primary-light'} group-hover:${isDark ? 'icon-primary-glow-dark' : 'icon-primary-glow-light'} transition-colors`} />
        </Link>
        <ThemeToggle />
      </header>

      {/* Floating Action Buttons */}
      <div className="fixed right-6 bottom-6 z-40 space-y-3 ">
        <motion.button
          onClick={sharePost}
          className={`${isDark ? 'glass-float-dark' : 'glass-float-light'} scrollbar-hide p-3 rounded-full hover-float ${isDark ? 'dark-theme' : 'light-theme'} ${isDark ? 'glow-effect-dark' : 'glow-effect-light'} group`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Share2 className={`h-5 w-5 ${isDark ? 'icon-primary-dark' : 'icon-primary-light'}  group-hover:${isDark ? 'icon-primary-glow-dark' : 'icon-primary-glow-light'} transition-colors`} />
        </motion.button>

        <motion.button
          onClick={() => setIsLiked(!isLiked)}
          className={`${isDark ? 'glass-float-dark' : 'glass-float-light'} scrollbar-hide p-3 rounded-full hover-float ${isDark ? 'dark-theme' : 'light-theme'} ${isDark ? 'glow-effect-dark' : 'glow-effect-light'} group`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Heart className={`h-5 w-5 transition-colors ${isLiked ? 'liked-heart' : `${isDark ? 'icon-primary-dark' : 'icon-primary-light'} group-hover:${isDark ? 'icon-primary-glow-dark' : 'icon-primary-glow-light'}`}`} />
        </motion.button>

        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className={`${isDark ? 'glass-float-dark' : 'glass-float-light'} scrollbar-hide p-3 rounded-full hover-float ${isDark ? 'dark-theme' : 'light-theme'} ${isDark ? 'glow-effect-dark' : 'glow-effect-light'} group`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronUp className={`h-5 w-5 ${isDark ? 'icon-primary-dark' : 'icon-primary-light'} group-hover:${isDark ? 'icon-primary-glow-dark' : 'icon-primary-glow-light'} transition-colors`} />
          </motion.button>
        )}
      </div>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1000 1000">
            <defs>
              <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isDark ? 'hsl(var(--primary-glow-dark))' : 'hsl(var(--primary-glow-light))'} />
                <stop offset="100%" stopColor={isDark ? 'hsl(var(--primary-dark))' : 'hsl(var(--primary-light))'} />
              </linearGradient>
            </defs>
            <g className="floating-element">
              <circle cx="200" cy="200" r="3" fill="url(#heroGradient)" className={isDark ? 'animate-pulse-glow-dark' : 'animate-pulse-glow-light'} />
              <circle cx="800" cy="300" r="2" fill="url(#heroGradient)" className={isDark ? 'animate-pulse-glow-dark' : 'animate-pulse-glow-light'} style={{ animationDelay: '1s' }} />
              <circle cx="600" cy="700" r="4" fill="url(#heroGradient)" className={isDark ? 'animate-pulse-glow-dark' : 'animate-pulse-glow-light'} style={{ animationDelay: '2s' }} />
            </g>
            <g className="floating-element">
              <path d="M100,500 Q300,400 500,500 T900,500" stroke="url(#heroGradient)" strokeWidth="1" fill="none" opacity="0.3" />
              <path d="M150,300 Q400,200 650,300" stroke="url(#heroGradient)" strokeWidth="1" fill="none" opacity="0.2" />
            </g>
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            {post.tags && (
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className={`${isDark ? 'glass-float-dark' : 'glass-float-light'} px-3 py-1 text-xs font-medium rounded-full`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 ${isDark ? 'text-gradient-dark' : 'text-gradient-light'} leading-tight`}>
              {post.title}
            </h1>
            <p className={`text-lg md:text-xl ${isDark ? 'text-muted-foreground-dark' : 'text-muted-foreground-light'} max-w-2xl mx-auto leading-relaxed`}>
              {post.excerpt}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={`flex flex-wrap justify-center items-center gap-6 text-sm ${isDark ? 'text-muted-foreground-dark' : 'text-muted-foreground-light'}`}
          >
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>{post.date}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        <div className="hero-image absolute inset-0">
          {post.featuredImage ? (
            <img
              src={post.featuredImage}
              alt={post.imageAlt || post.title || 'Blog post featured image'}
              className="w-full h-full object-cover scale-110"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-sm ${isDark ? 'bg-placeholder-dark text-placeholder-dark' : 'bg-placeholder-light text-placeholder-light'}`}>
              No Featured Image
            </div>
          )}
          <div className={`${isDark ? 'image-overlay-dark' : 'image-overlay-light'} absolute inset-0`} />
        </div>
      </section>

      {/* Content */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <div className={`${isDark ? 'prose-dark' : 'prose-light'} prose-lg max-w-none`}>
          {post.content?.map((block, index) => (
            <div key={index} className="content-block mb-8">
              {block.type === 'paragraph' && (
                <p className={`${isDark ? 'text-foreground-dark' : 'text-foreground-light'} leading-relaxed text-base`}>{block.text}</p>
              )}
              {block.type === 'heading' && (
                <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${isDark ? 'text-gradient-dark' : 'text-gradient-light'}`}>
                  {block.text}
                </h2>
              )}
              {block.type === 'code' && (
                <div className={`${isDark ? 'glass-card-dark' : 'glass-card-light'} p-6 rounded-xl overflow-x-auto`}>
                  <pre className={`text-sm ${isDark ? 'text-foreground-dark' : 'text-foreground-light'}`}>
                    <code className={`${isDark ? 'text-foreground-dark' : 'text-foreground-light'}`}>{block.text}</code>
                  </pre>
                </div>
              )}
              {block.type === 'quote' && (
                <blockquote className={`${isDark ? 'glass-card-dark' : 'glass-card-light'} p-6 rounded-xl ${isDark ? 'border-primary-dark' : 'border-primary-light'} border-l-4`}>
                  <p className={`text-lg italic ${isDark ? 'text-muted-foreground-dark' : 'text-muted-foreground-light'}`}>{block.text}</p>
                </blockquote>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className={`${isDark ? 'glass-card-dark' : 'glass-card-light'} p-8 rounded-2xl`}>
            <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-gradient-dark' : 'text-gradient-light'}`}>
              Enjoyed this article?
            </h3>
            <p className={`${isDark ? 'text-muted-foreground-dark' : 'text-muted-foreground-light'} mb-6`}>
              Connect with me for more insights and discussions about development, design, and technology.
            </p>
            <Link
              href="/blog"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium hover-float ${isDark ? 'dark-theme' : 'light-theme'} transition-all ${isDark ? 'border-cta-dark text-foreground-dark' : 'border-cta-light text-foreground-light'}`}
            >
              Read More Articles
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default BlogPostPage;