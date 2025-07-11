import axios from 'axios';
import * as dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

export interface PixabayImage {
  url: string;
  smallUrl: string;
  attribution: string;
  photographer: string;
  photographerProfile: string;
  tags: string;
}

export class ImageService {
  private readonly pixabayApiKey: string;
  private readonly baseUrl = 'https://pixabay.com/api/';
  
  // Rate limiting: Pixabay allows 100 requests per 60 seconds = 6,000/hour
  private requestCount = 0;
  private lastRequestTime = Date.now();
  private readonly maxRequestsPerMinute = 90; // Conservative limit

  constructor() {
    this.pixabayApiKey = process.env.PIXABAY_ACCESS_KEY || '';
    if (!this.pixabayApiKey) {
      console.warn('⚠️  PIXABAY_ACCESS_KEY not found in environment variables');
    }
  }

  private async rateLimitedRequest(url: string): Promise<any> {
    const now = Date.now();
    
    // Reset counter every minute
    if (now - this.lastRequestTime > 60000) {
      this.requestCount = 0;
      this.lastRequestTime = now;
    }
    
    // Check if we've hit the rate limit
    if (this.requestCount >= this.maxRequestsPerMinute) {
      const waitTime = 60000 - (now - this.lastRequestTime);
      console.log(`⏳ Rate limit reached. Waiting ${Math.ceil(waitTime / 1000)} seconds...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      this.requestCount = 0;
      this.lastRequestTime = Date.now();
    }

    this.requestCount++;
    
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'ChronicDiet-WebApp/1.0'
        }
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 429) {
        console.log('⚠️  Pixabay rate limit exceeded, waiting 60 seconds...');
        await new Promise(resolve => setTimeout(resolve, 60000));
        return this.rateLimitedRequest(url);
      }
      throw error;
    }
  }

  async getIngredientImage(ingredientName: string): Promise<PixabayImage | null> {
    if (!this.pixabayApiKey) {
      console.log('❌ Pixabay API key not configured - check PIXABAY_ACCESS_KEY in .env');
      return null;
    }

    // Prepare multiple search terms in order of preference
    const searchTerms = this.getIngredientSearchTerms(ingredientName);

    for (const searchTerm of searchTerms) {
      try {
        const url = `${this.baseUrl}?key=${this.pixabayApiKey}&q=${encodeURIComponent(searchTerm)}&category=food&image_type=photo&orientation=horizontal&safesearch=true&per_page=3&min_width=640`;
        
        console.log(`🔍 Searching Pixabay for: "${searchTerm}"`);
        
        const data = await this.rateLimitedRequest(url);
        
        if (data.hits && data.hits.length > 0) {
          const image = data.hits[0]; // Take the first (most relevant) result
          
          console.log(`✅ Found image for "${searchTerm}" (from "${ingredientName}")`);
          return {
            url: image.webformatURL,
            smallUrl: image.previewURL,
            attribution: `Photo by ${image.user} on Pixabay`,
            photographer: image.user,
            photographerProfile: `https://pixabay.com/users/${image.user}-${image.user_id}/`,
            tags: image.tags
          };
        }
        
        console.log(`❌ No images found for: ${searchTerm}`);
        
        // Small delay between search attempts to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error: any) {
        console.error(`❌ Error searching for "${searchTerm}":`, error.message);
        continue; // Try next search term
      }
    }

    console.log(`❌ No images found for any variation of: ${ingredientName}`);
    return null;
  }

  async getRecipeImage(recipeName: string): Promise<PixabayImage | null> {
    if (!this.pixabayApiKey) {
      console.log('❌ Pixabay API key not configured - check PIXABAY_ACCESS_KEY in .env');
      return null;
    }

    // Prepare multiple search terms in order of preference
    const searchTerms = this.getRecipeSearchTerms(recipeName);

    for (const searchTerm of searchTerms) {
      try {
        const url = `${this.baseUrl}?key=${this.pixabayApiKey}&q=${encodeURIComponent(searchTerm)}&category=food&image_type=photo&orientation=horizontal&safesearch=true&per_page=3&min_width=640`;
        
        console.log(`🔍 Searching Pixabay for recipe: "${searchTerm}"`);
        
        const data = await this.rateLimitedRequest(url);
        
        if (data.hits && data.hits.length > 0) {
          const image = data.hits[0];
          
          console.log(`✅ Found image for "${searchTerm}" (from "${recipeName}")`);
          return {
            url: image.webformatURL,
            smallUrl: image.previewURL,
            attribution: `Photo by ${image.user} on Pixabay`,
            photographer: image.user,
            photographerProfile: `https://pixabay.com/users/${image.user}-${image.user_id}/`,
            tags: image.tags
          };
        }
        
        console.log(`❌ No images found for: ${searchTerm}`);
        
        // Small delay between search attempts
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error: any) {
        console.error(`❌ Error searching for "${searchTerm}":`, error.message);
        continue; // Try next search term
      }
    }

    console.log(`❌ No images found for any variation of recipe: ${recipeName}`);
    return null;
  }

  async getEducationalImage(searchTerm: string): Promise<PixabayImage | null> {
    if (!this.pixabayApiKey) {
      console.log('❌ Pixabay API key not configured - check PIXABAY_ACCESS_KEY in .env');
      return null;
    }

    try {
      const url = `${this.baseUrl}?key=${this.pixabayApiKey}&q=${encodeURIComponent(searchTerm)}&image_type=photo&orientation=horizontal&safesearch=true&per_page=3&min_width=640`;
      
      console.log(`🔍 Searching Pixabay for educational content: "${searchTerm}"`);
      
      const data = await this.rateLimitedRequest(url);
      
      if (data.hits && data.hits.length > 0) {
        const image = data.hits[0];
        
        return {
          url: image.webformatURL,
          smallUrl: image.previewURL,
          attribution: `Photo by ${image.user} on Pixabay`,
          photographer: image.user,
          photographerProfile: `https://pixabay.com/users/${image.user}-${image.user_id}/`,
          tags: image.tags
        };
      }
      
      console.log(`❌ No images found for educational content: ${searchTerm}`);
      return null;
    } catch (error: any) {
      console.error(`❌ Error fetching educational image for ${searchTerm}:`, error.message);
      return null;
    }
  }

  private getIngredientSearchTerms(ingredientName: string): string[] {
    const searchTerms: string[] = [];
    
    // Extract content from parentheses (often English names)
    const parenthesesMatch = ingredientName.match(/\(([^)]+)\)/);
    if (parenthesesMatch) {
      const englishName = parenthesesMatch[1].trim();
      searchTerms.push(englishName);
      
      // Also try with additional food-related keywords
      searchTerms.push(`${englishName} food`);
    }
    
    // Try cleaned ingredient name (without parentheses)
    const cleanedName = this.cleanIngredientName(ingredientName);
    if (cleanedName && cleanedName !== ingredientName) {
      searchTerms.push(cleanedName);
    }
    
    // Try original ingredient name
    searchTerms.push(ingredientName);
    
    // Add generic fallbacks based on ingredient type
    const lowerName = ingredientName.toLowerCase();
    if (lowerName.includes('bean')) {
      searchTerms.push('beans', 'legumes');
    } else if (lowerName.includes('rice')) {
      searchTerms.push('rice grain');
    } else if (lowerName.includes('fish')) {
      searchTerms.push('fish seafood');
    } else if (lowerName.includes('meat') || lowerName.includes('chicken') || lowerName.includes('beef')) {
      searchTerms.push('meat protein');
    } else {
      // Generic food fallback
      searchTerms.push('healthy food ingredients');
    }
    
    // Remove duplicates and empty strings
    return [...new Set(searchTerms.filter(term => term && term.trim().length > 0))];
  }

  private cleanIngredientName(name: string): string {
    return name
      .replace(/\(.*?\)/g, '') // Remove parentheses content
      .replace(/Heart-Healthy/gi, '') // Remove heart-healthy prefix
      .replace(/Fresh /gi, '') // Remove "Fresh" prefix
      .replace(/Local Variety/gi, '') // Remove "Local Variety"
      .replace(/Premium Grade/gi, '') // Remove "Premium Grade"
      .replace(/Low-Sodium/gi, '') // Remove "Low-Sodium"
      .replace(/Reduced Fat/gi, '') // Remove "Reduced Fat"
      .trim();
  }

  private getRecipeSearchTerms(recipeName: string): string[] {
    const searchTerms: string[] = [];
    
    // Primary search: cleaned recipe name
    const cleanedName = this.cleanRecipeName(recipeName);
    if (cleanedName) {
      searchTerms.push(cleanedName);
    }
    
    // Secondary searches: extract key ingredients/cooking methods
    const lowerName = recipeName.toLowerCase();
    
    if (lowerName.includes('steam')) {
      if (lowerName.includes('fish') || lowerName.includes('ikan')) {
        searchTerms.push('steamed fish', 'fish steamed ginger', 'asian steamed fish');
      }
      searchTerms.push('steamed food', 'steamed asian dish');
    }
    
    if (lowerName.includes('curry')) {
      searchTerms.push('fish curry', 'asian curry', 'malaysian curry');
    }
    
    if (lowerName.includes('sambal')) {
      searchTerms.push('spicy tofu', 'tempeh dish', 'indonesian food');
    }
    
    if (lowerName.includes('nasi') || lowerName.includes('rice')) {
      searchTerms.push('herb rice', 'asian rice dish', 'coconut rice');
    }
    
    if (lowerName.includes('sayur') || lowerName.includes('vegetables')) {
      searchTerms.push('stir fried vegetables', 'asian greens', 'chinese vegetables');
    }
    
    // Tertiary fallbacks: generic terms
    if (lowerName.includes('fish') || lowerName.includes('ikan')) {
      searchTerms.push('fish dish', 'cooked fish');
    }
    
    if (lowerName.includes('healthy') || lowerName.includes('heart')) {
      searchTerms.push('healthy food', 'nutritious meal');
    }
    
    // Final fallback
    searchTerms.push('asian food', 'healthy meal');
    
    // Remove duplicates and empty strings
    return [...new Set(searchTerms.filter(term => term && term.trim().length > 0))];
  }

  private cleanRecipeName(name: string): string {
    return name
      .replace(/Heart-Healthy/gi, '') // Remove heart-healthy prefix
      .replace(/Malaysian/gi, '') // Remove Malaysian prefix for broader search
      .replace(/\(.*?\)/g, '') // Remove parentheses content
      // Replace Malaysian terms with English equivalents for better Pixabay search
      .replace(/\bIkan\b/gi, 'fish') // Ikan = fish
      .replace(/\bAyam\b/gi, 'chicken') // Ayam = chicken
      .replace(/\bDaging\b/gi, 'beef') // Daging = beef
      .replace(/\bSayur\b/gi, 'vegetables') // Sayur = vegetables
      .replace(/\bNasi\b/gi, 'rice') // Nasi = rice
      .replace(/\bSambal\b/gi, 'chili sauce') // Sambal = chili sauce
      .replace(/\bTempeh\b/gi, 'fermented soy') // For broader search
      .trim();
  }

  async downloadImageAsBuffer(url: string): Promise<Buffer> {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer'
      });
      return Buffer.from(response.data);
    } catch (error: any) {
      console.error(`❌ Failed to download image from ${url}:`, error.message);
      throw error;
    }
  }

  /**
   * Batch fetch images with rate limiting and error handling
   */
  async batchFetchImages<T>(
    items: T[],
    fetchImageFn: (item: T) => Promise<PixabayImage | null>,
    batchSize: number = 10,
    delayBetweenBatches: number = 1000
  ): Promise<Map<T, PixabayImage>> {
    const results = new Map<T, PixabayImage>();
    
    console.log(`📦 Processing ${items.length} items in batches of ${batchSize}`);
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      
      console.log(`🔄 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(items.length / batchSize)}`);
      
      const promises = batch.map(async (item) => {
        const image = await fetchImageFn(item);
        if (image) {
          results.set(item, image);
        }
        return { item, image };
      });
      
      await Promise.all(promises);
      
      // Delay between batches to respect rate limits
      if (i + batchSize < items.length) {
        console.log(`⏳ Waiting ${delayBetweenBatches}ms before next batch...`);
        await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
      }
    }
    
    console.log(`✅ Successfully fetched ${results.size}/${items.length} images`);
    return results;
  }
} 