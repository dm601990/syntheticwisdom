// pages/api/news.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- Initialize Google AI Client ---
const geminiApiKey = process.env.GEMINI_API_KEY;
let genAI;
let model;

if (geminiApiKey) {
  genAI = new GoogleGenerativeAI(geminiApiKey);
  // Use the model name that worked for you previously (e.g., 'gemini-1.0-pro' or 'gemini-1.5-pro-latest')
  model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" }); // Or "gemini-1.0-pro"
  console.log("Gemini AI Client Initialized.");
} else {
  console.warn("GEMINI_API_KEY not found in environment variables. AI features will be skipped.");
}
// --- End Initialize ---

// --- Enhanced Multi-Tiered Caching System ---
// Cache settings
const CACHE_SETTINGS = {
  NEWS_API: {
    DURATION_SHORT: 10 * 60 * 1000,        // 10 minutes for very recent news
    DURATION_MEDIUM: 60 * 60 * 1000,       // 1 hour for recent news
    DURATION_LONG: 6 * 60 * 60 * 1000,     // 6 hours for older news
    DURATION_EXTENDED: 24 * 60 * 60 * 1000 // 24 hours for very old news
  },
  AI_PROCESSING: {
    DURATION: 7 * 24 * 60 * 60 * 1000      // 7 days for AI-processed content
  },
  MAX_ITEMS: 500                           // Maximum cache size
};

// Cache analytics
const cacheAnalytics = {
  hits: 0,
  misses: 0,
  expirations: 0,
  aiHits: 0,
  aiMisses: 0,
  newsApiHits: 0,
  newsApiMisses: 0,
  totalQueries: 0,
  lastCleanup: Date.now()
};

// Primary in-memory cache for API responses and AI results
class EnhancedCache {
  constructor(maxItems = CACHE_SETTINGS.MAX_ITEMS) {
    this.cache = new Map();
    this.cacheOrder = []; // For LRU tracking
    this.maxItems = maxItems;
  }

  // Get an item from cache
  get(key, type = 'generic') {
    this.cacheAnalytics(type, 'query');
    const item = this.cache.get(key);
    
    if (!item) {
      this.cacheAnalytics(type, 'miss');
      return null;
    }
    
    // Check if the item is expired
    if (Date.now() > item.expiresAt) {
      this.cacheAnalytics(type, 'expired');
      return null;
    }
    
    // Update access time and order for LRU
    item.lastAccessed = Date.now();
    this.updateAccessOrder(key);
    
    this.cacheAnalytics(type, 'hit');
    return item.data;
  }

  // Set an item in cache with expiration
  set(key, data, ttl, type = 'generic') {
    // Ensure the cache doesn't exceed max size (use LRU eviction)
    if (this.cache.size >= this.maxItems) {
      this.evictLRU();
    }
    
    const expiresAt = Date.now() + ttl;
    
    this.cache.set(key, {
      data,
      expiresAt,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      type
    });
    
    // Add to order tracking
    if (!this.cacheOrder.includes(key)) {
      this.cacheOrder.push(key);
    }
  }

  // Update the access order for LRU tracking
  updateAccessOrder(key) {
    const index = this.cacheOrder.indexOf(key);
    if (index > -1) {
      this.cacheOrder.splice(index, 1);
      this.cacheOrder.push(key);
    }
  }

  // Evict least recently used item
  evictLRU() {
    if (this.cacheOrder.length > 0) {
      const oldestKey = this.cacheOrder.shift();
      this.cache.delete(oldestKey);
    }
  }

