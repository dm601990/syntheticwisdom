import React, { useState } from 'react';
import { motion } from 'framer-motion';

const formContainerStyle = {
  background: 'rgba(26, 29, 33, 0.7)',
  backdropFilter: 'blur(10px)',
  padding: '30px',
  borderRadius: '12px',
  maxWidth: '500px',
  margin: '0 auto',
  marginTop: '40px',
  border: '1px solid #2a9d8f',
  boxShadow: '0 8px 32px rgba(42, 157, 143, 0.1)',
};

const headingStyle = {
  color: 'white',
  fontSize: '1.5rem',
  marginBottom: '15px',
  textAlign: 'center' as const,
};

const subheadingStyle = {
  color: '#aaa',
  fontSize: '0.9rem',
  marginBottom: '25px',
  textAlign: 'center' as const,
};

const inputStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid #444',
  borderRadius: '8px',
  padding: '12px 15px',
  fontSize: '0.9rem',
  color: 'white',
  width: '100%',
  marginBottom: '15px',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box' as const,
};

const focusedInputStyle = {
  ...inputStyle,
  borderColor: '#2a9d8f',
};

const buttonStyle = {
  background: '#2a9d8f',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  padding: '12px 20px',
  fontSize: '0.9rem',
  cursor: 'pointer',
  width: '100%',
  transition: 'all 0.2s ease',
};

const errorStyle = {
  color: '#f46a6a',
  fontSize: '0.8rem',
  marginTop: '-10px',
  marginBottom: '15px',
};

const successStyle = {
  background: 'rgba(87, 204, 153, 0.1)',
  borderLeft: '3px solid #57cc99',
  padding: '15px',
  marginTop: '20px',
  color: '#ddd',
};

const categoriesListStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: '8px',
  marginBottom: '20px',
  justifyContent: 'center',
};

const categoryChipStyle = (isSelected: boolean) => ({
  padding: '6px 12px',
  borderRadius: '16px',
  border: `1px solid ${isSelected ? '#2a9d8f' : '#555'}`,
  background: isSelected ? 'rgba(42, 157, 143, 0.2)' : 'transparent',
  color: isSelected ? '#2a9d8f' : '#aaa',
  fontSize: '0.8rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
});

interface NewsletterSignupProps {
  categories: string[];
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ categories }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleCategoryToggle = (category: string) => {
    if (category === 'All') {
      // Toggle all categories
      if (selectedCategories.includes('All')) {
        setSelectedCategories([]);
      } else {
        setSelectedCategories(['All', ...categories.filter(c => c !== 'All')]);
      }
    } else {
      // Toggle individual category
      if (selectedCategories.includes(category)) {
        const newSelected = selectedCategories.filter(c => c !== category);
        // Remove 'All' if it was selected and we're removing a category
        setSelectedCategories(newSelected.filter(c => c !== 'All'));
      } else {
        const newSelected = [...selectedCategories, category];
        // Add 'All' if all other categories are selected
        if (newSelected.length === categories.length - 1 && !newSelected.includes('All')) {
          setSelectedCategories([...newSelected, 'All']);
        } else {
          setSelectedCategories(newSelected);
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    if (email && name) {
      // In a real app, this would send data to a backend
      console.log('Submitting:', { name, email, interests: selectedCategories });
      setSubmitted(true);
      setEmail('');
      setName('');
      setSelectedCategories([]);
      setEmailError('');
    }
  };

  if (submitted) {
    return (
      <motion.div 
        style={formContainerStyle}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={successStyle}>
          <h3 style={{ margin: '0 0 10px 0', color: '#57cc99' }}>Thanks for signing up!</h3>
          <p style={{ margin: 0 }}>You'll start receiving updates from Synthetic Wisdom soon.</p>
        </div>
        <button 
          style={{ ...buttonStyle, marginTop: '20px' }}
          onClick={() => setSubmitted(false)}
        >
          Sign up another email
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      style={formContainerStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 style={headingStyle}>Stay Updated with Synthetic Wisdom</h2>
      <p style={subheadingStyle}>
        Get the latest insights, trends, and breakthroughs delivered to your inbox
      </p>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={nameFocused ? focusedInputStyle : inputStyle}
          onFocus={() => setNameFocused(true)}
          onBlur={() => setNameFocused(false)}
          required
        />
        
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError('');
          }}
          style={emailFocused ? focusedInputStyle : inputStyle}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          required
        />
        {emailError && <div style={errorStyle}>{emailError}</div>}
        
        <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '10px', textAlign: 'center' }}>
          Select topics you're interested in:
        </p>
        <div style={categoriesListStyle}>
          {categories.filter(c => c !== 'All').map(category => (
            <span
              key={category}
              style={categoryChipStyle(selectedCategories.includes(category))}
              onClick={() => handleCategoryToggle(category)}
            >
              {category}
            </span>
          ))}
        </div>
        
        <motion.button
          type="submit"
          style={buttonStyle}
          whileHover={{ 
            backgroundColor: '#3ab4a6',
            y: -2,
            boxShadow: '0 4px 12px rgba(42, 157, 143, 0.3)'
          }}
          whileTap={{ scale: 0.98 }}
        >
          Subscribe to Newsletter
        </motion.button>
      </form>
    </motion.div>
  );
};

export default NewsletterSignup; 