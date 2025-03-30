import { GoogleGenerativeAI } from "@google/generative-ai";

// --- Initialize Google AI Client ---
const geminiApiKey = process.env.GEMINI_API_KEY;
let genAI;
let model;

if (geminiApiKey) {
  genAI = new GoogleGenerativeAI(geminiApiKey);
  model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
  console.log("Gemini AI Client Initialized for Topic Analysis.");
} else {
  console.warn("GEMINI_API_KEY not found in environment variables. AI features will be skipped.");
}

// In-memory cache for topic analyses
const topicAnalysisCache = new Map();
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // Cache for 24 hours (topic analyses are less time-sensitive)

export default async function handler(req, res) {
  // Only allow POST requests with article data
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { articles, topic } = req.body;
    
    if (!articles || !Array.isArray(articles) || articles.length < 2) {
      return res.status(400).json({ error: 'At least 2 articles are required for cross-article analysis' });
    }
    
    if (!model) {
      return res.status(503).json({ error: 'AI model not available' });
    }
    
    // Create a cache key based on article IDs and topic
    const articleIds = articles.map(a => a.id).sort().join('-');
    const cacheKey = `${topic || 'general'}-${articleIds}`;
    
    // Check if we have a cached analysis
    const cachedAnalysis = topicAnalysisCache.get(cacheKey);
    if (cachedAnalysis && (Date.now() - cachedAnalysis.timestamp < CACHE_DURATION_MS)) {
      console.log(`Cache HIT for topic analysis: ${topic}`);
      return res.status(200).json(cachedAnalysis.data);
    }
    
    console.log(`Generating cross-article analysis for topic: ${topic}`);
    
    // Extract key information from articles
    const articleData = articles.map(article => ({
      title: article.title,
      summary: article.summary || article.description,
      date: article.publicationDate,
      source: article.sourceName,
      entities: article.entities || [],
      sentiment: article.sentimentLabel || 'neutral'
    }));
    
    // Prepare prompt for cross-article analysis
    const prompt = `
      Analyze these ${articles.length} articles about "${topic || 'AI technology'}" and provide:
      
      1. A synthesized summary (2-3 paragraphs) that combines key information from all articles
      2. Main trends or patterns observed across articles
      3. Any notable disagreements or contradictions between sources
      4. Key entities/organizations mentioned across multiple articles
      5. Overall sentiment analysis of the topic based on all articles
      
      Return your analysis as a JSON object with these fields:
      {
        "synthesizedSummary": "...",
        "trends": ["trend1", "trend2", ...],
        "contradictions": ["contradiction1", "contradiction2", ...],
        "keyEntities": ["entity1", "entity2", ...],
        "overallSentiment": "positive/negative/neutral",
        "confidenceScore": 0.85  // How confident you are in this analysis
      }
      
      Here are the articles:
      ${JSON.stringify(articleData, null, 2)}
    `;
    
    // Generate the cross-article analysis
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    
    // Extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    let analysisData;
    
    if (jsonMatch) {
      try {
        analysisData = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error("Error parsing AI response:", e);
        return res.status(500).json({ error: 'Failed to parse AI analysis' });
      }
    } else {
      return res.status(500).json({ error: 'AI response did not contain valid JSON' });
    }
    
    // Add metadata to the response
    const responseData = {
      analysis: analysisData,
      meta: {
        articleCount: articles.length,
        topic: topic || 'general',
        generatedAt: new Date().toISOString(),
        sources: articles.map(a => a.sourceName).filter((v, i, a) => a.indexOf(v) === i) // Unique sources
      }
    };
    
    // Cache the analysis
    topicAnalysisCache.set(cacheKey, {
      data: responseData,
      timestamp: Date.now()
    });
    
    return res.status(200).json(responseData);
    
  } catch (error) {
    console.error('Error in topic analysis:', error);
    return res.status(500).json({ error: 'Failed to generate topic analysis', details: error.message });
  }
} 