  // Remove expired items
  cleanupExpired() {
    const now = Date.now();
    let removedCount = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
        const index = this.cacheOrder.indexOf(key);
        if (index > -1) {
          this.cacheOrder.splice(index, 1);
        }
        removedCount++;
      }
    }
    
    cacheAnalytics.lastCleanup = now;
    cacheAnalytics.expirations += removedCount;
    return removedCount;
  }
  
  // Clear the entire cache
  clear() {
    const previousSize = this.cache.size;
    this.cache.clear();
    this.cacheOrder = [];
    console.log(`Cache cleared: ${previousSize} items removed`);
    return previousSize;
  }

  // Delete a specific item from the cache
  delete(key) {
    const exists = this.cache.has(key);
    if (exists) {
      this.cache.delete(key);
      const index = this.cacheOrder.indexOf(key);
      if (index > -1) {
        this.cacheOrder.splice(index, 1);
      }
      console.log(`Cache item deleted: ${key}`);
      return true;
    }
    return false;
  }

  // Track cache analytics
  cacheAnalytics(type, action) {
    cacheAnalytics.totalQueries++;
    
    if (action === 'hit') {
      cacheAnalytics.hits++;
      if (type === 'ai') cacheAnalytics.aiHits++;
      if (type === 'newsApi') cacheAnalytics.newsApiHits++;
    } 
    else if (action === 'miss') {
      cacheAnalytics.misses++;
      if (type === 'ai') cacheAnalytics.aiMisses++;
      if (type === 'newsApi') cacheAnalytics.newsApiMisses++;
    }
  }

  // Generate cache statistics
  getStats() {
    const hitRate = cacheAnalytics.totalQueries > 0 
      ? (cacheAnalytics.hits / cacheAnalytics.totalQueries * 100).toFixed(2)
      : 0;
      
    return {
      size: this.cache.size,
      hitRate: `${hitRate}%`,
      hits: cacheAnalytics.hits,
      misses: cacheAnalytics.misses,
      expirations: cacheAnalytics.expirations,
      aiHitRate: cacheAnalytics.aiHits + cacheAnalytics.aiMisses > 0
        ? (cacheAnalytics.aiHits / (cacheAnalytics.aiHits + cacheAnalytics.aiMisses) * 100).toFixed(2) + '%'
        : '0%',
      newsApiHitRate: cacheAnalytics.newsApiHits + cacheAnalytics.newsApiMisses > 0
        ? (cacheAnalytics.newsApiHits / (cacheAnalytics.newsApiHits + cacheAnalytics.newsApiMisses) * 100).toFixed(2) + '%'
        : '0%',
      lastCleanup: new Date(cacheAnalytics.lastCleanup).toISOString()
    };
  }
}

// Create cache instance
const enhancedCache = new EnhancedCache();

// Export the cache instance for use in other API endpoints
export { enhancedCache };

// Function to determine appropriate cache TTL based on article freshness
function getCacheTTL(hoursSincePublication) {
  if (hoursSincePublication < 6) {
    return CACHE_SETTINGS.NEWS_API.DURATION_SHORT;
  } else if (hoursSincePublication < 24) {
    return CACHE_SETTINGS.NEWS_API.DURATION_MEDIUM;
  } else if (hoursSincePublication < 72) {
    return CACHE_SETTINGS.NEWS_API.DURATION_LONG;
  } else {
    return CACHE_SETTINGS.NEWS_API.DURATION_EXTENDED;
  }
}

// Function to generate cache key for news API requests
function generateNewsApiCacheKey(query, page, pageSize) {
  return `news_api:${query}:page${page}:size${pageSize}`;
}

// Run cache cleanup periodically (every hour)
setInterval(() => {
  const removedCount = enhancedCache.cleanupExpired();
  console.log(`Cache cleanup: removed ${removedCount} expired items`);
}, 60 * 60 * 1000);

console.log("Enhanced multi-tiered caching system initialized");
// --- End Enhanced Caching System ---

