import React from 'react';

interface TopicFilterProps {
  currentTopic: string;
  onTopicChange: (topic: string) => void;
}

const TopicFilter: React.FC<TopicFilterProps> = ({ currentTopic, onTopicChange }) => {
  // Define available topics with friendly names
  const topics = [
    { id: 'all', name: 'All AI' },
    { id: 'tech-research', name: 'Technology & Research' },
    { id: 'impact-industry', name: 'Impact & Industry' },
    { id: 'apps-tools', name: 'Applications & Tools' }
  ];

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      margin: '16px 0',
      justifyContent: 'center'
    }}>
      {topics.map(topic => (
        <button
          key={topic.id}
          onClick={() => onTopicChange(topic.id)}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: currentTopic === topic.id ? '#2a9d8f' : '#34363f',
            color: currentTopic === topic.id ? 'white' : '#ccc',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            if (currentTopic !== topic.id) {
              e.currentTarget.style.backgroundColor = '#3d3f49';
            }
          }}
          onMouseOut={(e) => {
            if (currentTopic !== topic.id) {
              e.currentTarget.style.backgroundColor = '#34363f';
            }
          }}
        >
          {topic.name}
        </button>
      ))}
    </div>
  );
};

export default TopicFilter; 