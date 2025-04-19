'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  standardCardStyle, 
  standardCardContentStyle, 
  standardCardFooterStyle,
  standardCardTagStyle
} from '../styles/styles';

// Define interface for props
interface NewsCardProps {
  id: string;
  title: string;
  summary?: string;
  category: string | null;
  onExpand: (id: string) => void;
  date?: string;
  source?: string;
  wordCount?: number;
  url?: string; // Add URL property
  hideDate?: boolean; // Add optional prop to hide date
}

// Custom title style to avoid TypeScript errors
const customTitleStyle = {
  fontSize: '1.1rem',
  fontWeight: '600',
  marginBottom: '8px',
  color: '#ffffff',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2, // Limit to 2 lines
  WebkitBoxOrient: 'vertical' as const, // Explicit type cast
  lineHeight: '1.3',
  maxHeight: '2.6rem', // 2 lines * 1.3 line-height
};

// Custom description style
const customDescriptionStyle = {
  fontSize: '0.9rem',
  lineHeight: '1.5',
  color: '#b0b0b0',
  marginBottom: '12px',
  flex: '1 0 auto',
};

const sourceStyle = {
  fontSize: '0.75rem',
  fontWeight: '600',
  color: '#999',
  marginRight: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  backgroundColor: 'rgba(42, 157, 143, 0.08)', // Very subtle background
};

const dateStyle = {
  fontSize: '0.75rem',
  color: '#777',
};

const readTimeStyle = {
  fontSize: '0.75rem',
  color: '#2a9d8f',
  display: 'flex',
  alignItems: 'center',
  marginLeft: 'auto',
  minWidth: '80px', // Ensure consistent width
  justifyContent: 'flex-end', // Ensure right alignment
  padding: '2px 6px',
  borderRadius: '4px',
  backgroundColor: 'rgba(42, 157, 143, 0.08)', // Very subtle background
};

// Style for the small favicon
const logoIconStyle = {
  borderRadius: '4px', // Slightly rounded corners for the icon
  objectFit: 'contain' as const,
};

// Helper to get domain from URL
function getDomainFromUrl(url?: string): string | null {
  if (!url) return null;
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname || parsedUrl.host || null;
  } catch (e) {
    console.error("Error parsing URL for domain:", url, e);
    return null; // Handle invalid URLs
  }
}

// Function to calculate estimated read time
const calculateReadTime = (wordCount?: number, summary?: string): string => {
  // If we have an explicit wordCount, use it
  if (wordCount && wordCount > 0) {
    const wordsPerMinute = 200;
    const minutes = wordCount / wordsPerMinute;
    
    if (minutes < 1) {
      // For very short articles
      return minutes < 0.5 ? "< 1 min read" : "1 min read";
    }
    
    // Round to nearest 0.5 minute for more accuracy
    const roundedMinutes = Math.round(minutes * 2) / 2;
    return `${roundedMinutes} min read`;
  }
  
  // If we have a summary, use it to estimate
  if (summary) {
    const summaryWords = summary.split(/\s+/).length;
    
    // Estimate: summary is roughly 1/10th of article length (conservative estimate)
    const estimatedWords = summaryWords * 10;
    const wordsPerMinute = 200;
    const minutes = estimatedWords / wordsPerMinute;
    
    if (minutes < 1) {
      // For short articles based on summary
      return minutes < 0.5 ? "< 1 min read" : "1 min read";
    }
    
    // Round to nearest 0.5 minute for estimates based on summary
    const roundedMinutes = Math.round(minutes * 2) / 2;
    return `${roundedMinutes} min read`;
  }
  
  // Default fallback
  return "2 min read";
};

// Format date to be more readable
const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // Check if date is valid
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  } catch (e) {
    console.error('Date parsing error:', e);
    return '';
  }
};

// Helper function to get category color
const getCategoryColor = (category: string | null): { bg: string, text: string } => {
  if (!category) {
    // Return a default or neutral style if category is null
    return { bg: 'rgba(75, 85, 99, 0.1)', text: '#9ca3af' }; // Gray
  }
  switch(category) {
    case 'LLM':
      return { bg: 'rgba(79, 70, 229, 0.15)', text: '#6366f1' }; // Purple
    case 'Business':
      return { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6' }; // Blue
    case 'Research':
      return { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981' }; // Green
    case 'Policy':
      return { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b' }; // Amber
    case 'Ethics':
      return { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' }; // Red
    case 'Creative AI':
      return { bg: 'rgba(236, 72, 153, 0.15)', text: '#ec4899' }; // Pink
    case 'Tools':
      return { bg: 'rgba(75, 85, 99, 0.15)', text: '#4b5563' }; // Gray
    case 'Robotics':
      return { bg: 'rgba(37, 99, 235, 0.15)', text: '#2563eb' }; // Blue
    case 'Science':
      return { bg: 'rgba(6, 182, 212, 0.15)', text: '#06b6d4' }; // Cyan
    case 'Education':
      return { bg: 'rgba(124, 58, 237, 0.15)', text: '#7c3aed' }; // Violet
    case 'Simulated Silliness':
      return { bg: 'rgba(249, 115, 22, 0.15)', text: '#f97316' }; // Orange
    case 'AI News':
      return { bg: 'rgba(139, 92, 246, 0.15)', text: '#8b5cf6' }; // Purple
    default:
      return { bg: 'rgba(42, 157, 143, 0.15)', text: '#2a9d8f' }; // Default teal
  }
};

export function NewsCard({ 
  id, 
  title, 
  summary, 
  category, 
  onExpand,
  date,
  source,
  wordCount,
  url,
  hideDate = false // Default to false
}: NewsCardProps) {
  const domain = getDomainFromUrl(url);
  const faviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=32` : null;
  const categoryColors = getCategoryColor(category); // Get colors based on category
  const readTimeString = calculateReadTime(wordCount, summary);
  const formattedDate = formatDate(date);

  return (
    <motion.div 
      style={standardCardStyle} 
      whileHover={{ 
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
      }}
      transition={{ type: 'spring', stiffness: 300 }}
      onClick={() => onExpand(id)}
      tabIndex={0} // Make it focusable
      aria-label={`Read more about ${title}`}
    >
      <div style={standardCardContentStyle}>
        {/* Source and Date Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', gap: '8px' }}>
          {faviconUrl && (
            <Image 
              src={faviconUrl} 
              alt={`${source || 'Source'} logo`} 
              width={16} 
              height={16}
              style={logoIconStyle}
              unoptimized // For external URLs
              onError={(e) => { e.currentTarget.style.display = 'none'; }} // Hide if fails to load
            />
          )}
          <span style={sourceStyle}>{source || 'Unknown Source'}</span>
          {!hideDate && <span style={dateStyle}>{formattedDate}</span>}
        </div>
        
        {/* Title */}
        <h2 style={customTitleStyle}>{title}</h2>
        
        {/* Description */}
        <p style={customDescriptionStyle}>{summary || 'No description available.'}</p>
      </div>
      
      {/* Footer with Category Tag and Read Time */}
      <div style={standardCardFooterStyle}>
        {category && (
          <span 
            style={{
              ...standardCardTagStyle,
              backgroundColor: categoryColors.bg,
              color: categoryColors.text,
            }}
          >
            {category}
          </span>
        )}
        <span style={readTimeStyle}>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '4px' }}>
            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
          </svg>
          {readTimeString}
        </span>
      </div>
    </motion.div>
  );
}

export default NewsCard; 