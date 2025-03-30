import React from 'react';

interface AnalysisData {
  synthesizedSummary: string;
  trends: string[];
  contradictions: string[];
  keyEntities: string[];
  overallSentiment: string;
  confidenceScore: number;
}

interface TopicAnalysisProps {
  analysis: {
    analysis: AnalysisData;
    meta: {
      articleCount: number;
      topic: string;
      generatedAt: string;
      sources: string[];
    };
  } | null;
  isLoading: boolean;
  error: string | null;
}

const TopicAnalysis: React.FC<TopicAnalysisProps> = ({ analysis, isLoading, error }) => {
  if (isLoading) {
    return (
      <div style={containerStyle}>
        <h2 style={headerStyle}>Generating Cross-Article Analysis...</h2>
        <div style={loadingStyle}>
          <div style={loaderStyle}></div>
          <p style={{ marginTop: '15px', color: '#aaa' }}>
            This may take a moment as we analyze multiple articles...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <h2 style={headerStyle}>Analysis Error</h2>
        <p style={{ color: '#f46a6a' }}>{error}</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div style={containerStyle}>
        <h2 style={headerStyle}>Topic Analysis</h2>
        <p style={{ color: '#aaa' }}>
          Select multiple articles on the same topic to generate a combined analysis.
        </p>
      </div>
    );
  }

  const { synthesizedSummary, trends, contradictions, keyEntities, overallSentiment, confidenceScore } = analysis.analysis;
  
  // Get sentiment color
  const sentimentColor = 
    overallSentiment.toLowerCase().includes('positive') ? '#57cc99' :
    overallSentiment.toLowerCase().includes('negative') ? '#f46a6a' : '#fca311';

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>
        {analysis.meta.topic.charAt(0).toUpperCase() + analysis.meta.topic.slice(1)} Topic Analysis
        <span style={metaStyle}>
          Based on {analysis.meta.articleCount} articles from {analysis.meta.sources.length} sources
        </span>
      </h2>
      
      <div style={sectionStyle}>
        <h3 style={subheaderStyle}>Summary</h3>
        <p style={contentStyle}>{synthesizedSummary}</p>
      </div>
      
      <div style={{ ...sectionStyle, display: 'flex', flexDirection: 'row', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3 style={subheaderStyle}>Key Trends</h3>
          <ul style={listStyle}>
            {trends.map((trend, index) => (
              <li key={index} style={listItemStyle}>{trend}</li>
            ))}
          </ul>
        </div>
        
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3 style={subheaderStyle}>Contradictions & Disagreements</h3>
          {contradictions.length > 0 ? (
            <ul style={listStyle}>
              {contradictions.map((contradiction, index) => (
                <li key={index} style={listItemStyle}>{contradiction}</li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#aaa' }}>No significant contradictions found between sources.</p>
          )}
        </div>
      </div>
      
      <div style={sectionStyle}>
        <h3 style={subheaderStyle}>Key Entities & Organizations</h3>
        <div style={tagContainerStyle}>
          {keyEntities.map((entity, index) => (
            <span key={index} style={entityTagStyle}>{entity}</span>
          ))}
        </div>
      </div>
      
      <div style={sectionStyle}>
        <h3 style={subheaderStyle}>Overall Sentiment</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ ...entityTagStyle, backgroundColor: `${sentimentColor}33`, color: sentimentColor }}>
            {overallSentiment}
          </span>
          <div style={{
            height: '8px',
            width: '100px',
            backgroundColor: '#444',
            borderRadius: '4px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${confidenceScore * 100}%`,
              backgroundColor: sentimentColor,
              borderRadius: '4px',
              transition: 'width 0.5s ease-out',
            }}></div>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#aaa' }}>
            Confidence: {(confidenceScore * 100).toFixed(0)}%
          </span>
        </div>
      </div>
      
      <div style={footerStyle}>
        <span>Generated {new Date(analysis.meta.generatedAt).toLocaleString()}</span>
      </div>
    </div>
  );
};

// Styles
const containerStyle: React.CSSProperties = {
  backgroundColor: '#252830',
  borderRadius: '12px',
  padding: '20px',
  color: '#e0e0e0',
  marginTop: '30px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
};

const headerStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  color: '#2a9d8f',
  marginBottom: '5px',
  position: 'relative',
};

const metaStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: '#aaa',
  fontWeight: 'normal',
  display: 'block',
  marginTop: '5px',
};

const subheaderStyle: React.CSSProperties = {
  fontSize: '1.1rem',
  color: '#e0e0e0',
  marginBottom: '10px',
};

const sectionStyle: React.CSSProperties = {
  marginBottom: '20px',
  padding: '15px',
  backgroundColor: 'rgba(0, 0, 0, 0.15)',
  borderRadius: '8px',
};

const contentStyle: React.CSSProperties = {
  lineHeight: '1.6',
  color: '#ccc',
};

const listStyle: React.CSSProperties = {
  paddingLeft: '20px',
  margin: 0,
};

const listItemStyle: React.CSSProperties = {
  marginBottom: '8px',
  color: '#ccc',
};

const tagContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
};

const entityTagStyle: React.CSSProperties = {
  padding: '5px 10px',
  backgroundColor: 'rgba(42, 157, 143, 0.15)',
  color: '#2a9d8f',
  borderRadius: '4px',
  fontSize: '0.9rem',
  display: 'inline-block',
};

const footerStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: '#777',
  textAlign: 'right',
  marginTop: '15px',
};

const loadingStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 20px',
};

const loaderStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
  border: '3px solid rgba(42, 157, 143, 0.2)',
  borderTop: '3px solid #2a9d8f',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
};

export default TopicAnalysis; 