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

    try {
      // Clean up ingredient name for better search results
      const searchTerm = this.cleanIngredientName(ingredientName);
      
      const url = `${this.baseUrl}?key=${this.pixabayApiKey}&q=${encodeURIComponent(searchTerm)}&category=food&image_type=photo&orientation=horizontal&safesearch=true&per_page=3&min_width=640`;
      
      console.log(`🔍 Searching Pixabay for: "${searchTerm}"`);
      
      const data = await this.rateLimitedRequest(url);
      
      if (data.hits && data.hits.length > 0) {
        const image = data.hits[0]; // Take the first (most relevant) result
        
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
      return null;
    } catch (error: any) {
      console.error(`❌ Error fetching image for ${ingredientName}:`, error.message);
      return null;
    }
  }

  async getRecipeImage(recipeName: string): Promise<PixabayImage | null> {
    if (!this.pixabayApiKey) {
      console.log('❌ Pixabay API key not configured - check PIXABAY_ACCESS_KEY in .env');
      return null;
    }

    try {
      // Clean up recipe name for better search results
      const searchTerm = this.cleanRecipeName(recipeName);
      
      const url = `${this.baseUrl}?key=${this.pixabayApiKey}&q=${encodeURIComponent(searchTerm)}&category=food&image_type=photo&orientation=horizontal&safesearch=true&per_page=3&min_width=640`;
      
      console.log(`🔍 Searching Pixabay for recipe: "${searchTerm}"`);
      
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
      
      console.log(`❌ No images found for recipe: ${searchTerm}`);
      return null;
    } catch (error: any) {
      console.error(`❌ Error fetching image for recipe ${recipeName}:`, error.message);
      return null;
    }
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

  private cleanRecipeName(name: string): string {
    return name
      .replace(/Heart-Healthy/gi, '') // Remove heart-healthy prefix
      .replace(/Malaysian/gi, '') // Remove Malaysian prefix for broader search
      .replace(/\(.*?\)/g, '') // Remove parentheses content
      .trim();
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