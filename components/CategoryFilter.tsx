import React from 'react';
import { filterContainerStyle, filterButtonStyle } from '../styles/styles';
import Link from 'next/link';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}) => {
  return (
    <div style={filterContainerStyle}>
      {categories.map(category => {
        // For AI Toolkit, use Link when not active
        if (category === 'AI Toolkit' && activeCategory !== 'AI Toolkit') {
          return (
            <Link href="/toolkit" key={category} style={{ textDecoration: 'none' }}>
              <button
                style={filterButtonStyle(false)}
              >
                {category}
              </button>
            </Link>
          );
        }
        
        return (
          <button
            key={category}
            style={filterButtonStyle(activeCategory === category)}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter; 