'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  standardCardStyle, 
  standardCardContentStyle, 
  standardCardTitleStyle, 
  standardCardDescriptionStyle,
  standardCardFooterStyle,
  standardCardTagStyle
} from '../styles/styles';

// Define interface for props
interface NewsCardProps {
  id: string;
  title: string;
  summary?: string;
  category: string;
  energy: number;
  onExpand: (id: string) => void;
  date?: string;
  source?: string;
  wordCount?: number;
  url?: string; // Add URL property
}

// Basic styling
const cardStyle = {
  background: '#1a1d21', // Dark card background
  border: '1px solid #333',
  borderRadius: '8px',
  color: '#e0e0e0',
  cursor: 'pointer',
  position: 'relative' as const,
  overflow: 'hidden', // Hide overflow for indicator
};

const contentStyle = {
  padding: '16px',
  paddingLeft: '24px', // Add extra left padding for the energy indicator
};

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

const metadataStyle = {
  fontSize: '0.8rem',
  color: '#777',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap' as const,
};

const sourceStyle = {
  fontSize: '0.75rem',
  fontWeight: '600',
  color: '#999',
  marginRight: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
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

const chipStyle = {
  display: 'inline-block',
  padding: '2px 6px',
  borderRadius: '4px',
  fontSize: '0.7rem',
  marginRight: '6px',
  background: 'rgba(42, 157, 143, 0.15)',
  color: '#2a9d8f',
};

// Style for the small favicon
const logoIconStyle = {
  borderRadius: '4px', // Slightly rounded corners for the icon
  objectFit: 'contain' as const,
};

// Energy indicator styling (vertical bar on left)
const energyIndicatorStyle = (energy: number) => ({
  position: 'absolute' as const,
  top: '0',
  left: '0',
  width: '5px', // Width of the bar
  height: '100%', // Full height of the card
  backgroundColor: `hsl(170, 60%, ${30 + energy * 40}%)`, // Adjust HSL values as needed
  transition: 'background-color 0.3s ease',
});

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
const getCategoryColor = (category: string): { bg: string, text: string } => {
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
  energy, 
  onExpand,
  date,
  source,
  wordCount,
  url
}: NewsCardProps) {
  const readTime = calculateReadTime(wordCount, summary);
  const formattedDate = formatDate(date);
  
  // Extract domain and create favicon URL
  const domain = getDomainFromUrl(url);
  const faviconUrl = domain ? `https://icons.duckduckgo.com/ip3/${domain}.ico` : null;
  const fallbackIconUrl = '/images/default-favicon.svg'; // Use SVG instead of PNG
  
  return (
    // Use framer-motion for animations
    <motion.div
      layoutId={`card-container-${id}`}
      style={{
        ...standardCardStyle,
        borderLeft: `5px solid hsl(170, 60%, ${30 + energy * 40}%)`, // Energy indicator
      }}
      whileHover={{ 
        scale: 1.02, 
        backgroundColor: '#2a2d31',
        boxShadow: `0 4px 20px rgba(42, 157, 143, ${energy * 0.5})` // Energy affects glow intensity
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onClick={() => onExpand(id)}
    >
      {/* Content with padding */}
      <div style={standardCardContentStyle}>
        {/* Source and date */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          {source && (
            <div style={sourceStyle}>
              {faviconUrl && (
                <Image
                  src={faviconUrl}
                  alt={`${source || domain || 'Source'} logo`}
                  width={16}
                  height={16}
                  style={logoIconStyle}
                  onError={(e) => { 
                    // When favicon fails to load, try the fallback image instead
                    const imgElement = e.target as HTMLImageElement;
                    imgElement.src = fallbackIconUrl;
                    imgElement.onerror = () => { imgElement.style.display = 'none'; }; // Hide if fallback also fails
                  }}
                />
              )}
              <span style={{ flexShrink: 0 }}>{source}</span>
            </div>
          )}
          {formattedDate && <span style={dateStyle}>{formattedDate}</span>}
        </div>
        
        {/* Title */}
        <motion.h3 
          layoutId={`card-title-${id}`}
          style={{...standardCardTitleStyle, ...customTitleStyle}}
        >
          {title}
        </motion.h3>
        
        {/* Summary */}
        {summary && (
          <motion.p 
            layoutId={`card-description-${id}`}
            style={{...standardCardDescriptionStyle, ...customDescriptionStyle}}
          >
            {summary}
          </motion.p>
        )}
        
        {/* Footer with category tag and read time */}
        <motion.div 
          layoutId={`card-footer-${id}`}
          style={standardCardFooterStyle}
        >
          {/* Category Chip with dynamic colors */}
          <div style={{
            ...standardCardTagStyle,
            backgroundColor: getCategoryColor(category).bg,
            color: getCategoryColor(category).text
          }}>
            {category}
          </div>
          
          {/* Read Time with Clock Icon */}
          <div style={readTimeStyle}>
            <span style={{ marginRight: '4px', fontSize: '0.9em' }}>🕒</span> {/* Clock emoji */}
            {readTime}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default NewsCard; 