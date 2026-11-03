import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  /**
   * Generates a clean, sanitized filename according to PRD specification:
   * November-Blessing-2026-[Member-Name].png
   */
  generateFileName(memberName: string): string {
    const trimmed = memberName.trim();
    if (!trimmed) {
      return 'November-Blessing-2026-Flyer.png';
    }

    // Replace spaces with hyphens and sanitize unsafe filename characters
    const sanitizedName = trimmed
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9\-_]/g, '');

    return `November-Blessing-2026-${sanitizedName || 'Personalized'}.png`;
  }

  /**
   * Triggers an automatic download of the PNG Blob in the browser
   */
  downloadBlob(blob: Blob, filename: string): void {
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Defer revocation to ensure browser has started download stream
    setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 2000);
  }

  /**
   * Checks whether the current browser supports Web Share API with files
   */
  canShareFiles(file: File): boolean {
    if (typeof navigator !== 'undefined' && 'share' in navigator && 'canShare' in navigator) {
      try {
        return navigator.canShare({ files: [file] });
      } catch {
        return false;
      }
    }
    return false;
  }

  /**
   * Invokes native sharing on supported mobile/desktop devices
   */
  async shareFile(file: File, title: string, text: string): Promise<boolean> {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          files: [file],
          title,
          text
        });
        return true;
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('Native share failed:', err);
        }
        return false;
      }
    }
    return false;
  }
}

