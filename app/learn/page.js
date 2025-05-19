'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const skills = [
  { title: 'Photography Basics', description: 'Learn how to take stunning photos with any camera.', icon: '📸' },
  { title: 'Intro to Python', description: 'Start coding with Python from scratch.', icon: '🐍' },
  { title: 'Knitting 101', description: 'Create beautiful handmade pieces step-by-step.', icon: '🧶' },
  { title: 'Coffee Brewing', description: 'Master pour-overs, espresso, and cold brew techniques.', icon: '☕' },
  { title: 'Spanish Conversation', description: 'Practice conversational Spanish with peers.', icon: '🗣️' },
  { title: 'Personal Finance', description: 'Understand budgeting, saving, and investing.', icon: '💰' },
];

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 px-6 py-12">
      {/* Heading */}
      <motion.h1 
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-center mb-4"
      >
        Browse Skills to Learn
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-gray-600 mb-12 max-w-xl mx-auto"
      >
        Explore a variety of skills offered by people like you. Book 1-on-1 sessions and level up through micro-learning.
      </motion.p>

      {/* Skills Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition-all"
          >
            <div className="text-3xl mb-4">{skill.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{skill.title}</h3>
            <p className="text-gray-600 text-sm">{skill.description}</p>
            <Link href={`/learn/${skill.title.toLowerCase().replace(/\s+/g, '-')}`}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.03 }}
                className="mt-4 inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Learn More
              </motion.button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
