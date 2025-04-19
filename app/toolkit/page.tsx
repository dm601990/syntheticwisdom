'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { toolkitItems, ToolkitItem } from '../../data/toolkitData';
import Header from '../../components/Header';
import { pageStyle, gridStyle } from '../../styles/styles';
import { AnimatePresence, motion } from 'framer-motion';

// Type definitions with colors
const typeDefinitions = {
  Model: { color: '#22c55e', label: 'Model' },
  Tool: { color: '#3b82f6', label: 'Tool' },
  Platform: { color: '#f59e0b', label: 'Platform' },
};

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

// Button container style
const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
  marginBottom: '20px',
  flexWrap: 'wrap' as const,
};

// Type button style with improved styling
const typeButtonStyle = (isActive: boolean, color: string) => ({
  padding: '6px 14px',
  borderRadius: '8px',
  border: `1px solid ${isActive ? color : '#555'}`,
  background: isActive ? `${color}20` : 'rgba(255, 255, 255, 0.03)', // Slightly visible background
  color: isActive ? color : '#aaa',
  cursor: 'pointer',
  fontSize: '0.9rem',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  boxShadow: isActive ? `0 2px 8px ${color}20` : 'none', // Add subtle shadow for active state
  fontWeight: isActive ? '500' : 'normal', // Bolder text for active state
});

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

// Modal styles
const modalOverlayStyle = {
  position: 'fixed' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.75)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  padding: '20px',
  backdropFilter: 'blur(4px)',
};

const modalContentStyle = {
  backgroundColor: '#252830',
  borderRadius: '12px',
  padding: '30px',
  maxWidth: '800px',
  width: '100%',
  maxHeight: '80vh',
  overflowY: 'auto' as const,
  position: 'relative' as const,
  border: '1px solid #34363f',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
};

