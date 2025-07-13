import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as crypto from 'crypto';

export interface SupabaseImageUpload {
  url: string;
  path: string;
  publicUrl: string;
}

@Injectable()
export class SupabaseStorageService {
  private readonly logger = new Logger(SupabaseStorageService.name);
  private supabase: SupabaseClient;
  private readonly bucketName = 'recipe-images';
  
  constructor() {
    // Initialize Supabase client using connection details from POSTGRES_URL
    const supabaseUrl = 'https://ktrhmzwkilyqdrwsbwij.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0cmhtendraWx5cWRyd3Nid2lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNjA3ODcsImV4cCI6MjA2NzczNjc4N30.T_L6I01q4KKJOwtzsIZN-oh16LVkDp9JkTYTr_Z997Q';
    
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  /**
   * Downloads an image from a URL and uploads it to Supabase Storage
   * @param imageUrl - The external image URL to download
   * @param fileName - Optional custom filename, if not provided will generate one
   * @returns Promise with upload result containing public URL
   */
  async downloadAndUploadImage(imageUrl: string, fileName?: string): Promise<SupabaseImageUpload> {
    try {
      this.logger.log(`Downloading image from: ${imageUrl}`);
      
      // Download the image
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 30000,
        headers: {
          'User-Agent': 'ChronicDiet-WebApp/1.0'
        }
      });

      // Generate filename if not provided
      if (!fileName) {
        const urlParts = imageUrl.split('/');
        const originalName = urlParts[urlParts.length - 1].split('?')[0];
        const extension = this.getFileExtension(originalName) || 'jpg';
        const hash = crypto.createHash('md5').update(imageUrl).digest('hex').slice(0, 8);
        fileName = `${hash}-${Date.now()}.${extension}`;
      }

      // Create the file path in the bucket
      const filePath = `recipes/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(filePath, response.data, {
          contentType: this.getContentType(fileName),
          upsert: false
        });

      if (error) {
        throw new Error(`Supabase upload error: ${error.message}`);
      }

      // Get the public URL
      const { data: publicUrlData } = this.supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      const result: SupabaseImageUpload = {
        url: imageUrl,
        path: filePath,
        publicUrl: publicUrlData.publicUrl
      };

      this.logger.log(`Successfully uploaded image to: ${result.publicUrl}`);
      return result;

    } catch (error) {
      this.logger.error(`Failed to download and upload image from ${imageUrl}:`, error.message);
      throw error;
    }
  }

  /**
   * Uploads a buffer directly to Supabase Storage
   * @param buffer - Image buffer data
   * @param fileName - Filename for the uploaded file
   * @param contentType - MIME type of the file
   * @returns Promise with upload result
   */
  async uploadBuffer(buffer: Buffer, fileName: string, contentType: string): Promise<SupabaseImageUpload> {
    try {
      const filePath = `recipes/${fileName}`;

      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(filePath, buffer, {
          contentType,
          upsert: false
        });

      if (error) {
        throw new Error(`Supabase upload error: ${error.message}`);
      }

      const { data: publicUrlData } = this.supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      return {
        url: '',
        path: filePath,
        publicUrl: publicUrlData.publicUrl
      };

    } catch (error) {
      this.logger.error(`Failed to upload buffer:`, error.message);
      throw error;
    }
  }

  /**
   * Deletes a file from Supabase Storage
   * @param filePath - The path of the file to delete
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      const { error } = await this.supabase.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) {
        throw new Error(`Failed to delete file: ${error.message}`);
      }

      this.logger.log(`Successfully deleted file: ${filePath}`);
    } catch (error) {
      this.logger.error(`Failed to delete file ${filePath}:`, error.message);
      throw error;
    }
  }

  /**
   * Lists files in the bucket
   * @param folder - Optional folder to list files from
   */
  async listFiles(folder?: string): Promise<any[]> {
    try {
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .list(folder || '');

      if (error) {
        throw new Error(`Failed to list files: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      this.logger.error(`Failed to list files:`, error.message);
      throw error;
    }
  }

  /**
   * Gets the public URL for a file in Supabase Storage
   * @param filePath - The path of the file
   */
  getPublicUrl(filePath: string): string {
    const { data } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  }

  /**
   * Batch process multiple images
   * @param imageUrls - Array of image URLs to process
   * @param batchSize - Number of images to process in each batch
   * @param delayBetweenBatches - Delay in milliseconds between batches
   */
  async batchProcessImages(
    imageUrls: string[], 
    batchSize: number = 5, 
    delayBetweenBatches: number = 1000
  ): Promise<SupabaseImageUpload[]> {
    const results: SupabaseImageUpload[] = [];
    
    this.logger.log(`Processing ${imageUrls.length} images in batches of ${batchSize}`);
    
    for (let i = 0; i < imageUrls.length; i += batchSize) {
      const batch = imageUrls.slice(i, i + batchSize);
      
      this.logger.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(imageUrls.length / batchSize)}`);
      
      const batchPromises = batch.map(async (url) => {
        try {
          return await this.downloadAndUploadImage(url);
        } catch (error) {
          this.logger.error(`Failed to process ${url}:`, error.message);
          return null;
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults.filter(result => result !== null));
      
      // Delay between batches to avoid rate limiting
      if (i + batchSize < imageUrls.length) {
        this.logger.log(`Waiting ${delayBetweenBatches}ms before next batch...`);
        await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
      }
    }
    
    this.logger.log(`Successfully processed ${results.length}/${imageUrls.length} images`);
    return results;
  }

  private getFileExtension(fileName: string): string {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : 'jpg';
  }

  private getContentType(fileName: string): string {
    const extension = this.getFileExtension(fileName);
    
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'webp':
        return 'image/webp';
      case 'gif':
        return 'image/gif';
      default:
        return 'image/jpeg';
    }
  }
}