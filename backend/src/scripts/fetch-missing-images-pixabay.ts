import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Repository } from 'typeorm';
import { StorageService } from '../storage/storage.service';
import { Recipe } from '../recipe/recipe.entity';
import { Component } from '../component/component.entity';
import { EducationalContent } from '../educational/educational.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StorageType } from '../storage/enum/storage.enum';
import { ImageService } from '../db/seeds/image.service';

/*
  Script to fetch missing images using Pixabay API
  Finds any Recipe, Component, or EducationalContent with missing/empty thumbnails
  and fetches appropriate images from Pixabay following strict rate limits
  
  Pixabay API Rate Limits (from https://pixabay.com/api/docs/):
  - 100 requests per 60 seconds
  - Images must be cached for 24 hours
  - No hotlinking - must download to server
  
  Run with:
    npx ts-node -r tsconfig-paths/register src/scripts/fetch-missing-images-pixabay.ts
*/

interface EntityWithImage {
  id: string;
  name?: string;
  title?: string;
  storage_links: any;
}

class PixabayImageFetcher {
  public imageService: ImageService;
  private storageService: StorageService;
  private requestCount = 0;
  private windowStart = Date.now();
  private readonly MAX_REQUESTS_PER_MINUTE = 90; // Conservative limit below 100
  private readonly MINUTE_MS = 60000;

  constructor(storageService: StorageService) {
    this.imageService = new ImageService();
    this.storageService = storageService;
  }

