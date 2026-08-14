import React from 'react';
import { motion } from 'framer-motion';

export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <motion.div
      initial={{ rotate: -8, scale: 0.96 }}
      animate={{ rotate: 0, scale: 1 }}
      transition={{ duration: 0.42, ease: 'easeOut' }}
      style={{ display: 'inline-flex', alignItems: 'center' }}
    >
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#c81e3a" />
            <stop offset="100%" stopColor="#ff6b72" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="12" fill="#ffffff" />
        <g transform="translate(8 6)">
          <path d="M24 4C18 12 12 16 12 24c0 8 6 14 12 14s12-6 12-14c0-8-6-12-12-20z" fill="url(#g)" />
          <path d="M24 18c-1 2-2 3-2 4a2 2 0 004 0c0-1-1-2-2-4z" fill="rgba(255,255,255,0.9)" opacity="0.18" />
          <circle cx="24" cy="24" r="22" stroke="rgba(11,102,35,0.06)" strokeWidth="2" fill="none" />
        </g>
      </svg>
    </motion.div>
  );
}
