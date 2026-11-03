import { Injectable } from '@angular/core';
import { UPLOAD_CONSTRAINTS } from '../constants/flyer-config';

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  file?: File;
  previewUrl?: string;
  width?: number;
  height?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private activeObjectUrls: Set<string> = new Set();

  /**
   * Validates file size, MIME type and decodes image in memory
   */
  async validateAndLoadImage(file: File): Promise<ImageValidationResult> {
    if (!file) {
      return { valid: false, error: 'No photograph was selected.' };
    }

    // Check size limit
    if (file.size > UPLOAD_CONSTRAINTS.maxSizeBytes) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      return {
        valid: false,
        error: `File size (${sizeMB} MB) exceeds the maximum limit of 10 MB. Please choose a smaller photo.`
      };
    }

    // Check file type
    const fileType = file.type.toLowerCase();
    const isAcceptedType = UPLOAD_CONSTRAINTS.acceptedMimeTypes.includes(fileType);
    const fileName = file.name.toLowerCase();
    const hasAcceptedExt = UPLOAD_CONSTRAINTS.acceptedExtensions.some(ext => fileName.endsWith(ext));

    if (!isAcceptedType && !hasAcceptedExt) {
      return {
        valid: false,
        error: 'Unsupported format. Please upload a JPEG, PNG, or WebP photograph.'
      };
    }

    // Verify browser can decode image
    try {
      const objectUrl = URL.createObjectURL(file);
      this.activeObjectUrls.add(objectUrl);

      const dimensions = await this.getImageDimensions(objectUrl);
      return {
        valid: true,
        file,
        previewUrl: objectUrl,
        width: dimensions.width,
        height: dimensions.height
      };
    } catch {
      return {
        valid: false,
        error: 'Unable to decode this image. The file may be damaged or unsupported.'
      };
    }
  }

  /**
   * Tests image loading and extracts natural dimensions
   */
  private getImageDimensions(url: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        reject(new Error('Image failed to load'));
      };
      img.src = url;
    });
  }

  /**
   * Revokes a specific object URL to prevent memory leaks
   */
  revokeUrl(url: string | null): void {
    if (url && this.activeObjectUrls.has(url)) {
      URL.revokeObjectURL(url);
      this.activeObjectUrls.delete(url);
    }
  }

  /**
   * Cleans up all active object URLs created by this service
   */
  cleanup(): void {
    this.activeObjectUrls.forEach(url => URL.revokeObjectURL(url));
    this.activeObjectUrls.clear();
  }
}

