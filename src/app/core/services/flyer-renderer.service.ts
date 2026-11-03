import { Injectable } from '@angular/core';
import { FLYER_CONFIG } from '../constants/flyer-config';
import { PhotoCropConfig } from '../models/flyer.model';

@Injectable({
  providedIn: 'root'
})
export class FlyerRendererService {
  private templateImageCache: HTMLImageElement | null = null;
  private templateLoadingPromise: Promise<HTMLImageElement> | null = null;
  private userImageCache = new Map<string, HTMLImageElement>();

  constructor() {
    // Preload template image immediately
    this.preloadTemplate();
  }

  /**
   * Preload and cache the official flyer artwork
   */
  public preloadTemplate(): Promise<HTMLImageElement> {
    if (this.templateImageCache) {
      return Promise.resolve(this.templateImageCache);
    }
    if (this.templateLoadingPromise) {
      return this.templateLoadingPromise;
    }

    this.templateLoadingPromise = new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.templateImageCache = img;
        this.templateLoadingPromise = null;
        resolve(img);
      };
      img.onerror = (err) => {
        this.templateLoadingPromise = null;
        reject(new Error('Failed to load conference flyer template.'));
      };
      img.src = FLYER_CONFIG.templateImagePath;
    });

    return this.templateLoadingPromise;
  }

  /**
   * Loads an image from URL or object URL with memory caching
   */
  private loadImage(src: string): Promise<HTMLImageElement> {
    if (this.userImageCache.has(src)) {
      return Promise.resolve(this.userImageCache.get(src)!);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.userImageCache.set(src, img);
        resolve(img);
      };
      img.onerror = () => {
        reject(new Error('Failed to load image.'));
      };
      img.src = src;
    });
  }

  /**
   * Renders the complete personalized composition onto an HTMLCanvasElement
   */
  async renderComposition(
    canvas: HTMLCanvasElement,
    photoUrl: string | null,
    memberName: string,
    cropConfig: PhotoCropConfig
  ): Promise<void> {
    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) {
      throw new Error('Canvas 2D context not available.');
    }

    // Ensure custom fonts are ready
    if ('fonts' in document) {
      try {
        await document.fonts.ready;
      } catch {
        // Fallback to system fonts if font loading fails
      }
    }

    const templateImg = await this.preloadTemplate();

    // Match canvas dimensions to the master template
    const width = templateImg.naturalWidth || FLYER_CONFIG.canvasWidth;
    const height = templateImg.naturalHeight || FLYER_CONFIG.canvasHeight;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    // 1. Draw master template background
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(templateImg, 0, 0, width, height);

    // 2. Draw circular portrait if photo is uploaded
    if (photoUrl) {
      try {
        const photoImg = await this.loadImage(photoUrl);
        this.drawCircularPhoto(ctx, photoImg, cropConfig);
      } catch (err) {
        console.warn('Could not render user photograph:', err);
      }
    }

    // 3. Draw Name Banner
    const trimmedName = memberName.trim();
    this.drawNameBanner(ctx, trimmedName || 'Name');
  }

  /**
   * Crops and positions the user photograph inside the designated circular area
   */
  private drawCircularPhoto(
    ctx: CanvasRenderingContext2D,
    photoImg: HTMLImageElement,
    cropConfig: PhotoCropConfig
  ): void {
    const { centerX, centerY, radius } = FLYER_CONFIG.portrait;
    const diameter = radius * 2;

    ctx.save();

    // Create circular clip path
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    // High quality image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Calculate scaling to fill circle without distortion (aspect-fill)
    const imgW = photoImg.naturalWidth || photoImg.width;
    const imgH = photoImg.naturalHeight || photoImg.height;
    const baseScale = Math.max(diameter / imgW, diameter / imgH);
    const effectiveScale = baseScale * Math.max(0.5, cropConfig.zoom);

    const destW = imgW * effectiveScale;
    const destH = imgH * effectiveScale;

    // Center photo in circle + apply user offsets
    const destX = centerX - destW / 2 + cropConfig.offsetX;
    const destY = centerY - destH / 2 + cropConfig.offsetY;

    ctx.drawImage(photoImg, destX, destY, destW, destH);

    ctx.restore();
  }

  /**
   * Replaces the [FULL NAME] area with a clean gold banner and member's name
   */
  private drawNameBanner(ctx: CanvasRenderingContext2D, name: string): void {
    const { x, y, width, height, backgroundColor, borderRadius } = FLYER_CONFIG.nameBanner;
    const { fontFamily, fontWeight, initialFontSize, minFontSize, maxFontSize, textColor, letterSpacing } = FLYER_CONFIG.typography;

    ctx.save();

    // 1. Draw crisp rounded gold banner to cleanly cover placeholder
    ctx.fillStyle = backgroundColor;
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === 'function') {
      (ctx as any).roundRect(x, y, width, height, borderRadius);
    } else {
      ctx.rect(x, y, width, height);
    }
    ctx.fill();

    // 2. Prepare text styling
    const textToRender = name.toUpperCase();
    const maxTextWidth = width - 28; // 14px padding on each side
    let currentFontSize = Math.min(initialFontSize, maxFontSize);

    // Dynamic font size fitting
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = textColor;
    if ('letterSpacing' in ctx) {
      (ctx as any).letterSpacing = `${letterSpacing}px`;
    }

    ctx.font = `${fontWeight} ${currentFontSize}px ${fontFamily}`;
    let measuredWidth = ctx.measureText(textToRender).width;

    while (measuredWidth > maxTextWidth && currentFontSize > minFontSize) {
      currentFontSize -= 1;
      ctx.font = `${fontWeight} ${currentFontSize}px ${fontFamily}`;
      measuredWidth = ctx.measureText(textToRender).width;
    }

    // 3. Render name centered in the banner
    const bannerCenterX = x + width / 2;
    const bannerCenterY = y + height / 2 + 1; // optical center adjustment

    ctx.fillText(textToRender, bannerCenterX, bannerCenterY);

    ctx.restore();
  }

  /**
   * Generates a high-quality PNG Blob from current flyer settings
   */
  async generateBlob(
    photoUrl: string | null,
    memberName: string,
    cropConfig: PhotoCropConfig
  ): Promise<Blob> {
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = FLYER_CONFIG.canvasWidth;
    offscreenCanvas.height = FLYER_CONFIG.canvasHeight;

    await this.renderComposition(offscreenCanvas, photoUrl, memberName, cropConfig);

    return new Promise((resolve, reject) => {
      offscreenCanvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas export to PNG failed.'));
          }
        },
        'image/png',
        1.0
      );
    });
  }
}