const closeButtonStyle = {
  position: 'absolute' as const,
  top: '15px',
  right: '15px',
  background: 'transparent',
  border: 'none',
  color: '#888',
  fontSize: '1.5rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: '16px',
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

export default function ToolkitPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<ToolkitItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // Count items by type for display in filter buttons
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Model: 0,
      Tool: 0,
      Platform: 0,
    };
    
    toolkitItems.forEach(item => {
      counts[item.type]++;
    });
    
    return counts;
  }, []);

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

  // Handle type filter change
  const handleTypeFilterChange = (type: string) => {
    if (selectedType === type) {
      setSelectedType(null); // Toggle off if already selected
    } else {
      setSelectedType(type);
    }
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
    setSelectedType(null);
    setSelectedTags([]);
    setSearchTerm('');
    setDebouncedSearchTerm('');
  };
  
  // Open item detail modal
  const openItemDetails = (item: ToolkitItem) => {
    setSelectedItem(item);
    setShowModal(true);
  };
  
  // Close modal
  const closeModal = () => {
    setShowModal(false);
  };
  
  // Close modal when clicking outside
  const modalRef = useRef<HTMLDivElement>(null);
  const handleModalClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeModal();
    }
  };

  // Get all unique tags from toolkit items
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    toolkitItems.forEach(item => {
      item.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);
  
  // Count occurrences of each tag
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    toolkitItems.forEach(item => {
      item.tags.forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return counts;
  }, []);

  // Filter toolkit items based on search term, selected type, and selected tags
  const filteredTools = useMemo(() => {
    let results = toolkitItems;
    
    // Filter by type if selected
    if (selectedType) {
      results = results.filter(item => item.type === selectedType);
    }
    
    // Filter by tags if selected
    if (selectedTags.length > 0) {
      results = results.filter(item => 
        selectedTags.every(tag => item.tags.includes(tag))
      );
    }
    
    // Filter by search term
    if (debouncedSearchTerm.trim()) {
      const lowerCaseSearchTerm = debouncedSearchTerm.toLowerCase();
      results = results.filter(item => 
        item.name.toLowerCase().includes(lowerCaseSearchTerm) || 
        item.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        item.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }
    
    return results;
  }, [debouncedSearchTerm, selectedType, selectedTags]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        closeModal();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

  return (
    <div style={pageStyle}>
      <Header categories={[]} activeCategory="" setActiveCategory={() => {}} />
      
      {/* Controls Container */}
      <div style={controlsContainerStyle}>
        {/* Remove Filter Buttons */}
        
        {/* Search Input */}
        <input
          type="search"
          placeholder="Search tools and models..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={searchInputStyle}
          aria-label="Search for AI tools and models"
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = '0 3px 12px rgba(42, 157, 143, 0.25)';
            e.currentTarget.style.borderColor = '#2a9d8f';
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
            e.currentTarget.style.borderColor = '#333';
          }}
        />
        
        {/* Type Filter Buttons */}
        <div style={buttonContainerStyle}>
          {Object.entries(typeDefinitions).map(([type, { color, label }]) => (
            <button
              key={type}
              onClick={() => handleTypeFilterChange(type)}
              style={typeButtonStyle(selectedType === type, color)}
              aria-pressed={selectedType === type}
            >
              {label} ({typeCounts[type as keyof typeof typeCounts]})
            </button>
          ))}
          
          {selectedType && (
            <button
              onClick={clearAllFilters}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid #444',
                background: 'transparent',
                color: '#aaa',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>
      
      {/* Results summary if filtering is active */}
      {(selectedType || selectedTags.length > 0 || debouncedSearchTerm) && (
        <div style={{ textAlign: 'center', marginBottom: '20px', color: '#aaa', fontSize: '0.9rem' }}>
          Showing {filteredTools.length} {filteredTools.length === 1 ? 'item' : 'items'}
          {debouncedSearchTerm ? ` matching "${debouncedSearchTerm}"` : ''}
          {selectedType ? ` in category "${selectedType}"` : ''}
          {selectedTags.length > 0 ? ` with tags ${selectedTags.map(t => `"${t}"`).join(', ')}` : ''}
        </div>
      )}
      
      {/* Toolkit Grid */}
      <div style={gridContainerStyle}>
        <AnimatePresence>
          {filteredTools.map(item => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ToolkitCard item={item} onTagClick={handleTagClick} onViewDetails={openItemDetails} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* No results message */}
      {filteredTools.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          style={{
            textAlign: 'center',
            padding: '40px',
            color: '#888'
          }}
        >
          <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>No tools or models found</h3>
          <p>Try adjusting your search or filters.</p>
        </motion.div>
      )}
      
      {/* Footer */}
      <footer style={footerStyle}>
        <span>
          © {new Date().getFullYear()} Synthetic Wisdom. All rights reserved.
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
      
      {/* Item Detail Modal */}
      {showModal && selectedItem && (
        <div 
          style={modalOverlayStyle} 
          onClick={handleModalClick}
          aria-modal="true"
          role="dialog"
        >
          <div style={modalContentStyle} ref={modalRef}>
            <button
              style={closeButtonStyle}
              onClick={closeModal}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              aria-label="Close details"
            >
              ✕
            </button>
            
            <ItemDetailView item={selectedItem} onTagClick={handleTagClick} />
          </div>
        </div>
      )}
    </div>
  );
}

// Toolkit Card Component
interface ToolkitCardProps {
  item: ToolkitItem;
  onTagClick: (tag: string) => void;
  onViewDetails: (item: ToolkitItem) => void;
}

const ToolkitCard: React.FC<ToolkitCardProps> = ({ item, onTagClick, onViewDetails }) => {
  // Function to get the corresponding icon for type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Model':
        return '🧠';
      case 'Tool':
        return '🛠️';
      case 'Platform':
        return '🏢';
      default:
        return '🔧';
    }
  };
  
  // Function to determine border color based on type
  const getBorderColor = (type: string) => {
    return typeDefinitions[type as keyof typeof typeDefinitions]?.color || '#ccc';
  };

  const titleStyle = {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginTop: '4px',
    marginBottom: '8px',
    color: '#e0e0e0',
    lineHeight: '1.3',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box' as const,
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
    maxHeight: '2.6rem', // 2 lines * 1.3 line-height
  };
  
  const descriptionStyle = {
    fontSize: '0.9rem',
    color: '#aaa',
    lineHeight: '1.5',
    flex: '1',
    marginBottom: '16px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box' as const,
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical' as const,
  };

  // Style for Developer info
  const developerStyle = {
    fontSize: '0.8rem',
    color: '#888',
    marginBottom: '8px',
    marginTop: '4px',
  };

  // Style for Key Features section
  const featuresContainerStyle = {
    marginTop: '12px',
    marginBottom: '8px',
  };

  const featuresTitleStyle = {
    fontSize: '0.85rem',
    fontWeight: '600' as const,
    color: '#bbb',
    marginBottom: '6px',
  };

  const featureTagStyle = {
    display: 'inline-block',
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    color: '#aaa',
    fontSize: '0.75rem',
    marginRight: '4px',
    marginBottom: '4px',
  };

  return (
    <div 
      style={{
        backgroundColor: '#252830',
        borderRadius: '12px',
        overflow: 'hidden',
        height: '100%',
        position: 'relative',
        border: '1px solid #34363f',
        borderLeft: `3px solid ${getBorderColor(item.type)}`,
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
        cursor: 'pointer',
      }}
      onClick={() => onViewDetails(item)}
    >
      <div style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}>
        {/* Header with type */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '8px',
          fontSize: '0.8rem',
          color: '#888',
        }}>
          <span style={{ 
            backgroundColor: '#34363f', 
            borderRadius: '4px', 
            padding: '2px 6px',
            marginRight: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: getBorderColor(item.type),
          }}>
            <span style={{ fontSize: '0.9rem' }}>{getTypeIcon(item.type)}</span> {item.type}
          </span>
        </div>
        
        {/* Title - Clickable and opens in new tab */}
        <h3 style={titleStyle}>
          <a 
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              color: getBorderColor(item.type), 
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
            onMouseOut={(e) => e.currentTarget.style.color = getBorderColor(item.type)}
            onClick={(e) => e.stopPropagation()} // Prevent card click when clicking link
            title={item.name} // Add title for tooltip on hover
          >
            {item.name}
          </a>
        </h3>
        
        {/* Developer Info */}
        {item.developer && (
          <div style={developerStyle}>By: {item.developer}</div>
        )}
        
        {/* Description */}
        <p style={descriptionStyle} title={item.description}>
          {item.description}
        </p>

        {/* Key Features */}
        {item.keyFeatures && item.keyFeatures.length > 0 && (
          <div style={featuresContainerStyle}>
            <h4 style={featuresTitleStyle}>Key Features:</h4>
            <div>
              {item.keyFeatures.map((feature, index) => (
                <span key={index} style={featureTagStyle}>
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Footer with tags */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          marginTop: 'auto',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          minHeight: '36px', // Ensure consistent height
        }}>
          {item.tags.map((tag, index) => (
            <span 
              key={index}
              style={{
                padding: '3px 8px',
                borderRadius: '4px',
                backgroundColor: `${getBorderColor(item.type)}15`,
                color: getBorderColor(item.type),
                fontSize: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                height: '24px', // Fixed height for consistency
              }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                onTagClick(tag);
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Item Detail View Component
interface ItemDetailViewProps {
  item: {
    id: string;
    name: string;
    description: string;
    link: string;
    type: 'Model' | 'Tool' | 'Platform';
    tags: string[];
  };
  onTagClick: (tag: string) => void;
}

const ItemDetailView: React.FC<ItemDetailViewProps> = ({ item, onTagClick }) => {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ 
          backgroundColor: '#34363f',
          borderRadius: '6px',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem'
        }}>
          {item.type === 'Model' ? '🤖' : item.type === 'Tool' ? '🛠️' : '📊'}
        </div>
        <div>
          <span style={{ 
            color: '#999', 
            textTransform: 'uppercase' as const, 
            fontSize: '0.8rem', 
            fontWeight: 'bold',
            letterSpacing: '0.05em'
          }}>
            {item.type}
          </span>
          <h2 style={{ margin: '5px 0 0 0', color: '#fff', fontSize: '1.8rem' }}>
            {item.name}
          </h2>
        </div>
      </div>
      
      {/* Main content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Description */}
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: '#ccc', fontSize: '1.1rem' }}>Overview</h3>
          <p style={{ margin: '0', color: '#aaa', lineHeight: '1.6', fontSize: '1rem' }}>
            {item.description}
          </p>
        </div>
        
        {/* Tags */}
        <div>
          <h3 style={{ margin: '0 0 10px 0', color: '#ccc', fontSize: '1.1rem' }}>Capabilities & Features</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {item.tags.map((tag, index) => (
              <span 
                key={index}
                style={{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(42, 157, 143, 0.15)',
                  color: '#2a9d8f',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => {
                  onTagClick(tag);
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(42, 157, 143, 0.3)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(42, 157, 143, 0.15)'}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        {/* External links */}
        <div>
          <h3 style={{ margin: '0 0 10px 0', color: '#ccc', fontSize: '1.1rem' }}>Resources</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                padding: '10px 15px',
                backgroundColor: '#2a9d8f',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '0.95rem',
                display: 'inline-block',
                width: 'fit-content',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#38b2a8'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2a9d8f'}
            >
              Visit Official Website
            </a>
            {/* Additional links would go here */}
          </div>
        </div>
        
        {/* Additional info like papers, pricing would go here */}
      </div>
    </div>
  );
}; 