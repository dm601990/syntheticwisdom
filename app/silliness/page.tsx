'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { sillinessItems } from '../../data/sillinessData';
import Header from '../../components/Header';
import { pageStyle, gridStyle } from '../../styles/styles';
import { AnimatePresence, motion } from 'framer-motion';

// Search input styling
const searchInputStyle = {
  padding: '10px 16px',
  borderRadius: '24px',
  border: '1px solid #333',
  background: '#1a1d21',
  color: '#ddd',
  width: '100%',
  maxWidth: '460px',
  marginTop: '20px',
  marginBottom: '30px',
  outline: 'none',
  transition: 'all 0.2s ease',
  fontSize: '0.95rem',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
};

// Controls container
const controlsContainerStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  marginBottom: '20px',
  width: '100%',
  padding: '0 20px',
};

// Selected tag style
const tagFilterPillStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  padding: '4px 10px',
  borderRadius: '16px',
  backgroundColor: 'rgba(234, 88, 12, 0.2)',
  color: '#f97316',
  fontSize: '0.8rem',
  marginRight: '5px',
  marginBottom: '5px',
};

// Tag filters container
const activeTagsContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  justifyContent: 'center',
  marginBottom: '15px',
  maxWidth: '800px',
  margin: '0 auto 15px auto',
};

// Footer styling
const footerStyle = {
  textAlign: 'center' as const,
  marginTop: '50px',
  padding: '20px 0 30px 0',
  color: '#666',
  fontSize: '0.8rem',
  borderTop: '1px solid #2a2d31',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap' as const,
  gap: '10px',
};

