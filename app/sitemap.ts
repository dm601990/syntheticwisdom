import { MetadataRoute } from 'next'
import { toolkitItems } from '../data/toolkitData'

// Generate current date in the format needed for lastModified
const currentDate = new Date().toISOString()

export default function sitemap(): MetadataRoute.Sitemap {
  // Base URL for the website
  const baseUrl = 'https://syntheticwisdom.com'
  
  // Core pages
  const mainPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/toolkit`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ]
  
  // Get potential dynamic routes from toolkit items
  // Note: Only include if you plan to create individual pages for each toolkit item
  // const toolkitRoutes = toolkitItems.map(item => ({
  //   url: `${baseUrl}/toolkit/${item.id}`,
  //   lastModified: currentDate,
  //   changeFrequency: 'monthly' as const,
  //   priority: 0.7,
  // }))
  
  // Combine all routes for the sitemap
  // return [...mainPages, ...toolkitRoutes]
  return mainPages
} 