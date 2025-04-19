import React from 'react';
import { motion } from 'framer-motion';
import { NewsItem } from '../data/newsData';
import { 
  overlayStyle, 
  expandedCardStyle, 
  expandedTitleStyle, 
  expandedSummaryStyle, 
  aiFeatureSectionStyle,
  aiFeatureTitleStyle,
  metadataStyle
} from '../styles/styles';

// Extended interface for API articles which have additional fields
export interface ApiNewsItem extends NewsItem {
  publicationDate?: string;
  sourceName?: string;
  readTime?: number;
  // Include other potential API-specific fields
  url?: string;
  imageUrl?: string;
  entities?: string[];
  aiSummary?: string;
  sentimentScore?: number;
  sentimentLabel?: string;
  keywords?: string[];
  bulletSummary?: string[];
}

interface ExpandedNewsCardProps {
  article: NewsItem | ApiNewsItem;
  id: string;
  onClose: () => void;
  relatedArticles?: Array<NewsItem | ApiNewsItem>;
  onEntityClick?: (entity: string) => void;
  detailedContent?: {
    aiSummary: string | null;
    bulletSummary: string[] | null;
    keywords: string[] | [];
  };
  isDetailLoading?: boolean;
}

// Entity tag styling
const entityTagStyle = {
  display: 'inline-block',
  padding: '3px 8px',
  borderRadius: '4px',
  fontSize: '0.75rem',
  margin: '0 4px 4px 0',
  background: 'rgba(42, 157, 143, 0.15)',
  color: '#2a9d8f',
};

// Clickable entity tag styling
const clickableEntityTagStyle = {
  ...entityTagStyle,
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
};

// Format date to be more readable
const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Date N/A';
  
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Date N/A';
    }
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  } catch (e) {
    console.error('Date parsing error:', e);
    return 'Date N/A';
  }
};

// Calculate estimated read time
const calculateReadTime = (wordCount?: number): number => {
  if (!wordCount) return 2; // Default if no word count is provided
  const wordsPerMinute = 200;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, readTime); // Minimum 1 minute read
};