const kofiButtonStyle = {
  display: 'inline-block',
  marginTop: '15px',
  marginLeft: '20px',
  padding: '8px 18px',
  borderRadius: '6px',
  border: '1px solid #FF5E5B',
  background: '#FF5E5B',
  color: '#ffffff',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

// Enhanced grid style to match across pages
const gridContainerStyle = {
  ...gridStyle,
  display: 'grid' as const,
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', // More consistent sizing
  alignItems: 'stretch', // Make sure items stretch to fill height
  gridAutoRows: '1fr', // Force equal row heights
  gap: '24px', // Slightly increase spacing
};

// Restore the specific interface for SillinessCard props
interface SillinessCardProps {
  item: {
    id: string;
    title: string;
    description: string;
    link: string;
    tags: string[];
    date: string;
  };
  onTagClick: (tag: string) => void;
  selectedTags: string[];
}

// Restore the specific SillinessCard component implementation
const SillinessCard: React.FC<SillinessCardProps> = ({ item, onTagClick, selectedTags }) => {
  // Original styles for SillinessCard
  const cardStyle = {
    backgroundColor: '#252830',
    borderRadius: '12px',
    overflow: 'hidden',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    border: '1px solid #383b42',
    transition: 'all 0.2s ease',
  };

  const contentStyle = {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%'
  };

  const dateContainerStyle = {
    marginBottom: '8px',
    fontSize: '0.8rem',
    color: '#7d8590',
    display: 'flex',
    justifyContent: 'space-between'
  };

  const titleStyle = {
    fontSize: '1.1rem',
    fontWeight: 'bold' as const,
    color: '#e0e0e0',
    marginBottom: '8px',
    lineHeight: '1.3',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box' as const,
    WebkitLineClamp: 2, // Limit to 2 lines
    WebkitBoxOrient: 'vertical' as const,
    maxHeight: '2.8rem', // Adjust based on line-height and clamp
  };
  
  const titleLinkStyle = {
    color: '#f97316',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  };

  const descriptionStyle = {
    fontSize: '0.9rem',
    color: '#aaa',
    marginBottom: '12px',
    lineHeight: '1.5',
    flex: '1 0 auto',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box' as const,
    WebkitLineClamp: 3, // Limit to 3 lines
    WebkitBoxOrient: 'vertical' as const,
  };

  const tagsContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '6px',
    marginTop: 'auto',
    paddingTop: '12px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    minHeight: '36px' // Ensure consistent height
  };

  const tagStyle = {
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    height: '24px' // Fixed height for consistency
  };

  return (
    // Use motion.div for animation consistency with other pages
    <motion.div
        style={cardStyle}
        whileHover={{
            transform: 'translateY(-4px)', 
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.3)',
            borderColor: '#4a4d52' 
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 20 }}
    >
      <div style={contentStyle}>
        {/* Date Container - Now empty */}
        <div style={dateContainerStyle}>
           {/* The span containing {formatDate(item.date)} is removed */}
        </div>
        
        {/* Title - link to original content */}
        <h3 style={titleStyle}>
          <a 
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
            style={titleLinkStyle}
            onMouseOver={(e) => e.currentTarget.style.color = '#fb923c'}
            onMouseOut={(e) => e.currentTarget.style.color = '#f97316'}
            title={item.title} // Add title for tooltip on hover
          >
            {item.title}
          </a>
        </h3>
        
        {/* Description */}
        <p style={descriptionStyle} title={item.description}>
          {item.description}
        </p>
        
        {/* Tags */}
        <div style={tagsContainerStyle}>
          {item.tags.map((tag, index) => (
            <span 
              key={index}
              style={{
                ...tagStyle,
                backgroundColor: selectedTags.includes(tag) ? 'rgba(249, 115, 22, 0.3)' : 'rgba(249, 115, 22, 0.1)',
                color: '#f97316',
              }}
              onClick={() => onTagClick(tag)}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = selectedTags.includes(tag) ? 'rgba(249, 115, 22, 0.4)' : 'rgba(249, 115, 22, 0.2)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = selectedTags.includes(tag) ? 'rgba(249, 115, 22, 0.3)' : 'rgba(249, 115, 22, 0.1)'}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default function SillinessPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Search debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms debounce time
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle tag filter change
  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setSelectedTags([]);
    setSearchTerm('');
    setDebouncedSearchTerm('');
  };
  
  // Filter items based on search term and selected tags
  const filteredItems = useMemo(() => {
    let results = sillinessItems;
    
    // Apply tag filters if selected
    if (selectedTags.length > 0) {
      results = results.filter(item => 
        selectedTags.every(tag => item.tags.includes(tag))
      );
    }
    
    // Apply search filter if there's a search term
    if (debouncedSearchTerm.trim()) {
      const lowerCaseSearchTerm = debouncedSearchTerm.toLowerCase();
      results = results.filter(item => 
        item.title.toLowerCase().includes(lowerCaseSearchTerm) || 
        item.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        item.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }
    
    return results;
  }, [debouncedSearchTerm, selectedTags]);

  return (
    <div style={pageStyle}>
      <Header categories={[]} activeCategory="" setActiveCategory={() => {}} />
      
      {/* Controls Container */}
      <div style={controlsContainerStyle}>
        {/* Search Input */}
        <input
          type="search"
          placeholder="Search for fun AI content..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={searchInputStyle}
          aria-label="Search for silliness content"
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = '0 3px 12px rgba(42, 157, 143, 0.25)';
            e.currentTarget.style.borderColor = '#2a9d8f';
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
            e.currentTarget.style.borderColor = '#333';
          }}
        />
        
        {/* Active Tag Filters */}
        {selectedTags.length > 0 && (
          <div style={activeTagsContainerStyle}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5px' }}>
              {selectedTags.map(tag => (
                <div key={tag} style={tagFilterPillStyle}>
                  <span>{tag}</span>
                  <button
                    onClick={() => handleTagClick(tag)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#f97316',
                      fontSize: '0.9rem',
                      padding: '0 0 0 2px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    aria-label={`Remove ${tag} filter`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            {/* Delete Selected button */}
            <button
              onClick={clearAllFilters}
              style={{
                marginTop: '15px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: '#f97316',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.9rem',
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#ea580c'}
              onMouseOut={(e) => e.currentTarget.style.background = '#f97316'}
            >
              Delete Selected
            </button>
          </div>
        )}
        
        {/* Results summary if filtering is active */}
        {(selectedTags.length > 0 || debouncedSearchTerm) && (
          <div style={{ textAlign: 'center', marginBottom: '20px', color: '#aaa', fontSize: '0.9rem' }}>
            Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
            {debouncedSearchTerm ? ` matching "${debouncedSearchTerm}"` : ''}
            {selectedTags.length > 0 ? ` with selected tags` : ''}
          </div>
        )}
      </div>
      
      {/* Silliness Grid */}
      <div style={gridContainerStyle}>
        <AnimatePresence>
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SillinessCard 
                  item={item} 
                  onTagClick={handleTagClick} 
                  selectedTags={selectedTags}
                />
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '40px',
                color: '#888'
              }}
            >
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>No silly content found</h3>
              <p>Try adjusting your search or removing tag filters.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Footer */}
      <footer style={footerStyle}>
        <span>
          © {new Date().getFullYear()} Synthetic Wisdom. All rights reserved (mostly).
        </span>
        {/* Ko-fi Link */}
        <a
          href="https://ko-fi.com/syntheticwisdom"
          target="_blank"
          rel="noopener noreferrer"
          style={kofiButtonStyle}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E04A48'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FF5E5B'}
        >
          Support Us on Ko-fi ❤️
        </a>
      </footer>
    </div>
  );
} 