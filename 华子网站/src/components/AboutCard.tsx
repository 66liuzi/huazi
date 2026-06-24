'use client';

import { motion } from 'framer-motion';

const skills = [
  'Video Editing',
  'Color Grading',
  'Sound Design',
  'Cinematography',
  'Motion Graphics',
];

export default function AboutCard() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className="max-w-4xl mx-auto px-6 py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass-strong rounded-3xl p-10 md:p-16"
      >
        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* Profile image placeholder */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
              <span className="text-white/30 text-sm">Photo</span>
            </div>
          </div>

          {/* Text info */}
          <div className="flex-1">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              About Me
            </h3>
            <p className="text-slate-400 leading-relaxed mb-6">
              A visual storyteller with over 8 years of experience in filmmaking,
              editing, and motion design. Passionate about crafting cinematic
              experiences that captivate and inspire.
            </p>

            {/* Skills */}
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 rounded-full glass text-sm text-slate-300 
                             border border-white/5 hover:border-cyan-400/20 
                             transition-all duration-300 hover:scale-105"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
