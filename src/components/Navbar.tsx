'use client';

import { motion } from 'framer-motion';

const navItems = ['Work', 'About', 'Contact'];

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-40 px-8 py-5 flex items-center justify-between"
    >
      {/* Logo */}
      <a href="/" className="text-white/70 hover:text-white transition-colors text-sm tracking-widest uppercase">
        Portfolio
      </a>

      {/* Nav Items */}
      <div className="flex items-center gap-8">
        {navItems.map((item) => (
          <button
            key={item}
            className="text-white/40 hover:text-white/80 transition-colors text-sm tracking-wider uppercase"
          >
            {item}
          </button>
        ))}
      </div>
    </motion.nav>
  );
}
