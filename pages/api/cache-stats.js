import { enhancedCache } from './news'; // Import the cache instance

export default async function handler(req, res) {
  // Basic API key authentication for admin operations
  const adminKey = process.env.ADMIN_API_KEY;
  const providedKey = req.headers['x-admin-key'] || req.query.key;
  
  // Only allow cache clearing with valid admin key
  if (req.method === 'DELETE' && providedKey === adminKey) {
    try {
      // Clear the entire cache
      const stats = enhancedCache.getStats();
      enhancedCache.clear();
      return res.status(200).json({ 
        message: 'Cache cleared successfully',
        previousStats: stats 
      });
    } catch (error) {
      return res.status(500).json({ 
        error: 'Failed to clear cache',
        details: error.message
      });
    }
  }
  
  // For GET requests, return cache stats
  if (req.method === 'GET') {
    try {
      const stats = enhancedCache.getStats();
      
      // Add cache health indicators
      const hitRateNum = parseFloat(stats.hitRate);
      const cacheHealth = {
        status: hitRateNum > 70 ? 'good' : hitRateNum > 40 ? 'moderate' : 'poor',
        recommendations: []
      };
      
      // Add recommendations based on stats
      if (hitRateNum < 40) {
        cacheHealth.recommendations.push('Consider increasing cache TTL values');
      }
      
      if (stats.size > 400) { // Approaching MAX_ITEMS (500)
        cacheHealth.recommendations.push('Cache size approaching limit, consider cleanup');
      }
      
      if (stats.aiHitRate < 60) {
        cacheHealth.recommendations.push('AI cache hit rate is low, consider optimizing AI caching');
      }
      
      return res.status(200).json({
        stats,
        cacheHealth,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return res.status(500).json({ 
        error: 'Failed to retrieve cache stats',
        details: error.message
      });
    }
  }
  
  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
} 