  /**
   * Rate limiting based on Pixabay API documentation
   * 100 requests per 60 seconds, we use 90 to be safe
   */
  private async respectRateLimit(): Promise<void> {
    const now = Date.now();
    
    // Reset counter every minute
    if (now - this.windowStart >= this.MINUTE_MS) {
      this.requestCount = 0;
      this.windowStart = now;
      console.log('🔄 Rate limit window reset');
    }
    
    // Check if we're approaching the rate limit
    if (this.requestCount >= this.MAX_REQUESTS_PER_MINUTE) {
      const waitTime = this.MINUTE_MS - (now - this.windowStart);
      console.log(`⏳ Rate limit reached (${this.requestCount}/${this.MAX_REQUESTS_PER_MINUTE}). Waiting ${Math.ceil(waitTime / 1000)} seconds...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      this.requestCount = 0;
      this.windowStart = Date.now();
    }

    this.requestCount++;
  }

  /**
   * Check if entity has missing or empty thumbnail
   */
  private hasMissingImage(entity: EntityWithImage): boolean {
    const thumbnail = entity.storage_links?.thumbnail;
    return !thumbnail || 
           thumbnail === '' || 
           thumbnail === 'f4b20835-cb31-4893-9463-b9c89a5eaa3a'; // default placeholder
  }

  /**
   * Get entity display name (handles both name and title properties)
   */
  private getEntityName(entity: EntityWithImage): string {
    return entity.name || entity.title || 'Unknown';
  }

  /**
   * Process entities and fetch missing images
   */
  public async processEntities<T extends EntityWithImage>(
    repo: Repository<T>,
    entities: T[],
    entityType: 'Recipe' | 'Component' | 'Educational',
    fetchImageFn: (entity: T) => Promise<any>
  ): Promise<void> {
    const entitiesWithMissingImages = entities.filter(entity => this.hasMissingImage(entity));
    
    if (entitiesWithMissingImages.length === 0) {
      console.log(`✅ All ${entityType.toLowerCase()}s already have images`);
      return;
    }

    console.log(`🖼️  Processing ${entitiesWithMissingImages.length} ${entityType.toLowerCase()}s with missing images...`);
    let processed = 0;
    let successful = 0;

    for (const entity of entitiesWithMissingImages) {
      const entityName = this.getEntityName(entity);
      try {
        // Respect Pixabay rate limits
        await this.respectRateLimit();

        console.log(`🔍 [${entityType}] Fetching image for: "${entityName}"`);
        
        // Fetch image from Pixabay
        const image = await fetchImageFn(entity);
        
        if (image && image.url) {
          try {
            // Download image as buffer
            console.log(`⬇️  [${entityType}] Downloading image for "${entityName}"...`);
            const imageBuffer = await this.imageService.downloadImageAsBuffer(image.url);

            // Prepare for database storage
            const fileExtension = image.url.split('.').pop()?.split('?')[0] || 'jpg';
            const fileName = `${entity.id}.${fileExtension}`;
            const fileType = `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}` as StorageType;

            // Save to database
            console.log(`💾 [${entityType}] Saving image for "${entityName}" to database...`);
            const savedStorage = await this.storageService.saveFileToDb({
              fileName,
              fileType,
              buffer: imageBuffer
            }, repo.manager);

            // Update entity with new storage_id
            const newStorageLinks = {
              ...entity.storage_links,
              thumbnail: savedStorage.storage_id,
              attribution: image.attribution,
              photographer: image.photographer,
              photographer_profile: image.photographerProfile
            };

            entity.storage_links = newStorageLinks;
            await repo.save(entity);

            successful++;
            console.log(`✅ [${entityType}] Successfully updated "${entityName}" with storage ID: ${savedStorage.storage_id}`);
            
            // Small delay between successful operations
            await new Promise(resolve => setTimeout(resolve, 100));
            
          } catch (downloadError: any) {
            console.error(`❌ [${entityType}] Failed to download/save image for "${entityName}":`, downloadError.message);
            
            // Fallback to default placeholder
            entity.storage_links = {
              ...entity.storage_links,
              thumbnail: 'f4b20835-cb31-4893-9463-b9c89a5eaa3a'
            };
            await repo.save(entity);
            console.log(`🔄 [${entityType}] Set default placeholder for "${entityName}"`);
          }
        } else {
          console.log(`❌ [${entityType}] No image found for "${entityName}"`);
          
          // Set default placeholder for items without images
          entity.storage_links = {
            ...entity.storage_links,
            thumbnail: 'f4b20835-cb31-4893-9463-b9c89a5eaa3a'
          };
          await repo.save(entity);
          console.log(`🔄 [${entityType}] Set default placeholder for "${entityName}"`);
        }
        
      } catch (error: any) {
        console.error(`❌ [${entityType}] Error processing "${entityName}":`, error.message);
        
        // Handle rate limiting errors specifically
        if (error.response?.status === 429) {
          console.log(`⚠️  [${entityType}] Rate limited by Pixabay. Waiting 60 seconds...`);
          await new Promise(resolve => setTimeout(resolve, 60000));
          // Reset rate limiting counter
          this.requestCount = 0;
          this.windowStart = Date.now();
        }
      }
      
      processed++;
      if (processed % 10 === 0) {
        console.log(`📊 [${entityType}] Progress: ${processed}/${entitiesWithMissingImages.length} (${successful} successful)`);
      }
    }
    
    console.log(`🏁 [${entityType}] Completed: ${processed}/${entitiesWithMissingImages.length} processed, ${successful} successful`);
  }
}

async function bootstrap() {
  console.log('🚀 Starting Pixabay Image Fetcher...');
  console.log('📋 Following Pixabay API rate limits: 90 requests per 60 seconds');
  
  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });

  // Get repositories
  const recipeRepo = app.get<Repository<Recipe>>(getRepositoryToken(Recipe));
  const componentRepo = app.get<Repository<Component>>(getRepositoryToken(Component));
  const educationalRepo = app.get<Repository<EducationalContent>>(getRepositoryToken(EducationalContent));
  const storageService = app.get(StorageService);

  const fetcher = new PixabayImageFetcher(storageService);

  try {
    // Fetch all entities
    console.log('📚 Loading entities from database...');
    const [recipes, components, educationalContent] = await Promise.all([
      recipeRepo.find(),
      componentRepo.find(), 
      educationalRepo.find()
    ]);

    console.log(`📊 Found: ${recipes.length} recipes, ${components.length} components, ${educationalContent.length} educational content`);

    // Process components (ingredients)
    await fetcher.processEntities(
      componentRepo,
      components,
      'Component',
      async (component) => {
        // Clean up ingredient name for better search results
        const cleanName = component.name
          .replace(/\(.*?\)/g, '') // Remove parentheses content
          .replace(/Heart-Healthy/gi, '') // Remove heart-healthy prefix
          .replace(/Fresh /gi, '') // Remove "Fresh" prefix
          .replace(/Local Variety/gi, '') // Remove "Local Variety"
          .trim();
        
        return await fetcher.imageService.getIngredientImage(cleanName);
      }
    );

    // Process recipes
    await fetcher.processEntities(
      recipeRepo,
      recipes,
      'Recipe',
      async (recipe) => {
        return await fetcher.imageService.getRecipeImage(recipe.name);
      }
    );

    // Process educational content
    const educationalSearchTerms = {
      'Understanding Heart-Healthy Nutrition': 'heart healthy nutrition food',
      'Managing Sodium Intake': 'low sodium diet food',
      'The Mediterranean Diet for Heart Health': 'mediterranean diet healthy',
      'Exercise and Your Heart': 'cardio exercise heart health',
      'Meal Planning for Heart Health': 'meal planning healthy diet'
    };

    await fetcher.processEntities(
      educationalRepo,
      educationalContent,
      'Educational',
      async (content) => {
        const searchTerm = educationalSearchTerms[content.title] || 'healthy lifestyle nutrition';
        return await fetcher.imageService.getEducationalImage(searchTerm);
      }
    );

  } catch (error) {
    console.error('❌ Fatal error:', error);
  } finally {
    await app.close();
    console.log('✅ Pixabay Image Fetcher completed!');
    process.exit(0);
  }
}

bootstrap().catch(err => {
  console.error('💥 Script failed:', err);
  process.exit(1);
}); 