// Add this helper function near the top, after imports/AI client setup
function getCategoryFromText(title = '', summary = '') {
    const lowerCaseText = (title + ' ' + summary).toLowerCase();

    // Define keywords for categories with expanded patterns
    // LLM & Generative AI
    if (/\b(llm|gpt|language model|chat(gpt|bot)|openai|anthropic|claude|gemini|transformer|prompt|token|llama|mistral|falcon|generative ai)\b/.test(lowerCaseText)) {
        return 'LLM';
    }
    
    // AI Research
    if (/\b(research|study|paper|researcher|university|breakthrough|discover|advance|progress|innovation|novel|technique)\b/.test(lowerCaseText) && 
        /\b(ai|artificial intelligence|machine learning|deep learning|neural)\b/.test(lowerCaseText)) {
        return 'Research';
    }
    
    // Business & Market
    if (/\b(business|market|stock|invest|funding|startup|enterprise|economic|acquisition|merger|ipo|venture|capital|valuation|billion|million|profit|revenue|growth)\b/.test(lowerCaseText)) {
        return 'Business';
    }
    
    // Policy & Regulation
    if (/\b(policy|regulation|law|legal|compliance|congress|senate|eu|government|regulator|rule|standard|framework|guideline|copyright|governance)\b/.test(lowerCaseText)) {
        return 'Policy';
    }
    
    // Ethics & Society
    if (/\b(ethic|social|society|bias|fair|discrimination|harm|risk|safety|responsible|trustworth|accountability|transparency|privacy|right|human)\b/.test(lowerCaseText)) {
        return 'Ethics';
    }
    
    // Art & Creativity
    if (/\b(art|creative|design|music|image|video|film|cinema|write|text|content|creation|generate|midjourney|dall-e|stable diffusion)\b/.test(lowerCaseText)) {
        return 'Creative AI';
    }
    
    // Applications & Tools
    if (/\b(tool|application|product|feature|solution|platform|service|software|app|release|update|version|api|interface|user|customer)\b/.test(lowerCaseText)) {
        return 'Tools';
    }
    
    // Robotics & Hardware
    if (/\b(robot|hardware|device|physical|mechanical|motor|sensor|camera|embodied|android|humanoid|machine|automat)\b/.test(lowerCaseText)) {
        return 'Robotics';
    }
    
    // Science & Healthcare
    if (/\b(science|health|medical|patient|doctor|treatment|drug|medicine|disease|diagnos|therapy|biology|chemistry|physics|climate|environment|space|planet|astronomy)\b/.test(lowerCaseText)) {
        return 'Science';
    }
    
    // Education & Learning
    if (/\b(education|school|student|learn|teach|classroom|course|training|tutor|curriculum|skill|knowledge)\b/.test(lowerCaseText)) {
        return 'Education';
    }
    
    // Humor & Fiction
    if (/\b(fake|fictional|satire|funny|absurd|joke|humor|comedy|parody|silly)\b/.test(lowerCaseText) || title.includes('Simulated Silliness')) {
        return 'Simulated Silliness';
    }

    // If we couldn't determine a specific category, check for general AI terms
    if (/\b(ai|artificial intelligence|machine learning|deep learning|neural|algorithm)\b/.test(lowerCaseText)) {
        return 'AI News';
    }

    return 'Tech'; // Default fallback category that's better than "General"
}

// --- Add separate functions for entities and sentiment ---
async function extractEntities(text) {
  if (!model) return [];
  
  try {
    const prompt = `
    Extract the main entities (people, organizations, technologies, key concepts) from the following text.
    Return ONLY a JSON array of strings with no explanation, commentary, or other text.
    Example response format: ["OpenAI", "Microsoft", "GPT-4", "Artificial Intelligence"]
    
    Input Text:
    "${text}"
    `;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text()?.trim();
    
    if (responseText) {
      try {
        // Handle cases where the API might wrap the array in additional text
        const jsonMatch = responseText.match(/\[.*\]/s);
        if (jsonMatch) {
          const entities = JSON.parse(jsonMatch[0]);
          return Array.isArray(entities) ? entities : [];
        }
      } catch (parseError) {
        console.error("Entity extraction parse error:", parseError);
      }
    }
    return [];
  } catch (error) {
    console.error("Entity extraction API error:", error);
    return [];
  }
}

async function analyzeSentiment(text) {
  if (!model) return { score: 0.5, label: 'Neutral' };
  
  try {
    const prompt = `
    Analyze the sentiment of the following text. Provide:
    1. A sentiment score from 0.0 (extremely negative) to 1.0 (extremely positive), where 0.5 is neutral
    2. A sentiment label: "Positive", "Negative", or "Neutral"
    
    Return ONLY a JSON object with these properties and no other text.
    Example: {"score": 0.8, "label": "Positive"}
    
    Input Text:
    "${text}"
    `;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text()?.trim();
    
    if (responseText) {
      try {
        const jsonMatch = responseText.match(/\{.*\}/s);
        if (jsonMatch) {
          const sentiment = JSON.parse(jsonMatch[0]);
          return {
            score: typeof sentiment.score === 'number' ? sentiment.score : 0.5,
            label: typeof sentiment.label === 'string' ? sentiment.label : 'Neutral'
          };
        }
      } catch (parseError) {
        console.error("Sentiment analysis parse error:", parseError);
      }
    }
    return { score: 0.5, label: 'Neutral' };
  } catch (error) {
    console.error("Sentiment analysis API error:", error);
    return { score: 0.5, label: 'Neutral' };
  }
}

