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
    
    // Filter by debounced search term
    if (debouncedSearchTerm) {
      const searchTermLower = debouncedSearchTerm.toLowerCase();
      results = results.filter(item =>
        item.name.toLowerCase().includes(searchTermLower) ||
        item.description.toLowerCase().includes(searchTermLower)
      );
    }

    // Sort results: prioritize exact name matches, then start-of-name matches, then others
    if (debouncedSearchTerm) {
      const searchTermLower = debouncedSearchTerm.toLowerCase();
      results.sort((a, b) => {
        const aNameLower = a.name.toLowerCase();
        const bNameLower = b.name.toLowerCase();
        
        const aExactMatch = aNameLower === searchTermLower;
        const bExactMatch = bNameLower === searchTermLower;
        const aStartsWith = aNameLower.startsWith(searchTermLower);
        const bStartsWith = bNameLower.startsWith(searchTermLower);

        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        
        return aNameLower.localeCompare(bNameLower);
      });
    }
    
    return results;
  }, [debouncedSearchTerm, selectedType, selectedTags]);

  // Collect unique tags from the filtered items
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    filteredTools.forEach(item => {
      item.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [filteredTools]);

  // Check if any filters are active
  const filtersActive = selectedType !== null || selectedTags.length > 0 || searchTerm !== '';

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    
    if (showModal) {
      window.addEventListener('keydown', handleKeyDown);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showModal]);

  // Scroll lock when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  // Reset search term if type or tags change
  useEffect(() => {
    // Logic here if needed to reset search on filter changes
  }, [selectedType, selectedTags]);

  // Enhanced card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <div style={pageStyle}>
      <Header />
      <div style={controlsContainerStyle}>
        <input
          type="text"
          placeholder="Search tools, models, platforms..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={searchInputStyle}
        />
        <div style={buttonContainerStyle}>
          {Object.entries(typeDefinitions).map(([type, { color, label }]) => (
            <button 
              key={type} 
              onClick={() => handleTypeFilterChange(type)} 
              style={typeButtonStyle(selectedType === type, color)}
              aria-pressed={selectedType === type}
            >
              <span style={{ 
                width: '10px', 
                height: '10px', 
                backgroundColor: color, 
                borderRadius: '50%',
                display: 'inline-block'
              }}></span>
              {label} ({typeCounts[type]})
            </button>
          ))}
        </div>
        <div style={buttonContainerStyle}>
          {availableTags.map(tag => (
            <button 
              key={tag} 
              onClick={() => handleTagClick(tag)} 
              style={tagButtonStyle(selectedTags.includes(tag))}
              aria-pressed={selectedTags.includes(tag)}
            >
              #{tag}
            </button>
          ))}
        </div>
        {filtersActive && (
          <button
            onClick={clearAllFilters}
            style={clearFilterButtonStyle}
            aria-label="Clear all filters"
          >
            Clear All Filters
          </button>
        )}
      </div>
      <AnimatePresence>
        <motion.div 
          style={gridContainerStyle}
          layout // Animate layout changes
        >
          {filteredTools.map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout // Animate position changes
            >
              <ToolkitCard 
                item={item} 
                onTagClick={handleTagClick} 
                onViewDetails={openItemDetails}
                selectedTags={selectedTags}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      {filteredTools.length === 0 && (
        <p style={noResultsStyle}>No items found matching your criteria.</p>
      )}
      <AnimatePresence>
        {showModal && selectedItem && (
          <motion.div
            style={modalOverlayStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleModalClick}
          >
            <motion.div
              ref={modalRef}
              style={modalContentStyle}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button 
                onClick={closeModal} 
                style={closeButtonStyle} 
                aria-label="Close details"
              >
                &times;
              </button>
              <ItemDetailView item={selectedItem} onTagClick={handleTagClick} selectedTags={selectedTags} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <footer style={footerStyle}>
        <p>&copy; 2024 Synthetic Wisdom</p>
        <p>
          Discover something useful? Consider supporting the project.
          <a 
            href="https://ko-fi.com/syntheticwisdom" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={kofiButtonStyle} 
            aria-label="Support Synthetic Wisdom on Ko-fi"
          >
            Support on Ko-fi
          </a>
        </p>
      </footer>
    </div>
  );
}

// Helper function to generate consistent tag styles
const tagButtonStyle = (isActive: boolean) => ({
  padding: '4px 10px',
  borderRadius: '6px',
  border: `1px solid ${isActive ? '#888' : '#444'}`,
  background: isActive ? '#555' : 'rgba(255, 255, 255, 0.05)', // Slightly visible background
  color: isActive ? '#eee' : '#aaa',
  cursor: 'pointer',
  fontSize: '0.85rem',
  transition: 'all 0.2s ease',
  boxShadow: isActive ? '0 1px 4px rgba(0, 0, 0, 0.2)' : 'none',
});

// Clear filter button style
const clearFilterButtonStyle = {
  marginTop: '15px',
  padding: '6px 14px',
  borderRadius: '8px',
  border: '1px solid #777',
  background: 'rgba(255, 255, 255, 0.05)',
  color: '#bbb',
  cursor: 'pointer',
  fontSize: '0.9rem',
  transition: 'all 0.2s ease',
};

// Style for no results message
const noResultsStyle = {
  textAlign: 'center' as const,
  marginTop: '40px',
  color: '#888',
  fontSize: '1rem',
};

// Props definition for ToolkitCard
interface ToolkitCardProps {
  item: ToolkitItem;
  onTagClick: (tag: string) => void;
  onViewDetails: (item: ToolkitItem) => void;
  selectedTags: string[];
}

// The ToolkitCard component
const ToolkitCard: React.FC<ToolkitCardProps> = ({ item, onTagClick, onViewDetails, selectedTags }) => {
  // Helper to get type-specific icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Model': return '🧠';
      case 'Tool': return '🛠️';
      case 'Platform': return '☁️';
      default: return '';
    }
  };
  
  // Helper to get border color based on type
  const getBorderColor = (type: string) => {
    return typeDefinitions[type as keyof typeof typeDefinitions]?.color || '#555';
  };

  const cardStyle = {
    background: '#1f2227',
    borderRadius: '12px',
    padding: '24px',
    border: `1px solid ${getBorderColor(item.type)}`,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    height: '100%', // Ensure card takes full height of grid row
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    position: 'relative' as const, // Needed for absolute positioning of type icon
    overflow: 'hidden', // Ensure content doesn't overflow
  };

  const cardHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '14px',
    gap: '10px',
  };

  const cardTitleStyle = {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#eee',
    marginBottom: '0',
    lineHeight: 1.3,
  };

  const typeIconStyle = {
    fontSize: '1.5rem',
    marginTop: '-4px', // Align better with title
  };

  const descriptionStyle = {
    fontSize: '0.95rem',
    color: '#bbb',
    lineHeight: 1.6,
    flexGrow: 1, // Allow description to take up available space
    marginBottom: '18px',
  };

  const tagsContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
    marginTop: 'auto', // Push tags to the bottom if space allows
    paddingTop: '10px', // Add padding above tags
  };

  return (
    <motion.div 
      style={cardStyle} 
      onClick={() => onViewDetails(item)} // Trigger modal on card click
      whileHover={{ 
        scale: 1.03, 
        boxShadow: `0 6px 20px rgba(0, 0, 0, 0.15), 0 0 15px ${getBorderColor(item.type)}30`,
        borderColor: getBorderColor(item.type) // Enhance border on hover
      }}
      transition={{ duration: 0.2 }}
    >
      <div> {/* Top section for content */} 
        <div style={cardHeaderStyle}>
          <h3 style={cardTitleStyle}>{item.name}</h3>
          <span style={typeIconStyle} title={item.type}>{getTypeIcon(item.type)}</span>
        </div>
        <p style={descriptionStyle}>{item.description}</p>
      </div>
      <div style={tagsContainerStyle}> {/* Bottom section for tags */} 
        {item.tags.map(tag => (
          <button 
            key={tag} 
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click when clicking tag
              onTagClick(tag);
            }}
            style={tagButtonStyle(selectedTags.includes(tag))} // Use shared tag style
            aria-label={`Filter by tag ${tag}`}
          >
            #{tag}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

// Props for ItemDetailView
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
  selectedTags: string[];
}

// Component to display item details in modal
const ItemDetailView: React.FC<ItemDetailViewProps> = ({ item, onTagClick, selectedTags }) => {
  const detailContentStyle = {
    color: '#ccc',
  };
  
  const detailTitleStyle = {
    fontSize: '1.8rem',
    fontWeight: '600',
    color: '#eee',
    marginBottom: '15px',
    borderBottom: `2px solid ${typeDefinitions[item.type]?.color || '#555'}`,
    paddingBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const typeLabelStyle = {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: typeDefinitions[item.type]?.color || '#ccc',
    background: `${typeDefinitions[item.type]?.color || '#555'}20`,
    padding: '4px 10px',
    borderRadius: '6px',
  };

  const detailDescriptionStyle = {
    fontSize: '1rem',
    lineHeight: 1.7,
    marginBottom: '25px',
  };

  const detailLinkStyle = {
    display: 'inline-block',
    marginTop: '10px',
    padding: '10px 20px',
    borderRadius: '8px',
    background: '#3b82f6', // Use a consistent action color
    color: '#ffffff',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'background 0.2s ease',
  };
  
  const detailTagsContainerStyle = {
    marginTop: '25px',
    borderTop: '1px solid #34363f',
    paddingTop: '20px',
  };
  
  const detailTagsTitleStyle = {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#aaa',
    marginBottom: '12px',
  };

  return (
    <div style={detailContentStyle}>
      <h2 style={detailTitleStyle}>
        {item.name}
        <span style={typeLabelStyle}>{item.type}</span>
      </h2>
      <p style={detailDescriptionStyle}>{item.description}</p>
      <a 
        href={item.link} 
        target="_blank" 
        rel="noopener noreferrer" 
        style={detailLinkStyle}
        onMouseOver={(e) => (e.currentTarget.style.background = '#2563eb')}
        onMouseOut={(e) => (e.currentTarget.style.background = '#3b82f6')}
      >
        Visit Link
      </a>
      <div style={detailTagsContainerStyle}>
        <h4 style={detailTagsTitleStyle}>Tags:</h4>
        <div style={buttonContainerStyle}> {/* Reuse button container */} 
          {item.tags.map(tag => (
            <button 
              key={tag} 
              onClick={() => onTagClick(tag)} 
              style={tagButtonStyle(selectedTags.includes(tag))}
              aria-label={`Filter by tag ${tag}`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 