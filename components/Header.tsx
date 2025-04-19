import React from 'react';
import { headerContainerStyle, headerStyle, logoContainerStyle } from '../styles/styles';
import Logo from './Logo';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Define props interface
interface HeaderProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: React.Dispatch<React.SetStateAction<string>>;
}

// Navigation styles
const navStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
  marginTop: '20px',
  padding: '0 20px',
  width: '100%',
  maxWidth: '500px',
  margin: '0 auto',
};

const navLinkStyle = {
  color: '#aaa',
  textDecoration: 'none',
  fontWeight: 500,
  fontSize: '1rem',
  padding: '10px 20px',
  borderRadius: '8px',
  transition: 'all 0.2s ease',
  textAlign: 'center' as const,
  flex: '1',
};

const activeLinkStyle = {
  ...navLinkStyle,
  color: '#f97316',
  background: 'rgba(42, 32, 22, 0.85)',
  fontWeight: 600,
  boxShadow: 'inset 0 -3px 0 #f97316',
};

// Category button container style
const categoryNavStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  justifyContent: 'center',
  gap: '8px',
  marginTop: '20px',
  marginBottom: '20px',
  padding: '0 15px',
};

// Category button style
const categoryButtonStyle = {
  padding: '6px 14px',
  borderRadius: '16px',
  border: '1px solid #444',
  background: '#2a2d31',
  color: '#ccc',
  cursor: 'pointer',
  fontSize: '0.85rem',
  transition: 'all 0.2s ease',
};

// Active category button style
const activeCategoryButtonStyle = {
  ...categoryButtonStyle,
  background: '#f97316', // Use accent color for active
  color: '#111',
  border: '1px solid #f97316',
  fontWeight: 'bold',
};

const Header: React.FC<HeaderProps> = ({ categories, activeCategory, setActiveCategory }) => {
  const pathname = usePathname() || '';
  
  // Determine active link
  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path === '/toolkit' && pathname.startsWith('/toolkit')) return true;
    if (path === '/silliness' && pathname.startsWith('/silliness')) return true;
    return false;
  };

  return (
    <>
      <div style={headerContainerStyle}>
        {/* Logo Image */}
        <div style={logoContainerStyle}>
          <Logo />
        </div>
        
        {/* Title */}
        <h1 style={headerStyle}>Synthetic Wisdom</h1>
      </div>
      
      {/* Navigation */}
      <nav style={navStyle}>
        <Link 
          href="/" 
          style={isActive('/') ? activeLinkStyle : navLinkStyle}
          onMouseOver={(e) => {
            if (!isActive('/')) e.currentTarget.style.color = '#f97316';
          }}
          onMouseOut={(e) => {
            if (!isActive('/')) e.currentTarget.style.color = '#aaa';
          }}
        >
          AI News
        </Link>
        <Link 
          href="/toolkit" 
          style={isActive('/toolkit') ? activeLinkStyle : navLinkStyle}
          onMouseOver={(e) => {
            if (!isActive('/toolkit')) e.currentTarget.style.color = '#f97316';
          }}
          onMouseOut={(e) => {
            if (!isActive('/toolkit')) e.currentTarget.style.color = '#aaa';
          }}
        >
          AI Toolkit
        </Link>
        <Link 
          href="/silliness" 
          style={isActive('/silliness') ? activeLinkStyle : navLinkStyle}
          onMouseOver={(e) => {
            if (!isActive('/silliness')) e.currentTarget.style.color = '#f97316';
          }}
          onMouseOut={(e) => {
            if (!isActive('/silliness')) e.currentTarget.style.color = '#aaa';
          }}
        >
          Simulated Silliness
        </Link>
      </nav>
      
      {/* Category Navigation (Only shown on AI News page) */}
      {pathname === '/' && (
        <nav style={categoryNavStyle}>
          {categories.map((category) => (
            <button
              key={category}
              style={category === activeCategory ? activeCategoryButtonStyle : categoryButtonStyle}
              onClick={() => setActiveCategory(category)}
              onMouseOver={(e) => {
                if (category !== activeCategory) e.currentTarget.style.backgroundColor = '#3a3d41';
              }}
              onMouseOut={(e) => {
                if (category !== activeCategory) e.currentTarget.style.backgroundColor = '#2a2d31';
              }}
            >
              {category}
            </button>
          ))}
        </nav>
      )}
    </>
  );
};

export default Header; 