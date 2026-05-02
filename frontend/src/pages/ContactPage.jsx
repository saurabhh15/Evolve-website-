import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';

const ContactPage = () => {
  const [status, setStatus] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    // Simulate API call
    setTimeout(() => {
      setStatus('sent');
      setTimeout(() => setStatus(''), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-orange-500 selection:text-white overflow-hidden">
      <div className="flex flex-col lg:flex-row min-h-screen relative">

        {/* Decorative Elements */}
        <div className="fixed top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-black/5 rounded-full blur-3xl pointer-events-none" />

        {/* Left Side: Brand & Info */}
        <motion.section
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full lg:w-[55%] bg-black text-white p-6 sm:p-10 md:p-16 flex flex-col justify-between relative overflow-hidden z-0 min-h-[50vh] lg:min-h-screen"
        >
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }} />

          {/* Gradient orb */}
          <div className="absolute -top-32 -right-32 w-64 h-64 md:w-96 md:h-96 bg-orange-500/20 rounded-full blur-[100px]" />

          <div className="relative z-10 pt-10 md:pt-0">
            {/* Animated Title */}
            <motion.div
              className="mb-8 md:mb-16"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none" style={{ fontFamily: 'sans-serif' }}>
                Let's <br />
                <span className="text-orange-500 italic">Connect.</span>
              </h1>
              
              {/* Responsive Animated accent bar */}
              <motion.div
                className="h-1.5 md:h-2 bg-gradient-to-r from-orange-500 to-orange-600 mt-2 sm:mt-3 md:ml-2 max-w-[280px] sm:max-w-[340px] md:max-w-[454px]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 2.5, delay: 0.5, ease: "easeOut" }}
                style={{ transformOrigin: 'left' }}
              />
            </motion.div>

            <motion.p
              className="text-zinc-400 text-base sm:text-lg md:text-xl max-w-md mb-12 md:mb-16 leading-relaxed"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Need Help? We are happy to help you! Reach out and let's build something great.
            </motion.p>

            <div className="space-y-6 pb-12 lg:pb-0">
              {[
                { icon: Mail, label: 'Email Us', value: 'evolve.support@gmail.com', delay: 0.5 },
                { icon: Phone, label: 'Call Us', value: '+123456789', delay: 0.6 },
                { icon: MapPin, label: 'Studio', value: 'DholakPur', delay: 0.7 }
              ].map((item, index) => (
                <ContactInfoItem key={index} {...item} />
              ))}
            </div>
          </div>
        </motion.section>

        {/* Right Side: Contact Form */}
        <motion.section
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          // Responsive layout overlapping: Vertical overlap on mobile (-mt-10), Horizontal overlap on desktop (-ml-[10%])
          className="w-full lg:w-[55%] p-6 sm:p-10 md:p-16 flex items-center justify-center relative rounded-t-[2.5rem] lg:rounded-t-none lg:rounded-l-[3rem] bg-amber-50 -mt-10 lg:mt-0 lg:-ml-[10%] z-30 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-8 md:space-y-10 relative z-20">

            {/* Form Header */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-8 md:mb-12 pt-4 lg:pt-0"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 tracking-tight">Start a Conversation</h2>
              <p className="text-zinc-500 text-base sm:text-lg">Fill out the form below and we'll get back to you within 24 hours.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <FormField
                label="Full Name"
                type="text"
                placeholder="Ishan"
                delay={0.4}
                focused={focusedField === 'name'}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
              />
              <FormField
                label="Email Address"
                type="email"
                placeholder="Ishan8@example.com"
                delay={0.5}
                focused={focusedField === 'email'}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="relative"
            >
              <div className={`border-b-2 transition-all duration-300 py-3 ${focusedField === 'message' ? 'border-orange-500' : 'border-zinc-800'}`}>
                <label className="text-[10px] sm:text-[11px] uppercase font-bold tracking-[0.15em] text-zinc-400 block mb-2">
                  Your Message
                </label>
                <textarea
                  rows="4"
                  placeholder="Tell us about your project, goals, and timeline..."
                  className="w-full bg-transparent border-none focus:ring-0 text-black placeholder-zinc-400 font-medium resize-none px-0 py-2 sm:p-4 outline-none"
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <motion.button
                type="submit"
                disabled={status === 'sending'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex items-center justify-center space-x-4 bg-black text-white px-8 py-5 w-full md:w-auto overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]"
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-orange-500"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.4 }}
                />

                <span className="relative z-10 font-bold uppercase tracking-[0.15em] text-xs sm:text-sm">
                  {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Message Sent!' : 'Send Message'}
                </span>

                {status !== 'sent' && (
                  <Send
                    size={18}
                    className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
                  />
                )}

                {status === 'sent' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="relative z-10"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 md:mt-8 text-[10px] sm:text-xs text-zinc-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="uppercase tracking-wider font-medium">Secure SSL</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  <span className="uppercase tracking-wider font-medium">24h Response</span>
                </div>
              </div>
            </motion.div>
          </form>
        </motion.section>

      </div>
    </div>
  );
};

// Reusable Contact Info Component
const ContactInfoItem = ({ icon: Icon, label, value, delay }) => {
  return (
    <motion.div
      className="flex items-center space-x-4 group cursor-pointer"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ x: 8 }}
    >
      <motion.div
        className="p-3 bg-zinc-900 relative overflow-hidden shrink-0"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="absolute inset-0 bg-orange-500"
          initial={{ y: '100%' }}
          whileHover={{ y: 0 }}
          transition={{ duration: 0.3 }}
        />
        <Icon size={18} className="text-white relative z-10 sm:w-5 sm:h-5" />
      </motion.div>
      <div className="pt-0.5">
        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-zinc-500 font-bold mb-0.5">{label}</p>
        <p className="text-base sm:text-lg md:text-xl font-bold group-hover:text-orange-500 transition-colors duration-300 break-all sm:break-normal">{value}</p>
      </div>
    </motion.div>
  );
};

// Reusable Form Field Component
const FormField = ({ label, type, placeholder, delay, focused, onFocus, onBlur }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay }}
      className="relative group"
    >
      <div className={`border-b-2 transition-all duration-300 py-2 sm:py-3 ${focused ? 'border-orange-500' : 'border-zinc-300'}`}>
        <label className="text-[10px] sm:text-[11px] uppercase font-bold tracking-[0.15em] text-zinc-400 block mb-1.5 sm:mb-2">
          {label}
        </label>
        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-transparent border-none outline-none focus:ring-0 px-0 py-1 text-black placeholder-zinc-400 font-semibold text-sm sm:text-base"
          onFocus={onFocus}
          onBlur={onBlur}
          required
        />
      </div>

      {/* Animated underline accent */}
      <motion.div
        className="h-0.5 bg-orange-500"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ transformOrigin: 'left' }}
      />
    </motion.div>
  );
};

export default ContactPage;