export default async function handler(req, res) {
  const newsApiKey = process.env.NEWS_API_KEY;
  if (!newsApiKey) {
    console.error("NewsAPI key not configured in .env.local");
    return res.status(500).json({ error: 'API key not configured.' });
  }
  
  if (!model && geminiApiKey) { // Check if model failed init despite key existing
    console.error("Gemini model failed to initialize despite API key. Check model name/API access.");
    // Proceed without AI enrichment
  }

  // Get query parameters from request
  const topic = req.query.topic || 'general';
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const pageSize = parseInt(req.query.pageSize) || 8; // Default to 8 articles per page
  
  // Define search queries for different AI topics
  const topicQueries = {
    general: 'artificial intelligence',
    llm: 'large language models OR chatgpt OR claude OR gemini',
    robotics: 'AI robotics OR autonomous robots',
    ml: 'machine learning OR deep learning',
    business: 'AI business applications OR AI startups',
    ethics: 'AI ethics OR responsible AI'
  };
  
  // Select the appropriate query based on the requested topic
  const searchQuery = topicQueries[topic] || topicQueries.general;
  
  // Generate cache key for this specific request
  const cacheKey = generateNewsApiCacheKey(searchQuery, page, pageSize);
  
  // Try to get from cache first
  const cachedNewsResponse = enhancedCache.get(cacheKey, 'newsApi');
  
  // If we have a valid cache hit, return it immediately
  if (cachedNewsResponse) {
    console.log(`NewsAPI Cache HIT for query: "${searchQuery}" page ${page}`);
    return res.status(200).json(cachedNewsResponse);
  }
  
  console.log(`NewsAPI Cache MISS for query: "${searchQuery}" page ${page}`);
  
  // --- FETCH ARTICLES WITH PAGINATION ---
  const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&language=en&sortBy=publishedAt&page=${page}&pageSize=${pageSize}&apiKey=${newsApiKey}`;

  // --- UPDATED TRY/CATCH BLOCK ---
  try {
    // 1. Fetch news snippets
    console.log("Fetching from NewsAPI...");
    const newsResponse = await fetch(newsApiUrl);
    if (!newsResponse.ok) { 
      const errorData = await newsResponse.json();
      console.error('NewsAPI Error:', errorData);
      throw new Error(`NewsAPI request failed (${newsResponse.status}): ${errorData.message || 'Unknown error'}`);
    }
    const newsData = await newsResponse.json();
    console.log(`API Route: Retrieved ${newsData.articles?.length || 0} articles from NewsAPI.`);
    if (!newsData.articles || newsData.articles.length === 0) { return res.status(200).json({ articles: [] }); }

    // 2. Process articles in parallel (QUICK AI tasks only + Cache Check)
    console.log("Starting parallel AI processing (Entities/Sentiment Only, Cache Check)...");
    const processingPromises = newsData.articles.map(async (article, index) => {
        const articleCacheKey = `article:${article.url || article.title}`;
        let extractedEntities = [];
        let sentimentResult = { score: 0.5, label: 'Neutral' };
        
        // Calculate freshness for cache TTL determination
        const publicationDate = new Date(article.publishedAt || Date.now());
        const currentDate = new Date();
        const hoursSincePublication = Math.floor((currentDate - publicationDate) / (1000 * 60 * 60));

        // --- Check Cache for Entities/Sentiment ---
        const cachedArticleData = enhancedCache.get(articleCacheKey, 'ai');
        
        if (cachedArticleData) {
            console.log(`AI Cache HIT for "${article.title}"`);
            extractedEntities = cachedArticleData.entities || [];
            sentimentResult = {
                score: cachedArticleData.sentimentScore ?? 0.5,
                label: cachedArticleData.sentimentLabel ?? 'Neutral'
            };
        } else if (model) { // --- Cache MISS or expired ---
            console.log(`AI Cache MISS for "${article.title}". Calling AI...`);
            const inputText = `Title: ${article.title}\nSnippet: ${article.description || article.content || ''}`;

            // --- Call Entity Extraction ---
            if (inputText.length > 30) {
                extractedEntities = await extractEntities(inputText);
            }

            // --- Call Sentiment Analysis ---
            if (inputText.length > 30) {
               sentimentResult = await analyzeSentiment(inputText);
            }

            // --- Store AI results in cache with longer TTL ---
            const aiResults = {
                entities: extractedEntities,
                sentimentScore: sentimentResult.score,
                sentimentLabel: sentimentResult.label,
                timestamp: Date.now(),
                hoursSincePublication: hoursSincePublication
            };
            
            enhancedCache.set(
                articleCacheKey, 
                aiResults, 
                CACHE_SETTINGS.AI_PROCESSING.DURATION, 
                'ai'
            );
            
            console.log(`Stored AI results in cache for "${article.title}"`);
        } else { 
            console.warn("Gemini model not available, skipping AI enrichment."); 
        }

        // Process remaining fields
        const wordsPerMinute = 200;
        const textForReadTime = article.description || article.content || "";
        // Calculate word count more accurately with regex splitting
        const words = textForReadTime.trim().split(/\s+/).filter(Boolean).length;
        
        // Estimate full article length (API typically returns truncated content)
        // News articles are typically 600-800 words, so estimate based on snippet
        const estimatedFullArticleWords = words * 3;  // Rough multiplier for full article
        
        // Calculate read time from estimated words
        const readTime = Math.max(1, Math.ceil(estimatedFullArticleWords / wordsPerMinute));

        // Calculate article freshness
        let freshness;
        if (hoursSincePublication < 6) {
          freshness = 'very-recent'; // Less than 6 hours
        } else if (hoursSincePublication < 24) {
          freshness = 'recent'; // Less than 24 hours
        } else if (hoursSincePublication < 72) {
          freshness = 'new'; // Less than 3 days
        } else {
          freshness = 'older'; // Older than 3 days
        }

        // Return article object WITHOUT aiSummary or bulletSummary yet
        return {
          id: `${article.source?.id || 'src'}-${new Date(article.publishedAt || Date.now()).getTime()}-${index}`,
          title: article.title || 'No Title Provided',
          summary: article.description || article.content || 'No summary available.', // Original snippet
          category: getCategoryFromText(article.title, article.description || article.content),
          energy: Math.random(), // Placeholder
          publicationDate: article.publishedAt || new Date().toISOString(),
          sourceName: article.source?.name || 'Unknown Source',
          url: article.url,
          imageUrl: article.urlToImage,
          readTime: readTime,
          freshness: freshness, // New field indicating content age
          hoursSincePublication: hoursSincePublication, // Exact hours for sorting
          entities: extractedEntities, // From cache or fresh call
          sentimentScore: sentimentResult.score,
          sentimentLabel: sentimentResult.label,
          aiSummary: null, // Explicitly null now
          bulletSummary: null, // Explicitly null now
          keywords: [], // Keep placeholder
        };
    }); // End of .map()

    const processedArticles = await Promise.all(processingPromises);
    console.log("Finished parallel AI processing (Entities/Sentiment Only).");

    // Prepare response object
    const responseData = { 
      articles: processedArticles,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalResults: newsData.totalResults || processedArticles.length,
        totalPages: newsData.totalResults ? Math.ceil(newsData.totalResults / pageSize) : 1
      },
      topic: topic,
      cacheStats: enhancedCache.getStats()
    };
    
    // Cache the complete response with TTL based on content freshness
    // For mixed freshness articles, use the shortest TTL to be safe
    const oldestArticleHours = Math.min(...processedArticles.map(a => a.hoursSincePublication));
    enhancedCache.set(
      cacheKey, 
      responseData, 
      getCacheTTL(oldestArticleHours), 
      'newsApi'
    );
    
    // Include pagination metadata in the response
    res.status(200).json(responseData);

  } catch (error) {
    // Catch errors from NewsAPI fetch or Promise.all itself
    console.error('--- Error in main API route handler: ---', error);
    res.status(500).json({ 
      error: 'Failed to fetch or process news data.', 
      details: error.message,
      cacheStats: enhancedCache.getStats() 
    });
  }
} 