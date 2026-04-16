// src/Components/AboutPage/AboutPage.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
};

const rotateIn = {
  hidden: { opacity: 0, rotate: -5 },
  visible: {
    opacity: 1,
    rotate: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const cardHover = {
  hover: {
    y: -10,
    scale: 1.02,
    boxShadow:
      '0 20px 25px -5px rgba(168, 85, 247, 0.3), 0 10px 10px -5px rgba(168, 85, 247, 0.1)',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

const imageHover = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

const pulseGlow = {
  hover: {
    scale: 1.05,
    boxShadow: '0 0 20px 8px rgba(236, 72, 153, 0.5)',
    transition: {
      repeat: Infinity,
      repeatType: 'reverse',
      duration: 1.2,
    },
  },
};

const AboutPage = () => {
  const about = useSelector((state) => state.about);

  // ✅ State for Read more / Show less
  const [showMore, setShowMore] = useState(false);

  return (
    <motion.div
      className="bg-gray-50 min-h-screen overflow-hidden mt"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-700 to-pink-500 text-white py-20 md:py-28 text-center">
        {/* Animated background elements */}
        <motion.div
          className="absolute top-10 left-10 w-24 h-24 bg-purple-500 rounded-full opacity-20 filter blur-xl"
          animate={{
            y: [0, -20, 0],
            x: [0, 15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-16 right-16 w-32 h-32 bg-pink-500 rounded-full opacity-20 filter blur-2xl"
          animate={{
            y: [0, 20, 0],
            x: [0, -15, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full opacity-10 filter blur-xl"
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 12,
            ease: 'easeInOut',
            delay: 2,
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            variants={fadeInUp}
          >
            {about.hero.title}
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 font-light"
            variants={fadeInUp}
          >
            {about.hero.subtitle}
          </motion.p>
          <motion.div variants={fadeInUp}>
            <motion.button
              className="bg-white text-purple-700 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Discover Our Story
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Story Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <motion.div
          className="flex flex-col md:flex-row items-center gap-10 md:gap-16"
          variants={containerVariants}
        >
          <motion.div
            className="md:w-1/2 rounded-2xl overflow-hidden shadow-xl"
            variants={fadeInLeft}
            whileHover="hover"
          >
            <motion.img
              src={about.story.image}
              alt="Fashion"
              className="w-full h-full object-cover"
              variants={imageHover}
            />
          </motion.div>
          <motion.div className="md:w-1/2" variants={fadeInRight}>
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-6 text-gray-900"
              variants={fadeInUp}
            >
              {about.story.title}
            </motion.h2>

            {/* Text with Read more */}
            <motion.p
              className="text-gray-700 leading-relaxed text-lg mb-6"
              variants={fadeInUp}
            >
              {showMore
                ? about.story.text
                : `${about.story.text.substring(0, 150)}...`}
            </motion.p>

            {/* Smooth expand/collapse */}
            <AnimatePresence>
              {showMore && (
                <motion.p
                  className="text-gray-600 leading-relaxed text-base mb-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {about.story.extraText}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Toggle button */}
            <motion.div variants={fadeInUp}>
              <button
                className="text-purple-600 font-medium flex items-center group"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? 'Show less' : 'Read more'}
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="py-20 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-center"
        variants={scaleIn}
      >
        <div className="max-w-3xl mx-auto px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6"
            variants={fadeInUp}
          >
            {about.cta.title}
          </motion.h2>
          <motion.p
            className="mb-10 text-xl max-w-2xl mx-auto opacity-90"
            variants={fadeInUp}
          >
            {about.cta.text}
          </motion.p>
          <motion.a
            href={about.cta.buttonLink}
            className="bg-white text-purple-600 font-bold px-10 py-4 rounded-full shadow-lg inline-block"
            variants={pulseGlow}
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
          >
            {about.cta.buttonText}
          </motion.a>
        </div>
      </motion.section>

    </motion.div>
  );
};

export default AboutPage;
