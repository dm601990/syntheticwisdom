import React from 'react';
import { motion } from 'framer-motion';

const Logo: React.FC = () => {
  return (
    <motion.svg 
      width="160" 
      height="160" 
      viewBox="0 0 1000 1000" 
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0.7 }}
      animate={{ 
        opacity: 0.9,
        rotate: 360,
        scale: [0.98, 1.02, 0.98],
      }}
      transition={{
        rotate: {
          duration: 60,
          ease: "linear",
          repeat: Infinity
        },
        scale: {
          duration: 4,
          ease: "easeInOut",
          repeat: Infinity
        }
      }}
    >
      <circle cx="500" cy="500" r="80" fill="#2a9d8f" opacity="0.6" />
      <circle cx="500" cy="500" r="60" fill="#52c7bd" opacity="0.5" />
      <circle cx="500" cy="500" r="40" fill="#81e6d9" opacity="0.6" />
      <circle cx="500" cy="500" r="20" fill="#ffffff" opacity="0.9" />
      
      {/* Neural network paths */}
      {/* Outer ring nodes & connections */}
      <g stroke="#81e6d9" strokeWidth="3" fill="#81e6d9">
        {/* Top node */}
        <circle cx="500" cy="200" r="15" />
        <path d="M500,500 L500,215" fill="none" />
        
        {/* Top right nodes */}
        <circle cx="700" cy="250" r="15" />
        <path d="M500,500 L685,265" fill="none" />
        <circle cx="800" cy="400" r="15" />
        <path d="M500,500 L785,415" fill="none" />
        <circle cx="750" cy="700" r="15" />
        <path d="M500,500 L735,685" fill="none" />
        
        {/* Bottom right nodes */}
        <circle cx="650" cy="800" r="15" />
        <path d="M500,500 L635,785" fill="none" />
        <circle cx="500" cy="850" r="15" />
        <path d="M500,500 L500,835" fill="none" />
        
        {/* Bottom left nodes */}
        <circle cx="350" cy="800" r="15" />
        <path d="M500,500 L365,785" fill="none" />
        <circle cx="250" cy="700" r="15" />
        <path d="M500,500 L265,685" fill="none" />
        
        {/* Top left nodes */}
        <circle cx="200" cy="400" r="15" />
        <path d="M500,500 L215,415" fill="none" />
        <circle cx="300" cy="250" r="15" />
        <path d="M500,500 L315,265" fill="none" />
      </g>
      
      {/* Middle ring paths - curved design */}
      <g stroke="#52c7bd" strokeWidth="2.5" fill="#52c7bd">
        {/* Curved network connections - top */}
        <path d="M500,500 C600,400 650,300 580,250 C550,230 400,230 350,260 C300,300 400,400 500,500 Z" fill="none" />
        
        {/* Curved network connections - right */}
        <path d="M500,500 C600,600 700,650 750,580 C770,550 770,400 740,350 C700,300 600,400 500,500 Z" fill="none" />
        
        {/* Curved network connections - bottom */}
        <path d="M500,500 C400,600 350,700 420,750 C450,770 600,770 650,740 C700,700 600,600 500,500 Z" fill="none" />
        
        {/* Curved network connections - left */}
        <path d="M500,500 C400,400 300,350 250,420 C230,450 230,600 260,650 C300,700 400,600 500,500 Z" fill="none" />
        
        {/* Middle ring nodes */}
        <circle cx="400" cy="350" r="12" />
        <circle cx="650" cy="350" r="12" />
        <circle cx="650" cy="650" r="12" />
        <circle cx="400" cy="650" r="12" />
        <circle cx="350" cy="500" r="12" />
        <circle cx="500" cy="350" r="12" />
        <circle cx="650" cy="500" r="12" />
        <circle cx="500" cy="650" r="12" />
      </g>

      {/* Central glow effect */}
      <motion.circle 
        cx="400" 
        cy="500" 
        r="35" 
        fill="white" 
        opacity="0.5"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          r: [35, 38, 35]
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity
        }}
      />
    </motion.svg>
  );
};

export default Logo; 