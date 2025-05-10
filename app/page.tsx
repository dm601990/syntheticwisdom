'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import NewsCard from '../components/NewsCard';
import Header from '../components/Header';
import ExpandedNewsCard from '../components/ExpandedNewsCard';
import NewsletterSignup from '../components/NewsletterSignup';
import SkeletonCard from '../components/SkeletonCard';
import TopicFilter from '../components/TopicFilter';
import { pageStyle, gridStyle, dividerStyle } from '../styles/styles';
import { type ApiNewsItem } from '../components/ExpandedNewsCard';

// Global style to prevent stray elements
const globalStyle = `
  * {
    box-sizing: border-box;
  }
  body, html {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }
`;

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
  marginBottom: '30px',
  width: '100%',
  padding: '0 20px',
};

// Load more button styling
const loadMoreButtonStyle = {
  padding: '10px 24px',
  backgroundColor: '#1a1d21',
  color: '#ccc',
  border: '1px solid #444',
  borderRadius: '8px',
  margin: '30px auto 10px',
  cursor: 'pointer',
  display: 'block',
  fontSize: '0.9rem',
  transition: 'all 0.2s ease',
};

// Error styling
const errorContainerStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  justifyContent: 'center',
  padding: '50px 20px',
  textAlign: 'center' as const,
  minHeight: '40vh',
  color: '#f46a6a',
};

const errorTextStyle = {
  marginBottom: '20px',
  fontSize: '1.1rem',
};

const retryButtonStyle = {
  padding: '10px 20px',
  borderRadius: '6px',
  border: '1px solid #f46a6a',
  background: 'transparent',
  color: '#f46a6a',
  cursor: 'pointer',
  fontSize: '1rem',
  transition: 'all 0.2s ease',
};

// --- Style for the Ko-fi Button ---
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

// --- Style for Footer layout ---
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

// Initial number of articles to show
const INITIAL_VISIBLE_COUNT = 8;
// Number of articles to add when loading more
const LOAD_MORE_INCREMENT = 6;

// Grid styling with more specific alignment
const gridContainerStyle = {
  ...gridStyle,
  display: 'grid' as const,
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', // More consistent sizing
  alignItems: 'stretch', // Make sure items stretch to fill height
  gridAutoRows: '1fr', // Force equal row heights
  gap: '24px', // Slightly increase spacing
};

// Define the categories for the filter, aligning with TopicFilter.tsx
const filterCategories = [
  { id: 'all', name: 'All AI' },
  { id: 'tech-research', name: 'Technology & Research' },
  { id: 'impact-industry', name: 'Impact & Industry' },
  { id: 'apps-tools', name: 'Applications & Tools' }
];

