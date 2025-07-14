// src/components/ConnectSection.js
'use client';

import { useRef, useState, useEffect, useLayoutEffect } from 'react'; // Added useLayoutEffect
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import axios from 'axios';
import { useTheme } from '@/context/ThemeContext';
import { Twitter, Instagram, Linkedin, Github, Mail } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Define social links with Lucide-React icons
const socialLinks = [
  { href: 'https://x.com/Shreyans_hg', label: 'Twitter', icon: Twitter },
  { href: 'https://www.instagram.com/areyyyy_vasu', label: 'Instagram', icon: Instagram },
  { href: 'https://www.linkedin.com/in/shreyansh-gupta-680025276', label: 'LinkedIn', icon: Linkedin },
  { href: 'https://github.com/Shreyanshdev', label: 'GitHub', icon: Github },
  { href: 'mailto:shreyanshg43@gmail.com', label: 'Email', icon: Mail },
];

// Helper function for random values for floating elements (if you re-add them)
const getRandom = (min, max) => Math.random() * (max - min) + min;

export default function ConnectSection() {
  const { isDark } = useTheme();
  const connectRef = useRef(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState(''); // NEW state for newsletter errors
  const [form, setForm] = useState({
    name: '',
    email: '',
    contact: '',
    service: '',
    message: '',
    budget: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState(''); // NEW state for contact form errors
  const socialRefs = useRef([]);
  const formRef = useRef(null);

  // Floating background elements state (re-added based on your original code structure)
  const [floatingElements, setFloatingElements] = useState([]);

  useEffect(() => {
    // Generate floating element properties only ONCE on client mount
    if (floatingElements.length === 0) {
      const elements = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        size: getRandom(10, 40),
        left: getRandom(0, 100),
        top: getRandom(0, 100),
        duration: getRandom(20, 50),
        delay: getRandom(0, 10),
        xEnd: getRandom(-50, 50),
        yEnd: getRandom(-50, 50),
      }));
      setFloatingElements(elements);
    }
  }, [floatingElements.length]); // Dependency to ensure it runs only if the array is empty initially

  // GSAP animations (using useLayoutEffect for safety with DOM mutations)
  useLayoutEffect(() => {
    // Kill all ScrollTriggers when the component re-renders (e.g., theme change)
    // to prevent duplicate animations
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    if (!connectRef.current) return;

    const ctx = gsap.context(() => {
      // Section title animation
      gsap.from(connectRef.current.querySelector('h2'), {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: connectRef.current,
          start: 'top 80%',
        },
      });

      // Social icons animation
      gsap.from(socialRefs.current, {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6,
        delay: 0.3,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: socialRefs.current[0],
          start: 'top 90%',
        },
      });

      // Contact Form fields animation on scroll
      if (formRef.current) {
        gsap.from(Array.from(formRef.current.children).filter(el => el.tagName !== 'BUTTON'), {
          opacity: 0,
          y: 20,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 75%',
          },
        });

        // Animate the submit button separately
        gsap.from(formRef.current.querySelector('button[type="submit"]'), {
          opacity: 0,
          y: 20,
          duration: 0.8,
          delay: 0.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 70%',
          },
        });
      }
    }, connectRef);

    return () => ctx.revert();
  }, [isDark]); // Re-run GSAP animations if theme changes


  // --- Newsletter Handler (Now connected to /api/newsletter) ---
  const handleNewsletter = async (e) => {
    e.preventDefault();
    setSubscriptionError(''); // Clear previous errors
    setSubscribed(false); // Reset subscribed status
    try {
      const response = await axios.post('/api/newsletter', { email });
      if (response.status === 200) {
        setSubscribed(true);
        setEmail(''); // Clear email input
        setTimeout(() => setSubscribed(false), 5000); // Hide success message after 5 seconds
      }
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      setSubscriptionError(err.response?.data?.message || 'Subscription failed! Please try again.');
    }
  };

  // --- Contact Form Handler (Now connected to /api/contact) ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setSent(false); // Reset sent status for new submission attempt
    setFormError(''); // Clear previous errors

    try {
      // Axios POST request to your Next.js API route
      const response = await axios.post('/api/contact', form);

      if (response.status === 200) {
        setSent(true);
        // Clear the form only on success
        setForm({ name: '', email: '', contact: '', service: '', message: '', budget: '' });
        setTimeout(() => setSent(false), 5000); // Hide success message after 5 seconds
      } else {
        // This block might not be hit if axios throws for non-2xx statuses,
        // but it's good for explicit checks if your API returns custom non-error codes.
        setFormError(response.data.message || 'Could not send message.');
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      // Access error message from axios response if available
      setFormError(err.response?.data?.message || 'Could not send message! Please try again.');
    } finally {
      setSending(false); // Always stop sending state
    }
  };

  // Common input/textarea styles
  const inputStyles = {
    background: isDark ? 'rgba(30,30,35,0.7)' : 'rgba(245,245,250,0.8)',
    color: isDark ? '#f0f0f0' : '#1a1a1a',
    border: isDark ? '1px solid rgba(255,59,59,0.2)' : '1px solid rgba(229,9,20,0.15)',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  };

  return (
    <section
      ref={connectRef}
      id="connect"
      className="min-h-screen py-24 px-4 sm:px-6 relative overflow-hidden"
      style={{
        background: isDark
          ? 'radial-gradient(ellipse at top, #0f0f15, #000)'
          : 'radial-gradient(ellipse at top, #f9f9ff, #fff)',
      }}
    >
      {/* Floating background elements */}
      {floatingElements.map(el => (
        <motion.div
          key={el.id}
          className={`absolute rounded-full pointer-events-none ${
            isDark ? 'bg-red-500/10' : 'bg-red-300/5'
          }`}
          style={{
            width: el.size, height: el.size, left: `${el.left}%`, top: `${el.top}%`,
            filter: 'blur(8px)', zIndex: 0,
          }}
          initial={{ x: 0, y: 0 }}
          animate={{ x: [0, el.xEnd, 0], y: [0, el.yEnd, 0], scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: el.duration, repeat: Infinity, ease: 'easeInOut', delay: el.delay }}
        />
      ))}

      <div className="max-w-7xl mx-auto relative z-10">
        <h2
          className={`text-4xl md:text-5xl font-bold text-center mb-16 tracking-tighter ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          Let's{' '}
          <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-400 bg-clip-text text-transparent">
            Connect
          </span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column - Social & Newsletter */}
          <div className="flex flex-col items-center">
            {/* Social Icons with animated hover */}
            <div className="flex justify-center gap-6 mb-12 flex-wrap">
              {socialLinks.map(({ href, label, icon: Icon }, i) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  ref={el => (socialRefs.current[i] = el)}
                >
                  <motion.div
                    className="p-4 rounded-full flex items-center justify-center"
                    style={{
                      background: isDark
                        ? 'linear-gradient(135deg, rgba(30,30,35,0.8), rgba(15,15,20,0.9))'
                        : 'linear-gradient(135deg, rgba(240,240,245,0.9), rgba(255,255,255,0.95))',
                      border: isDark
                        ? '1px solid rgba(255,59,59,0.15)'
                        : '1px solid rgba(229,9,20,0.1)',
                      boxShadow: isDark
                        ? '0 4px 15px rgba(0,0,0,0.3)'
                        : '0 4px 15px rgba(0,0,0,0.08)',
                    }}
                    whileHover={{
                      y: -5,
                      scale: 1.1,
                      background: isDark
                        ? 'linear-gradient(135deg, rgba(229,9,20,0.2), rgba(255,59,59,0.15))'
                        : 'linear-gradient(135deg, rgba(229,9,20,0.1), rgba(255,59,59,0.08))',
                    }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Icon className="w-8 h-8" style={{ color: isDark ? '#fff' : '#e50914' }} />
                  </motion.div>
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <div className="w-full max-w-md">
              <h3
                className={`text-xl font-bold mb-6 text-center ${
                  isDark ? 'text-gray-200' : 'text-gray-700'
                }`}
              >
                Stay Updated with My Work
              </h3>

              <AnimatePresence mode="wait">
                {!subscribed ? (
                  <motion.form
                    key="form"
                    onSubmit={handleNewsletter}
                    className="mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Your email address"
                        className="w-full px-5 py-3 rounded-xl mb-3 outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        style={{
                          background: isDark
                            ? 'rgba(20,20,25,0.8)'
                            : 'rgba(255,255,255,0.9)',
                          color: isDark ? '#f0f0f0' : '#1a1a1a',
                          border: isDark
                            ? '1px solid rgba(255,59,59,0.2)'
                            : '1px solid rgba(229,9,20,0.15)',
                          boxShadow: isDark
                            ? '0 4px 15px rgba(0,0,0,0.3)'
                            : '0 4px 15px rgba(0,0,0,0.08)',
                        }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      {subscriptionError && (
                        <p className="text-red-500 text-sm mt-1 mb-3 text-center">{subscriptionError}</p>
                      )}
                      <motion.button
                        type="submit"
                        className="w-full py-3 cursor-pointer rounded-xl font-semibold relative overflow-hidden group"
                        style={{
                          background: 'linear-gradient(135deg, #e50914, #ff3b3b)',
                          color: '#fff',
                          boxShadow: '0 4px 20px rgba(229,9,20,0.3)',
                        }}
                        whileHover={{
                          scale: 1.02,
                          boxShadow: isDark
                            ? '0 6px 25px rgba(229,9,20,0.5)'
                            : '0 6px 25px rgba(229,9,20,0.4)',
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                      >
                        <span className="relative z-10">Subscribe</span>
                        <motion.span
                          className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 0 }}
                          whileHover={{ scaleX: 1 }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                          style={{ originX: 0.5 }}
                        />
                      </motion.button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    className="mb-12 text-center p-4 rounded-xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      background: isDark
                        ? 'rgba(20, 100, 20, 0.1)'
                        : 'rgba(0, 200, 0, 0.1)',
                      border: isDark
                        ? '1px solid rgba(0, 200, 0, 0.2)'
                        : '1px solid rgba(0, 180, 0, 0.3)',
                    }}
                  >
                    <p className="text-green-500 font-medium">
                      Thanks for subscribing! 🎉 You'll be the first to know about updates.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Contact Info */}
              <div className="text-center mt-12">
                <h4
                  className={`text-lg font-semibold mb-3 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Reach Out Directly
                </h4>
                <p
                  className={`mb-2 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  <span className="font-medium">Email:</span>{' '}
                  <a href="mailto:shreyanshg43@gmail.com" className="text-red-400 hover:underline">
                    shreyanshg43@gmail.com
                  </a>
                </p>
                <p
                  className={`mb-2 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  <span className="font-medium">Phone:</span> N/A
                </p>
                <p
                  className={`${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  <span className="font-medium">Location:</span> Orai, Uttar Pradesh, India
                </p>
                <p
                  className={`mt-4 text-sm ${
                    isDark ? 'text-gray-500' : 'text-gray-500'
                  }`}
                >
                  I'm always excited to discuss new projects and collaborations.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="contact-form">
            <motion.form
              ref={formRef}
              onSubmit={handleFormSubmit}
              className="p-8 rounded-3xl shadow-xl"
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
              <h3 className={`text-2xl font-bold mb-6 text-center  ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Let's{' '}
                <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-400 bg-clip-text text-transparent">
                  Collaborate
                </span>
              </h3>
              <p
                className={`text-center mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Tell me about your vision, and let's create something amazing together.
              </p>

              <div className="grid gap-4 mb-6">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={form.name}
                    required
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    style={inputStyles}
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email *"
                    value={form.email}
                    required
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    style={inputStyles}
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="Your Contact No (optional)"
                    value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    style={inputStyles}
                  />
                </div>

                <div>
                  <select
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    style={inputStyles}
                    required
                  >
                    <option value="">Select Service Type *</option>
                    <option value="web-development">Web Development</option>
                    <option value="ui-ux-design">UI/UX Design</option>
                    <option value="mobile-app-development">Mobile App Development</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <textarea
                    rows={5}
                    placeholder="Tell me about your project. What are your goals? 💡 (min 20 characters)"
                    value={form.message}
                    required
                    minLength={20}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl resize-none outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    style={inputStyles}
                  />
                </div>

                <div>
                  <input
                    type="number"
                    placeholder="Estimated Budget in $ (optional)"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    style={inputStyles}
                  />
                </div>
              </div>

              {formError && (
                <p className="text-red-500 text-sm mt-1 mb-3 text-center">{formError}</p>
              )}

              <motion.button
                type="submit"
                disabled={sending || sent}
                className={`w-full py-3 rounded-xl font-semibold relative group transition-all duration-300 ${
                  sending ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
                }`}
                style={{
                  background: sent
                    ? 'linear-gradient(135deg, #00c853, #00e676)'
                    : 'linear-gradient(135deg, #e50914, #ff3b3b)',
                  color: '#fff',
                  boxShadow: '0 4px 20px rgba(229,9,20,0.3)',
                  overflow: 'hidden', // keep overflow hidden on button
                  zIndex: 1
                }}
                whileHover={{
                  scale: sending || sent ? 1 : 1.02,
                  boxShadow:
                    sending || sent
                      ? '0 4px 20px rgba(229,9,20,0.3)'
                      : isDark
                      ? '0 6px 25px rgba(229,9,20,0.5)'
                      : '0 6px 25px rgba(229,9,20,0.4)',
                }}
                whileTap={{ scale: sending || sent ? 1 : 0.98 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {sending && (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  {sending ? 'Sending...' : sent ? 'Sent Successfully! ✅' : 'Send Proposal'}
                </span>

                {/* Hover Effect - Only visible on desktop */}
                {!sending && !sent && (
                  <motion.span
                    className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    style={{
                      originX: 0.5,
                      zIndex: 0, // ensure it's below the text
                      pointerEvents: 'none' // important: don’t block clicks
                    }}
                  />
                )}
              </motion.button>

            </motion.form>
          </div>
        </div>
      </div>
    </section>
  );
}