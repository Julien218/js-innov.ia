import React from 'react';
import { motion } from 'framer-motion';

export default function SectionHeader({ title, subtitle, icon: Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center mb-16"
    >
      {Icon && (
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-600/20 to-purple-600/20 border border-pink-500/30">
            <Icon className="w-8 h-8 text-pink-400" />
          </div>
        </div>
      )}
      <h2 className="text-4xl lg:text-5xl font-bold mb-4">
        <span className="gradient-text">{title}</span>
      </h2>
      {subtitle && (
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">{subtitle}</p>
      )}
    </motion.div>
  );
}