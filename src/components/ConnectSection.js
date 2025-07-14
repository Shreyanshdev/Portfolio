'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useTheme } from '@/context/ThemeContext';
import { Twitter, Instagram, Linkedin, Github, Mail } from 'lucide-react';

// Define social links with Lucide-React icons
const socialLinks = [
  { href: 'https://x.com/Shreyans_hg', label: 'Twitter', icon: Twitter },
  { href: 'https://www.instagram.com/areyyyy_vasu', label: 'Instagram', icon: Instagram },
  { href: 'https://www.linkedin.com/in/shreyansh-gupta-680025276', label: 'LinkedIn', icon: Linkedin },
  { href: 'https://github.com/Shreyanshdev', label: 'GitHub', icon: Github },
  { href: 'mailto:shreyanshg43@gmail.com', label: 'Email', icon: Mail },
];

// Helper function for random values for floating elements
const getRandom = (min, max) => Math.random() * (max - min) + min;

// Framer Motion Variants for cleaner animation definitions
const sectionTitleVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const socialIconVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.8 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 12 } },
};

const formFieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const newsletterFormVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

export default function ConnectSection() {
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState('');
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
  const [formError, setFormError] = useState('');

  // Floating background elements state
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


  // --- Newsletter Handler ---
  const handleNewsletter = async (e) => {
    e.preventDefault();
    setSubscriptionError('');
    setSubscribed(false);
    try {
      const response = await axios.post('/api/newsletter', { email });
      if (response.status === 200) {
        setSubscribed(true);
        setEmail('');
        setTimeout(() => setSubscribed(false), 5000);
      }
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      setSubscriptionError(err.response?.data?.message || 'Subscription failed! Please try again.');
    }
  };

  // --- Contact Form Handler ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setSent(false);
    setFormError('');

    try {
      const response = await axios.post('/api/contact', form);

      if (response.status === 200) {
        setSent(true);
        setForm({ name: '', email: '', contact: '', service: '', message: '', budget: '' });
        setTimeout(() => setSent(false), 5000);
      } else {
        setFormError(response.data.message || 'Could not send message.');
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      setFormError(err.response?.data?.message || 'Could not send message! Please try again.');
    } finally {
      setSending(false);
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
      id="connect"
      className="min-h-screen py-24 px-4 sm:px-6 relative overflow-hidden"
      
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
        <motion.h2
          className={`text-4xl md:text-5xl font-bold text-center mb-16 tracking-tighter ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
          variants={sectionTitleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          Let's{' '}
          <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-400 bg-clip-text text-transparent">
            Connect
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column - Social & Newsletter */}
          <div className="flex flex-col items-center">
            {/* Social Icons with animated hover and staggered entry */}
            <motion.div
              className="flex justify-center gap-6 mb-12 flex-wrap"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }} // Trigger when 60% of the social icons container is in view
              transition={{ staggerChildren: 0.1 }} // Stagger children for sequential animation
            >
              {socialLinks.map(({ href, label, icon: Icon }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={socialIconVariants} // Apply variants to each social icon
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
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }} // Enhanced spring for hover
                  >
                    <Icon className="w-8 h-8" style={{ color: isDark ? '#fff' : '#e50914' }} />
                  </motion.div>
                </motion.a>
              ))}
            </motion.div>

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
                    variants={newsletterFormVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
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
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
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
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }} // Trigger form entry when 30% in view
              transition={{ staggerChildren: 0.1, delayChildren: 0.2 }} // Stagger form fields
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
                {/* Form fields */}
                <motion.div variants={formFieldVariants}>
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={form.name}
                    required
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    style={inputStyles}
                  />
                </motion.div>
                <motion.div variants={formFieldVariants}>
                  <input
                    type="email"
                    placeholder="Your Email *"
                    value={form.email}
                    required
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    style={inputStyles}
                  />
                </motion.div>
                <motion.div variants={formFieldVariants}>
                  <input
                    type="tel"
                    placeholder="Your Contact No (optional)"
                    value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    style={inputStyles}
                  />
                </motion.div>
                <motion.div variants={formFieldVariants}>
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
                </motion.div>
                <motion.div variants={formFieldVariants}>
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
                </motion.div>
                <motion.div variants={formFieldVariants}>
                  <input
                    type="number"
                    placeholder="Estimated Budget in $ (optional)"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    style={inputStyles}
                  />
                </motion.div>
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
                  overflow: 'hidden',
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
                      zIndex: 0,
                      pointerEvents: 'none'
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