// No longer using displayCategories for initializing activeCategory directly with name
// const displayCategories = rawCategories.filter(cat => cat && !['All', 'AI News', 'Simulated Silliness'].includes(cat));

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string>(filterCategories[0].id); // Use id from filterCategories
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<ApiNewsItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [error, setError] = useState<string | null>(null);
  const [detailedContent, setDetailedContent] = useState<{
    aiSummary: string | null, 
    bulletSummary: string[] | null,
    keywords: string[] | []
  }>({ 
    aiSummary: '',
    bulletSummary: null,
    keywords: []
  });
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  
  // Add ref for EventSource
  const eventSourceRef = React.useRef<EventSource | null>(null);
  
  // Add cache for summaries
  const summaryCache = React.useRef<{[key: string]: {
    aiSummary: string,
    bulletSummary: string[] | null,
    keywords: string[] | []
  }}>({});
  
  // Load cache from localStorage on initial load
  useEffect(() => {
    try {
      const savedCache = localStorage.getItem('syntheticWisdomSummaryCache');
      if (savedCache) {
        summaryCache.current = JSON.parse(savedCache);
        console.log("Frontend: Loaded summary cache from localStorage", Object.keys(summaryCache.current).length, "items");
      }
    } catch (e) {
      console.error("Frontend: Error loading cache from localStorage", e);
    }
  }, []);
  
  // Save cache to localStorage when it changes
  const saveCache = useCallback(() => {
    try {
      localStorage.setItem('syntheticWisdomSummaryCache', JSON.stringify(summaryCache.current));
    } catch (e) {
      console.error("Frontend: Error saving cache to localStorage", e);
    }
  }, []);
  
  // Define fetchNews using useCallback for stable function identity
  const fetchNews = useCallback(async () => {
    console.log("Frontend: Fetching news from /api/news...");
    setLoading(true);
    setError(null); // Clear previous errors on new fetch attempt
    setVisibleCount(INITIAL_VISIBLE_COUNT); // Reset pagination

    try {
      const response = await fetch('/api/news');
      if (!response.ok) {
        // Try to get error message from backend response body
        let errorMsg = `API fetch failed: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorData.details || errorMsg;
        } catch { /* Ignore parsing error if response wasn't JSON */ }
        throw new Error(errorMsg);
      }
      const data = await response.json();
      console.log("Frontend: Received articles:", data.articles?.length || 0);
      setArticles(data.articles || []);
    } catch (e: unknown) {
      console.error("Frontend: Failed to fetch news:", e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred fetching news.';
      setError(errorMessage); // Set error state
      setArticles([]); // Clear articles on error
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means function identity is stable

  // Fetch articles from the API
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Find the selected article
  const selectedArticle = articles.find(article => article.id === selectedId);

  // Calculate related articles based on shared entities
  const relatedArticles = useMemo(() => {
    if (!selectedArticle || !selectedArticle.entities || selectedArticle.entities.length === 0 || !articles || articles.length === 0) {
      return [];
    }
    const selectedEntities = selectedArticle.entities;
    const articlesWithSharedEntities = articles.filter(article =>
       article.id !== selectedArticle.id &&
       article.entities && article.entities.length > 0 &&
       selectedEntities.some((entity: string) => article.entities?.includes(entity))
    );
    
    // Sort by date, using string comparison if date is not convertible to Date
    articlesWithSharedEntities.sort((a, b) => {
      const dateA = a.publicationDate || a.date;
      const dateB = b.publicationDate || b.date;
      
      if (!dateA || !dateB) return 0;
      
      try {
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      } catch {
        // Fallback to string comparison if date conversion fails
        return dateB.localeCompare(dateA);
      }
    });
    
    return articlesWithSharedEntities.slice(0, 3);
  }, [selectedArticle, articles]);

  // Reset visible count when category or search changes
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [activeCategory, searchTerm]);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setVisibleCount(INITIAL_VISIBLE_COUNT); // Reset pagination on search
  };

  // Handle load more button click
  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + LOAD_MORE_INCREMENT);
  };

  // Memoize filtered articles to prevent re-calculation on every render
  const filteredArticles = useMemo(() => {
    return articles
      .filter(article => {
        // Category filter
        const categoryMatch = activeCategory === 'all' || article.category === filterCategories.find(fc => fc.id === activeCategory)?.name;
        // Search term filter (case-insensitive)
        const searchMatch = searchTerm === '' || 
                            article.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            article.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            article.keywords?.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
        return categoryMatch && searchMatch;
      })
      .slice(0, visibleCount);
  }, [articles, activeCategory, searchTerm, visibleCount]);

  // Only show the number of articles determined by visibleCount
  const visibleArticles = filteredArticles;
  
  // Determine if we should show the Load More button
  const hasMoreArticles = filteredArticles.length > visibleCount;

  const handleExpand = (id: string) => {
    const article = articles.find(a => a.id === id);
    if (article) {
      setSelectedId(id);
      
      // Check if we have cached content for this article
      const cacheKey = article.url || article.id;
      if (summaryCache.current[cacheKey]) {
        console.log("Frontend: Using cached content for", article.title);
        setDetailedContent(summaryCache.current[cacheKey]);
        setIsDetailLoading(false);
        return;
      }
      
      // Reset details and set loading true when modal opens
      setDetailedContent({ aiSummary: '', bulletSummary: null, keywords: [] });
      setIsDetailLoading(true);
      // Fetch details for the selected article
      fetchDetailedContent(article);
    } else {
      console.error("Could not find article data for expansion:", id);
    }
  };

  const handleClose = () => setSelectedId(null);

  // Handle entity click for search
  const handleEntityClick = (entity: string) => {
    console.log("Entity clicked:", entity);
    setSearchTerm(entity); // Set the main search term
    setActiveCategory('all'); // Reset category filter to 'all'
    handleClose(); // Close the modal
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Function to fetch detailed content
  const fetchDetailedContent = useCallback((article: ApiNewsItem) => {
    // Function to close existing connection
    const closeEventSource = () => {
        if (eventSourceRef.current) {
            console.log("Frontend: Closing EventSource connection.");
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
    };

    // Close any previous connection
    closeEventSource();

    if (!article || !article.url || !article.title || !article.summary) {
        console.log("Skipping detail fetch: Missing article data.");
        setIsDetailLoading(false);
        setDetailedContent({ aiSummary: 'Missing data to fetch details.', bulletSummary: null, keywords: [] });
        return;
    }

    // Get cache key for this article
    const cacheKey = article.url || article.id;
    
    // Check cache again (defensive)
    if (summaryCache.current[cacheKey]) {
        console.log("Frontend: Using cached content for", article.title);
        setDetailedContent(summaryCache.current[cacheKey]);
        setIsDetailLoading(false);
        return;
    }

    console.log(`Frontend: Opening EventSource for ${article.title}`);
    // Reset state, ensuring aiSummary starts empty for accumulation
    setDetailedContent({ aiSummary: '', bulletSummary: null, keywords: article.keywords || [] });
    setIsDetailLoading(true);
    setError(null); // Clear page-level errors

    const articleUrl = encodeURIComponent(article.url);
    const articleTitle = encodeURIComponent(article.title);
    const articleSummary = encodeURIComponent(article.summary);
    const eventSourceUrl = `/api/getDetails?url=${articleUrl}&title=${articleTitle}&summary=${articleSummary}`;

    try {
        // Create and store new EventSource connection
        const newEventSource = new EventSource(eventSourceUrl);
        eventSourceRef.current = newEventSource;

        let completeSummary = ''; // To store the complete summary for caching

        newEventSource.onopen = () => {
            console.log("Frontend: EventSource connection opened.");
            setIsDetailLoading(true); // Ensure loading is true when open
        };

        newEventSource.onmessage = (event) => {
            try {
                // Log only on development
                if (process.env.NODE_ENV === 'development') {
                    console.log("Frontend: EventSource message received");
                }
                
                const data = JSON.parse(event.data);

                if (data.error) {
                    console.error('Stream Error Message:', data.error, data.details);
                    setError(`Summary generation failed: ${data.error}`); // Set error
                    closeEventSource(); // Close on error
                    setIsDetailLoading(false);
                    return;
                }
                
                // Handle loading signal and thinking phase
                if (data.phase === "THINKING") {
                    const textChunk = data.chunk.replace(/\\n/g, '\n');
                    
                    // Show thinking indicator and accumulate text
                    setDetailedContent(prev => ({
                        ...prev,
                        aiSummary: prev.aiSummary + textChunk
                    }));
                    
                    // Keep loading indicator on
                    setIsDetailLoading(true);
                    return;
                }
                
                // Handle clear content signal
                if (data.action === "CLEAR_ALL_CONTENT") {
                    console.log("Frontend: Clearing content buffer");
                    
                    // Reset all text to empty
                    setDetailedContent({ 
                        aiSummary: '', 
                        bulletSummary: null, 
                        keywords: article.keywords || [] 
                    });
                    
                    // Reset accumulators
                    completeSummary = '';
                    return;
                }

                // Append text chunk 
                if (data.chunk) {
                    const textChunk = data.chunk.replace(/\\n/g, '\n');
                    
                    // Only display and accumulate if in REAL_CONTENT phase
                    if (data.phase === "REAL_CONTENT") {
                        // Add to complete summary for caching
                        completeSummary += textChunk;
                        
                        // Update state with real content
                        setDetailedContent(prev => ({
                            ...prev,
                            aiSummary: prev.aiSummary + textChunk
                        }));
                        
                        // Turn off loading indicator while showing real content
                        setIsDetailLoading(false);
                    }
                }

                // Handle final message
                if (data.done) {
                    console.log("Frontend: Stream finished message received.");
                    
                    // Only cache real content
                    if (completeSummary.length > 0) {
                        // Cache the complete result
                        const cacheEntry = {
                            aiSummary: completeSummary, 
                            bulletSummary: null,
                            keywords: article.keywords || []
                        };
                        
                        // Add to cache
                        summaryCache.current[cacheKey] = cacheEntry;
                        saveCache(); // Save to localStorage
                        
                        console.log("Frontend: Cached summary for", article.title);
                    }
                    
                    // Close connection
                    closeEventSource();
                    setIsDetailLoading(false); // Stop loading indicator
                }

            } catch (e) {
                console.error("Frontend: Failed to parse message data:", e);
                // Don't necessarily error out the whole page, maybe just stop loading
                closeEventSource();
                setIsDetailLoading(false);
                
                // Set a fallback summary to prevent UI issues
                if (!detailedContent.aiSummary) {
                    setDetailedContent(prev => ({
                        ...prev,
                        aiSummary: "Unable to load summary. Please try again later."
                    }));
                }
            }
        };

        newEventSource.onerror = (err) => {
            console.error("EventSource failed:", err);
            if (eventSourceRef.current) { // Avoid error if manually closed
                setError("Connection error loading details.");
                closeEventSource();
                setIsDetailLoading(false);
                
                // Set a fallback summary to prevent UI issues
                setDetailedContent(prev => ({
                    ...prev,
                    aiSummary: prev.aiSummary || "Unable to load summary due to connection error."
                }));
            }
        };
    } catch (e) {
        console.error("Failed to create EventSource:", e);
        setError("Failed to establish connection for summary.");
        setIsDetailLoading(false);
        // Set a fallback summary to prevent UI issues
        setDetailedContent(prev => ({
            ...prev,
            aiSummary: prev.aiSummary || "Summary generation failed. Please try again later."
        }));
    }
}, [setError, setIsDetailLoading, setDetailedContent, saveCache, detailedContent.aiSummary]);

  return (
    <>
      <style>{globalStyle}</style>
      <div style={pageStyle}>
        {/* Header no longer takes category props */}
        <Header />
        
        {/* Controls Container */}
        <div style={controlsContainerStyle}>
          {/* Search input */}
          <input 
            type="text" 
            placeholder="Search articles by title, summary, or keyword..." 
            value={searchTerm} 
            onChange={handleSearchChange} 
            style={searchInputStyle}
          />
          <TopicFilter currentTopic={activeCategory} onTopicChange={setActiveCategory} />
        </div>
        
        {/* Enhanced Error Message with Retry Button */}
        {error && (
          <div style={errorContainerStyle}>
            <p style={errorTextStyle}>Oops! Something went wrong while loading news.</p>
            <p style={{ color: '#aaa', marginBottom: '20px', fontSize: '0.9rem' }}>Error: {error}</p>
            <button
              style={retryButtonStyle}
              onClick={fetchNews}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(244, 106, 106, 0.1)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Try Again
            </button>
          </div>
        )}
        
        {/* Article Grid - Only show if no error */}
        {!error && (
          <div style={gridContainerStyle}>
            <AnimatePresence mode="wait">
              {loading ? (
                // Skeleton loader when loading
                <React.Fragment>
                  {[...Array(6)].map((_, index) => (
                    <motion.div
                      key={`skeleton-${index}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <SkeletonCard />
                    </motion.div>
                  ))}
                </React.Fragment>
              ) : filteredArticles.length > 0 ? (
                // Actual content when loaded (only showing visible articles)
                visibleArticles.map((article) => (
                  <motion.div
                    key={article.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <NewsCard
                      id={article.id}
                      title={article.title}
                      summary={article.summary}
                      category={article.category}
                      onExpand={handleExpand}
                      date={article.publicationDate || article.date}
                      source={article.sourceName || article.source}
                      wordCount={article.wordCount}
                      url={article.url}
                    />
                  </motion.div>
                ))
              ) : (
                // No results message
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
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>No articles found</h3>
                  <p>Try adjusting your search or selecting a different category.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Load More Button - Only show if no error */}
        {!error && !loading && hasMoreArticles && (
          <motion.button
            style={loadMoreButtonStyle}
            onClick={handleLoadMore}
            whileHover={{ 
              backgroundColor: '#2a2d32',
              borderColor: '#2a9d8f',
              boxShadow: '0 4px 8px rgba(42, 157, 143, 0.1)'
            }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Load More Articles
          </motion.button>
        )}

        {/* Divider */}
        <div style={dividerStyle}></div>

        {/* Newsletter Signup Form - Only show if no error */}
        {!error && <NewsletterSignup categories={filterCategories.map(fc => fc.name)} />}

        {/* --- Footer Section --- */}
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
        {/* --- End Footer Section --- */}

        {/* Expanded Card Modal */}
        <AnimatePresence>
          {selectedId && selectedArticle && (
            <ExpandedNewsCard 
              article={selectedArticle} 
              id={selectedId}
              onClose={handleClose}
              relatedArticles={relatedArticles}
              onEntityClick={handleEntityClick}
              detailedContent={detailedContent}
              isDetailLoading={isDetailLoading}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
} 