// app/blog/page.js
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Clock, ArrowRight, Camera, Heart, Star, Sparkles, PlusCircle } from 'lucide-react';
import ThemeToggle from '@/components/utility/ThemeToggle';
// import mockBlogPosts from '@/constants/mockBlogPosts'; // WE WILL FETCH DYNAMICALLY NOW
import AddPostModal from '@/components/AddPostModal';
import './blog.css'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const BlogPage = () => {
  const { isDark } = useTheme();
  const containerRef = useRef(null);
  const imagesRef = useRef([]);
  const blogCardsRef = useRef([]);
  const [activeImage, setActiveImage] = useState(0);

  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  // --- NEW: State to hold actual blog posts fetched from the API ---
  const [blogPosts, setBlogPosts] = useState([]);

  const personalImages = [
    {
      src: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80',
      alt: 'Adventure in mountains',
      caption: 'Finding peace in the mountains'
    },
    {
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      alt: 'Scenic lake view',
      caption: 'Reflections and revelations'
    },
    {
      src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
      alt: 'Forest trail',
      caption: 'Walking through stories'
    },
    {
      src: 'https://images.unsplash.com/photo-1500622944204-b135684e99fd?w=800&q=80',
      alt: 'Sunrise view',
      caption: 'Every sunrise brings new hope'
    },
    {
      src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80',
      alt: 'Coffee and coding',
      caption: 'Where ideas come to life'
    }
  ];

  const [imageRotations, setImageRotations] = useState([]);

  // Effect to run once on the client to set initial rotations, check admin status, AND FETCH POSTS
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const rotations = personalImages.map(() => Math.random() * 6 - 3);
      setImageRotations(rotations);

      const adminFlag = localStorage.getItem('isAdmin');
      if (adminFlag === 'true') {
        setIsAdmin(true);
      }

      // --- FETCH BLOG POSTS ON CLIENT MOUNT ---
      const fetchPosts = async () => {
        try {
          const response = await fetch('/api/blog-posts');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setBlogPosts(data);
        } catch (error) {
          console.error("Failed to fetch blog posts:", error);
          // Fallback to mock data if API fails, or show an error message
          // setBlogPosts(mockBlogPosts); // If you want to use the original mock data as fallback
        }
      };
      fetchPosts();
    }
  }, [personalImages.length]);

  // GSAP animations effect
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.hero-text', {
        opacity: 0,
        y: 100,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.2
      });

      imagesRef.current.forEach((img, i) => {
        if (img) {
          const initialRotation = imageRotations[i] || 0;

          gsap.from(img, {
            opacity: 0,
            scale: 0.6,
            rotation: initialRotation,
            duration: 1.5,
            delay: i * 0.3,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: img,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          });

          gsap.to(img, {
            y: Math.sin(i) * 15,
            rotation: Math.random() * 6 - 3,
            duration: 4 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.5
          });

          img.addEventListener('mouseenter', () => {
            gsap.to(img, {
              scale: 1.1,
              rotation: Math.random() * 10 - 5,
              duration: 0.4,
              ease: 'power2.out',
              overwrite: true
            });
          });

          img.addEventListener('mouseleave', () => {
            gsap.to(img, {
              scale: 1,
              rotation: initialRotation,
              duration: 0.4,
              ease: 'power2.out',
              overwrite: true
            });
          });
        }
      });

      blogCardsRef.current.forEach((card, i) => {
        if (card) {
          gsap.from(card, {
            opacity: 0,
            x: 50,
            y: 30,
            duration: 0.8,
            delay: i * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none none'
            }
          });
        }
      });

      gsap.utils.toArray('.story-block').forEach((block, i) => {
        gsap.from(block, {
          opacity: 0,
          y: 60,
          duration: 1,
          delay: i * 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: block,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });
      });

      gsap.from('.svg-path', {
        strokeDashoffset: 1000,
        duration: 3,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top center',
        }
      });

      gsap.utils.toArray('.parallax-element').forEach((element) => {
        gsap.to(element, {
          yPercent: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, [imageRotations]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage(prev => (prev + 1) % personalImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [personalImages.length]);

  // Handler for when the modal's save button is clicked
  const handleSaveNewPost = async (newPostData) => {
    try {
      const response = await fetch('/api/blog-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPostData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Post saved successfully:', result.post);
      alert('Post saved! You might need to restart the dev server to see it reflected in the initial render.');
      setShowAddPostModal(false); // Close modal

      // Optionally, update the local state to show the new post immediately
      setBlogPosts(prevPosts => [result.post, ...prevPosts]);

    } catch (error) {
      console.error('Failed to save blog post:', error);
      alert('Failed to save post. Check console for details.');
    }
  };

  return (
    <div
      ref={containerRef}
      className={`min-h-screen bg-background relative overflow-hidden ${isDark ? 'dark' : ''}`}
    >
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Animated SVG Background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
        viewBox="0 0 1200 800"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
            <stop offset="50%" stopColor="hsl(var(--primary-glow))" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(var(--primary-dark))" stopOpacity="0.3" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <path
          className="svg-path"
          d="M50,150 Q200,50 350,200 T650,180 Q800,120 950,250"
          fill="none"
          stroke="url(#redGradient)"
          strokeWidth="2"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          filter="url(#glow)"
        />
        <path
          className="svg-path"
          d="M100,400 Q300,300 500,450 T900,400"
          fill="none"
          stroke="url(#redGradient)"
          strokeWidth="3"
          strokeDasharray="800"
          strokeDashoffset="800"
          filter="url(#glow)"
        />
        <path
          className="svg-path"
          d="M200,600 Q400,500 600,650 T1000,600"
          fill="none"
          stroke="url(#redGradient)"
          strokeWidth="2"
          strokeDasharray="1200"
          strokeDashoffset="1200"
          filter="url(#glow)"
        />
      </svg>

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 parallax-element">
        <Sparkles className="w-8 h-8 text-primary opacity-30 animate-pulse" />
      </div>
      <div className="absolute top-1/3 right-20 parallax-element">
        <Heart className="w-6 h-6 text-primary-glow opacity-40 animate-float" />
      </div>
      <div className="absolute bottom-1/4 left-1/4 parallax-element">
        <Star className="w-10 h-10 text-primary opacity-25 animate-rotate-slow" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.h1
            className="hero-text text-6xl md:text-8xl font-bold mb-6 tracking-tighter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            My{' '}
            <span className="text-gradient">Journey</span>
          </motion.h1>
          <motion.p
            className="hero-text text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Where stories meet code, and dreams take digital form
          </motion.p>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left Column - Personal Journey (2/3 width) */}
          <div className="lg:col-span-2">
            {/* Story Introduction */}
            <div className="story-block mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">
                Creating <span className="text-gradient">Digital Dreams</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
                I'm a passionate creator who believes in the transformative power of technology.
                Every project is a canvas, every line of code a brushstroke in crafting experiences
                that resonate with the human spirit.
              </p>
            </div>

            {/* Artistic Image Grid */}
            <div className="image-grid-artistic mb-20 relative" style={{ minHeight: '600px' }}>
              {personalImages.map((image, i) => (
                <motion.div
                  key={i}
                  ref={el => imagesRef.current[i] = el}
                  className={`
                    glass-float relative cursor-pointer group
                    ${i === 0 ? 'image-artistic-1' : ''}
                    ${i === 1 ? 'image-artistic-2' : ''}
                    ${i === 2 ? 'image-artistic-3' : ''}
                    ${i === 3 ? 'image-artistic-4' : ''}
                    ${i === 4 ? 'image-artistic-5' : ''}
                  `}
                  style={{
                    '--rotate': `${imageRotations[i] || 0}deg`,
                  }}
                  whileHover={{
                    scale: 1.05,
                    zIndex: 10,
                    transition: { duration: 0.3 }
                  }}
                >
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-glow rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />

                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-64 object-cover rounded-xl shadow-float"
                  />

                  {/* Image overlay with caption */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white text-sm font-medium">{image.caption}</p>
                  </div>

                  {/* Floating camera icon */}
                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground p-2 rounded-full shadow-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Camera className="w-4 h-4" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Personal Story */}
            <div className="story-block mb-16">
              <h3 className="text-3xl font-bold mb-6 text-foreground">
                Adventures in <span className="text-gradient">Creation</span>
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                From the misty mountains of Nainital to the bustling cafes where I code,
                each experience shapes my perspective as a creator. I believe the best
                digital experiences are born from real human connections and genuine moments.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                When I'm not crafting interfaces or building applications, you'll find me
                exploring new places, capturing moments through photography, or lost in
                conversations with fellow creators who share the same passion for meaningful work.
              </p>
            </div>

            {/* Quote Section */}
            <div className="story-block relative">
              <div className="glass-card relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary" />
                <blockquote className="text-2xl md:text-3xl font-light text-foreground leading-relaxed italic mb-6">
                  "Creating is my way of leaving a mark on this world—one pixel,
                  one interaction, one meaningful moment at a time."
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">SG</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Shreyansh Gupta</p>
                    <p className="text-sm text-muted-foreground">Digital Creator & Storyteller</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Blog Listing (1/3 width) */}
          <div className="lg:col-span-1 ">
            <div className="sticky top-8">
              <div className="glass-card max-h-[85vh] overflow-y-auto scrollbar-hide">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-foreground">Latest Thoughts</h2>
                  <div className="w-8 h-8 bg-[linear-gradient(135deg, hsl(355, 78%, 55%), hsl(355, 78%, 45%))] rounded-full flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-[hsl(0, 0%, 100%)]" />
                  </div>
                </div>

                {/* --- ADD POST BUTTON (ADMIN ONLY) --- */}
                {isAdmin && (
                  <div className="mb-8 text-center">
                    <motion.button
                      onClick={() => setShowAddPostModal(true)}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary-dark shadow-glow animate-pulse-glow"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <PlusCircle className="w-4 h-4 mr-2" /> Add New Post
                    </motion.button>
                  </div>
                )}
                {/* --- END ADD POST BUTTON --- */}

                <div className="space-y-6">
                  {/* Iterate over blogPosts state, not mockBlogPosts directly */}
                  {blogPosts.slice(0, 6).map((post, i) => (
                    <motion.div
                      key={post.slug} // Use slug as key, or a unique ID from the post object
                      ref={el => blogCardsRef.current[i] = el}
                      className="group"
                    >
                      <Link href={`/blog/${post.slug}`} className="block">
                        <div className="glass hover-float rounded-xl p-4 transition-all duration-300 hover:shadow-glow group-hover:bg-gradient-glass">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0">
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                                {/* --- FIX FOR EMPTY SRC --- */}
                                {post.featuredImage ? (
                                  <img
                                    src={post.featuredImage}
                                    alt={post.imageAlt || 'Blog Post Image'}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs text-center p-1">
                                    No Image
                                  </div>
                                )}
                                {/* --- END FIX --- */}
                                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300 mb-2 line-clamp-2">
                                {post.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                {post.excerpt}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{post.date}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{post.readTime}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-border text-center">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary-glow font-medium transition-colors duration-300 group"
                  >
                    View all stories
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- ADD POST MODAL COMPONENT --- */}
      <AddPostModal
        isOpen={showAddPostModal}
        onClose={() => setShowAddPostModal(false)}
        onSave={handleSaveNewPost}
      />
      {/* --- END ADD POST MODAL --- */}
    </div>
  );
};

export default BlogPage;