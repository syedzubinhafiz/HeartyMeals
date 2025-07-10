import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Repository } from 'typeorm';
import axios from 'axios';
import { StorageService } from '../storage/storage.service';
import { Recipe } from '../recipe/recipe.entity';
import { Component } from '../component/component.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StorageType } from '../storage/enum/storage.enum';
import { ImageService } from '../db/seeds/image.service';

/*
  One-off maintenance script.
  Finds any Recipe or Component whose storage_links.thumbnail is an external URL (starts with "http")
  – Downloads the image
  – Stores it through StorageService.saveFileToDb (binary -> storage row)
  – Replaces thumbnail with the returned storage_id

  Run with:
    npx ts-node -r tsconfig-paths/register src/scripts/fix-external-thumbnails.ts
*/

async function processEntity<T extends { storage_links: any; name?: string }>(
  repo: Repository<T>,
  storage: StorageService,
  label: string,
  imageService: ImageService,
) {
  const entities = await repo.find();
  let fixed = 0;
  for (const entity of entities) {
    const thumb = entity.storage_links?.thumbnail;
    if (typeof thumb === 'string' && thumb.startsWith('http')) {
      try {
        // --- rudimentary rate-limit (max 90 per minute) ---
        if (globalThis.__reqCount == null) {
          (globalThis as any).__reqCount = 0;
          (globalThis as any).__windowStart = Date.now();
        }
        const windowStart: number = (globalThis as any).__windowStart;
        let reqCount: number = (globalThis as any).__reqCount;

        if (Date.now() - windowStart > 60000) {
          // reset window
          (globalThis as any).__windowStart = Date.now();
          reqCount = 0;
        }
        if (reqCount >= 90) {
          const waitMs = 60000 - (Date.now() - windowStart);
          console.log(`⏳ Rate limit hit. Waiting ${Math.ceil(waitMs/1000)}s...`);
          await new Promise(res => setTimeout(res, waitMs));
          (globalThis as any).__windowStart = Date.now();
          reqCount = 0;
        }
        (globalThis as any).__reqCount = reqCount + 1;

        console.log(`[${label}] Downloading ${thumb}`);
        const response = await axios.get<ArrayBuffer>(thumb, { responseType: 'arraybuffer', timeout: 15000 });
        const urlParts = thumb.split('/');
        const fileNameRaw = urlParts[urlParts.length - 1].split('?')[0];
        const fileExt = (fileNameRaw.split('.').pop() || 'jpg').toLowerCase();
        const safeName = `${(entity as any).id || Date.now()}.${fileExt}`;
        const fileType: StorageType = (`image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`) as StorageType;

        const saved = await storage.saveFileToDb({
          fileName: safeName,
          fileType,
          buffer: Buffer.from(response.data),
        }, repo.manager);

        // update thumbnail to storage id
        entity.storage_links.thumbnail = saved.storage_id;
        await repo.save(entity);
        fixed += 1;
        console.log(`[${label}] Updated ${entity['name'] || entity['id']} → ${saved.storage_id}`);
      } catch (error: any) {
        if (error.response?.status === 429) {
          console.warn(`⚠️  Rate limited (429). Waiting 60s before retry...`);
          await new Promise(res => setTimeout(res, 60000));
          // push entity back to end of list for retry
          entities.push(entity);
        } else if (error.response?.status === 400) {
          // Attempt to fetch a fresh image from Pixabay via ImageService
          let newImage = null;
          if (label === 'Recipe') {
            newImage = await imageService.getRecipeImage((entity as any).name || '');
          } else {
            newImage = await imageService.getIngredientImage((entity as any).name || '');
          }

          if (newImage && newImage.url && typeof newImage.url === 'string') {
            console.log(`[${label}] Retrying with fresh search result for "${(entity as any).name}"`);
            entities.push({ ...(entity as any), storage_links: { ...entity.storage_links, thumbnail: newImage.url } });
          } else {
            // fallback to default placeholder id
            entity.storage_links.thumbnail = 'f4b20835-cb31-4893-9463-b9c89a5eaa3a';
            await repo.save(entity);
            console.log(`[${label}] Set default thumbnail for ${(entity as any).name}`);
          }
        } else {
          console.error(`[${label}] Failed for ${thumb}:`, error.message);
        }
      }
    }
  }
  console.log(`[${label}] Completed. Fixed ${fixed}/${entities.length}.`);
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });

  const recipeRepo = app.get<Repository<Recipe>>(getRepositoryToken(Recipe));
  const componentRepo = app.get<Repository<Component>>(getRepositoryToken(Component));
  const storageService = app.get(StorageService);
  const imageService = new ImageService();

  await processEntity(recipeRepo, storageService, 'Recipe', imageService);
  await processEntity(componentRepo, storageService, 'Component', imageService);

  await app.close();
  process.exit(0);
}

bootstrap().catch(err => {
  console.error('Thumbnail fix script failed:', err);
  process.exit(1);
}); 