const ExpandedNewsCard: React.FC<ExpandedNewsCardProps> = ({ 
  article, 
  id, 
  onClose,
  relatedArticles = [],
  onEntityClick,
  detailedContent,
  isDetailLoading
}) => {
  // Cast to ApiNewsItem to access potential API fields
  const apiArticle = article as ApiNewsItem;
  
  // Use publicationDate if available, fall back to date
  const formattedDate = formatDate(apiArticle.publicationDate || article.date);
  
  // Calculate read time using API readTime or wordCount
  const readTime = apiArticle.readTime || calculateReadTime(article.wordCount);

  return (
    <motion.div 
      style={overlayStyle} 
      onClick={onClose} 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
    >
      <motion.div 
        layoutId={`card-container-${id}`} 
        style={expandedCardStyle} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Source and date header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '10px', 
          color: '#888',
          fontSize: '0.85rem'
        }}>
          <div style={{ fontWeight: 600 }}>{apiArticle.sourceName || article.source || 'Unknown Source'}</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{formattedDate}</span>
            <span style={{ margin: '0 8px' }}>•</span>
            <span>{readTime} min read</span>
          </div>
        </div>

        <h2 style={expandedTitleStyle}>{article.title}</h2>
        
        {/* Main Content Area with Loading State */}
        <div style={{ minHeight: '100px', position: 'relative' }}>
          {isDetailLoading && detailedContent?.aiSummary?.includes("Analyzing") ? (
            // Show thinking indicator with animation
            <div style={{ position: 'relative' }}>
              <p style={{ ...expandedSummaryStyle, color: '#2a9d8f' }}>
                {detailedContent.aiSummary}
                <span
                  style={{
                    display: 'inline-block',
                    width: '10px',
                    marginLeft: '3px',
                    animation: 'blink 1s infinite',
                    color: '#2a9d8f',
                    fontWeight: 'bold'
                  }}
                >
                  |
                </span>
              </p>
              <style jsx>{`
                @keyframes blink {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0; }
                }
              `}</style>
            </div>
          ) : isDetailLoading ? (
            // Regular loading state
            <div style={{ textAlign: 'center', paddingTop: '30px', color: '#888' }}>
              <p style={{ fontStyle: 'italic', marginBottom: '10px' }}>Loading detailed summary...</p>
              <div style={{ 
                display: 'inline-block',
                width: '20px',
                height: '20px',
                border: '2px solid rgba(42, 157, 143, 0.3)',
                borderTop: '2px solid #2a9d8f',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <style jsx>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : (
            // Content fully loaded or no detailed content yet
            <div style={{ position: 'relative' }}>
              <p style={expandedSummaryStyle}>
                {detailedContent?.aiSummary && detailedContent.aiSummary.trim() !== '' ? 
                  detailedContent.aiSummary : 
                  (apiArticle.aiSummary || article.summary || "Summary not available.")}
              </p>
            </div>
          )}
        </div>

        {/* AI Feature Placeholders */}
        <div style={aiFeatureSectionStyle}>
          <h4 style={aiFeatureTitleStyle}>AI Insights</h4>
          
          {/* Display Entities if available */}
          {apiArticle.entities && apiArticle.entities.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <strong>Key Entities / Topics:</strong>{' '}
              {apiArticle.entities.map(entity => (
                <span
                  key={entity}
                  style={clickableEntityTagStyle}
                  onClick={() => onEntityClick?.(entity)}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(42, 157, 143, 0.3)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(42, 157, 143, 0.15)'}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') onEntityClick?.(entity); }}
                >
                  {entity}
                </span>
              ))}
            </div>
          )}
          
          {/* Display Keywords with distinct styling */}
          {apiArticle.keywords && apiArticle.keywords.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <strong>Keywords:</strong>{' '}
              {apiArticle.keywords.map(keyword => (
                <span 
                  key={keyword} 
                  style={{ ...entityTagStyle, backgroundColor: 'rgba(74, 78, 105, 0.2)', color: '#a5a9c4' }}
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}
          
          {/* Display Sentiment with visualization bar */}
          {apiArticle.sentimentScore !== undefined && apiArticle.sentimentLabel && (
            <div style={{ marginTop: '10px' }}>
              <strong>Sentiment:</strong>{' '}
              <span style={{ 
                color: apiArticle.sentimentScore > 0.6 ? '#57cc99' : (apiArticle.sentimentScore < 0.4 ? '#f46a6a' : '#ccc') 
              }}>
                {/* Display the label returned by the AI */}
                {apiArticle.sentimentLabel} ({apiArticle.sentimentScore.toFixed(2)})
              </span>
              
              {/* --- Sentiment Bar --- */}
              <div style={{
                height: '8px',
                width: '100px', // Fixed width for the bar background
                backgroundColor: '#444', // Background of the bar container
                borderRadius: '4px',
                overflow: 'hidden', // Hide overflow
                display: 'inline-block', // Align with text
                marginLeft: '10px',
                verticalAlign: 'middle',
              }}>
                <div style={{
                  height: '100%',
                  // Width based on sentiment (0 to 1 scale)
                  width: `${Math.max(0, Math.min(100, apiArticle.sentimentScore * 100))}%`,
                  // Color based on sentiment
                  backgroundColor: apiArticle.sentimentScore > 0.6 ? '#57cc99' : (apiArticle.sentimentScore < 0.4 ? '#f46a6a' : '#fca311'),
                  borderRadius: '4px',
                  transition: 'width 0.5s ease-out',
                }}></div>
              </div>
              {/* --- End Sentiment Bar --- */}
            </div>
          )}
          
          {/* Fallback to old sentiment display if new fields aren't available */}
          {article.sentiment !== undefined && !apiArticle.sentimentScore && (
            <div style={{ marginTop: '10px' }}>
              <strong>Sentiment Score:</strong>{' '}
              <span style={{ 
                color: article.sentiment > 0.5 ? '#57cc99' : (article.sentiment < 0.5 ? '#f46a6a' : '#ccc') 
              }}>
                {article.sentiment.toFixed(2)}
                {article.sentiment > 0.7 ? ' (Positive)' : (article.sentiment < 0.3 ? ' (Negative)' : ' (Neutral)')}
              </span>
              
              {/* --- Legacy Sentiment Bar --- */}
              <div style={{
                height: '8px',
                width: '100px',
                backgroundColor: '#444',
                borderRadius: '4px',
                overflow: 'hidden',
                display: 'inline-block',
                marginLeft: '10px',
                verticalAlign: 'middle',
              }}>
                <div style={{
                  height: '100%',
                  width: `${Math.max(0, Math.min(100, article.sentiment * 100))}%`,
                  backgroundColor: article.sentiment > 0.6 ? '#57cc99' : (article.sentiment < 0.4 ? '#f46a6a' : '#fca311'),
                  borderRadius: '4px',
                  transition: 'width 0.5s ease-out',
                }}></div>
              </div>
            </div>
          )}

          {/* Display Bullet Summary */}
          {!isDetailLoading && detailedContent?.bulletSummary && detailedContent.bulletSummary.length > 0 && (
            <div style={{ marginTop: '15px' }}>
              <strong>Highlights:</strong>
              <ul style={{ paddingLeft: '20px', margin: '5px 0 0 0', color: '#ccc' }}>
                {detailedContent.bulletSummary.map((point, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>{point}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Show loading indicator for bullets if detailed content is loading */}
          {isDetailLoading && (
            <div style={{ marginTop: '15px', color: '#888', fontSize: '0.9em' }}>
              <strong>Highlights:</strong> Loading...
            </div>
          )}
        </div>

        <div style={{ ...metadataStyle, marginTop: '20px', borderTop: '1px solid #444', paddingTop: '15px' }}>
          <span>Category: {article.category}</span> | <span>Energy: {article.energy.toFixed(2)}</span>
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div style={{ marginTop: '25px', borderTop: '1px solid #333', paddingTop: '15px' }}>
            <h4 style={{ fontSize: '1rem', color: '#2a9d8f', marginBottom: '12px' }}>Related Articles</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {relatedArticles.map((related) => (
                <div 
                  key={related.id} 
                  style={{ 
                    padding: '10px',
                    backgroundColor: 'rgba(42, 43, 47, 0.4)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    borderLeft: '3px solid #2a9d8f',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Temporary close the current article
                    onClose();
                    // Select the related article (needs to be implemented in parent)
                    setTimeout(() => {
                      // This is a hacky way to allow the current modal to close before opening the new one
                      // Ideally, you'd implement a proper handler in the parent component
                      document.getElementById(`card-${related.id}`)?.click();
                    }, 100);
                  }}
                >
                  <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '4px' }}>
                    {(related as ApiNewsItem).sourceName || related.source} • {
                      formatDate((related as ApiNewsItem).publicationDate || related.date).split(',')[0] /* Just show day */
                    }
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{related.title}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ExpandedNewsCard; 