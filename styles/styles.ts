// Basic Page Styling
export const pageStyle = {
  padding: '40px',
  background: '#0f1115', // Dark page background
  minHeight: '100vh',
};

// Header Styling
export const headerStyle = {
  color: 'white',
  marginBottom: '0',
  textAlign: 'center' as const,
  fontSize: '2.2rem',
  position: 'relative' as const,
  zIndex: 10, // Ensure text appears above the logo
  textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)', // Add shadow for better visibility
};

// Logo container styling
export const logoContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute' as const,
  top: '50%', // Center vertically 
  left: '50%', // Center horizontally
  transform: 'translate(-50%, -50%)', // Center perfectly
  width: '100%',
  height: '100%',
  zIndex: 5, // Lower z-index to place behind the title
};

// Header container for positioning
export const headerContainerStyle = {
  position: 'relative' as const,
  marginBottom: '30px', // Reduced space below
  paddingTop: '30px', // Space above
  height: '160px', // Slightly shorter
  display: 'flex',
  flexDirection: 'column' as const,
  justifyContent: 'center',
  alignItems: 'center', // Center horizontally
  width: '100%',
};

// Grid Styling
export const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', // Responsive grid
  gap: '20px',
  marginBottom: '60px', // Add space before newsletter
};

// Section divider
export const dividerStyle = {
  width: '100%',
  height: '1px',
  background: 'linear-gradient(to right, rgba(42, 157, 143, 0), rgba(42, 157, 143, 0.5), rgba(42, 157, 143, 0))',
  margin: '40px 0',
};

// Filter buttons container
export const filterContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
  marginBottom: '30px',
};

// Filter button style
export const filterButtonStyle = (isActive: boolean) => ({
  padding: '8px 16px',
  borderRadius: '16px',
  border: `1px solid ${isActive ? '#2a9d8f' : '#555'}`,
  background: isActive ? '#2a9d8f' : 'transparent',
  color: isActive ? '#fff' : '#aaa',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
});

// Overlay style for expanded card
export const overlayStyle = {
  position: 'fixed' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

// Expanded card style
export const expandedCardStyle = {
  background: '#1a1d21',
  borderRadius: '12px',
  padding: '24px',
  maxWidth: '700px',
  width: '90%',
  maxHeight: '80vh',
  overflow: 'auto',
  position: 'relative' as const,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
};

// Expanded title style
export const expandedTitleStyle = {
  fontSize: '1.6rem',
  fontWeight: '600',
  marginBottom: '16px',
  color: '#ffffff',
};

// Expanded summary style
export const expandedSummaryStyle = {
  fontSize: '1rem',
  lineHeight: '1.6',
  color: '#d0d0d0',
  marginBottom: '20px',
};

// Metadata style
export const metadataStyle = {
  fontSize: '0.8rem',
  color: '#777',
};

// AI Feature styles
export const aiFeatureSectionStyle = {
  marginTop: '25px',
  paddingTop: '15px',
  borderTop: '1px solid #444',
};

export const aiFeatureTitleStyle = {
  fontSize: '0.9rem',
  color: '#888',
  marginBottom: '8px',
  textTransform: 'uppercase' as const,
};

export const keywordStyle = {
  display: 'inline-block',
  background: '#333',
  color: '#ccc',
  padding: '3px 8px',
  borderRadius: '4px',
  margin: '0 5px 5px 0',
  fontSize: '0.8rem',
};

// Standardized Card Styling
export const standardCardStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  height: '100%',
  background: '#1a1d21', // Dark card background
  border: '1px solid #333',
  borderRadius: '8px',
  color: '#e0e0e0',
  cursor: 'pointer',
  overflow: 'hidden',
  position: 'relative' as const,
  transition: 'all 0.2s ease',
};

export const standardCardContentStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  flexGrow: 1,
  padding: '16px',
};

export const standardCardTitleStyle = {
  fontSize: '1.1rem',
  fontWeight: '600',
  marginBottom: '8px',
  color: '#ffffff',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2, // Limit to 2 lines
  WebkitBoxOrient: 'vertical',
  lineHeight: '1.3',
  maxHeight: '2.6rem', // 2 lines * 1.3 line-height
};

export const standardCardDescriptionStyle = {
  fontSize: '0.9rem',
  lineHeight: '1.5',
  color: '#b0b0b0',
  marginBottom: '12px',
  flex: '1 0 auto',
};

export const standardCardFooterStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 'auto',
  paddingTop: '12px',
  fontSize: '0.8rem',
  borderTop: '1px solid rgba(255, 255, 255, 0.05)', // Add subtle separator
  width: '100%', // Ensure full width
};

export const standardCardTagsStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: '6px',
  height: '24px', // Fixed height for consistency
  overflow: 'hidden', // Hide overflow
};

export const standardCardTagStyle = {
  padding: '3px 8px',
  borderRadius: '4px',
  fontSize: '0.75rem',
  backgroundColor: 'rgba(42, 157, 143, 0.15)',
  color: '#2a9d8f',
}; 