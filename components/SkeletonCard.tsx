import React from 'react';
import { motion } from 'framer-motion';

// Skeleton pulse animation
const pulseAnimation = {
  opacity: [0.5, 0.8, 0.5],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const skeletonCardStyle = {
  background: '#1a1d21',
  border: '1px solid #333',
  borderRadius: '8px',
  padding: '16px',
  paddingLeft: '24px',
  position: 'relative' as const,
  overflow: 'hidden',
  height: '220px',
};

const skeletonBarStyle = {
  position: 'absolute' as const,
  top: '0',
  left: '0',
  width: '5px',
  height: '100%',
  background: '#333',
};

const skeletonSourceStyle = {
  height: '10px',
  width: '100px',
  borderRadius: '4px',
  background: '#333',
  marginBottom: '6px',
};

const skeletonDateStyle = {
  height: '10px',
  width: '80px',
  borderRadius: '4px',
  background: '#333',
  position: 'absolute' as const,
  right: '16px',
  top: '16px',
};

const skeletonTitleStyle = {
  height: '24px',
  width: '90%',
  borderRadius: '4px',
  background: '#333',
  marginBottom: '16px',
  marginTop: '12px',
};

const skeletonSummaryStyle = {
  marginBottom: '20px',
};

const skeletonLineStyle = {
  height: '12px',
  width: '100%',
  borderRadius: '4px',
  background: '#333',
  marginBottom: '8px',
};

const skeletonMetaStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const skeletonCategoryStyle = {
  height: '18px',
  width: '70px',
  borderRadius: '10px',
  background: '#333',
};

const skeletonReadTimeStyle = {
  height: '18px',
  width: '80px',
  borderRadius: '10px',
  background: '#333',
};

const SkeletonCard: React.FC = () => {
  return (
    <div style={skeletonCardStyle}>
      {/* Energy indicator skeleton */}
      <div style={skeletonBarStyle} />
      
      {/* Source skeleton */}
      <motion.div 
        style={skeletonSourceStyle} 
        animate={pulseAnimation} 
      />
      
      {/* Date skeleton */}
      <motion.div 
        style={skeletonDateStyle} 
        animate={pulseAnimation} 
      />
      
      {/* Title skeleton */}
      <motion.div 
        style={skeletonTitleStyle} 
        animate={pulseAnimation} 
      />
      
      {/* Summary skeleton */}
      <div style={skeletonSummaryStyle}>
        <motion.div 
          style={skeletonLineStyle} 
          animate={pulseAnimation} 
        />
        <motion.div 
          style={{ ...skeletonLineStyle, width: '95%' }} 
          animate={pulseAnimation} 
        />
        <motion.div 
          style={{ ...skeletonLineStyle, width: '80%' }} 
          animate={pulseAnimation} 
        />
      </div>
      
      {/* Metadata skeleton */}
      <div style={skeletonMetaStyle}>
        <motion.div 
          style={skeletonCategoryStyle} 
          animate={pulseAnimation} 
        />
        <motion.div 
          style={skeletonReadTimeStyle} 
          animate={pulseAnimation} 
        />
      </div>
    </div>
  );
};

export default SkeletonCard; 