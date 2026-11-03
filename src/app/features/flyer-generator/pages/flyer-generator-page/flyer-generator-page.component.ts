import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlyerIntroComponent } from '../../components/flyer-intro/flyer-intro.component';
import { PhotoUploadComponent } from '../../components/photo-upload/photo-upload.component';
import { PhotoEditorComponent } from '../../components/photo-editor/photo-editor.component';
import { NameInputComponent } from '../../components/name-input/name-input.component';
import { FlyerPreviewComponent } from '../../components/flyer-preview/flyer-preview.component';
import { GenerationControlsComponent } from '../../components/generation-controls/generation-controls.component';
import { DownloadPanelComponent } from '../../components/download-panel/download-panel.component';
import { FlyerRendererService } from '../../../../core/services/flyer-renderer.service';
import { ImageUploadService } from '../../../../core/services/image-upload.service';
import { DownloadService } from '../../../../core/services/download.service';
import { PhotoCropConfig } from '../../../../core/models/flyer.model';
import { DEFAULT_CROP_CONFIG } from '../../../../core/constants/flyer-config';

@Component({
  selector: 'app-flyer-generator-page',
  standalone: true,
  imports: [
    CommonModule,
    FlyerIntroComponent,
    PhotoUploadComponent,
    PhotoEditorComponent,
    NameInputComponent,
    FlyerPreviewComponent,
    GenerationControlsComponent,
    DownloadPanelComponent
  ],
  templateUrl: './flyer-generator-page.component.html',
  styleUrl: './flyer-generator-page.component.css'
})
export class FlyerGeneratorPageComponent implements OnInit, OnDestroy {
  selectedImage: File | null = null;
  imagePreviewUrl: string | null = null;
  memberName = '';
  cropConfig: PhotoCropConfig = { ...DEFAULT_CROP_CONFIG };

  isGenerating = false;
  generatedBlob: Blob | null = null;
  generatedUrl: string | null = null;
  generatedFileName = 'November-Blessing-2026-Flyer.png';
  canShare = false;

  get isPhotoUploaded(): boolean {
    return !!this.imagePreviewUrl;
  }

  get isNameValid(): boolean {
    return this.memberName.trim().length > 0;
  }

  constructor(
    private rendererService: FlyerRendererService,
    private imageUploadService: ImageUploadService,
    private downloadService: DownloadService
  ) {}

  ngOnInit(): void {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        const dummyFile = new File([''], 'test.png', { type: 'image/png' });
        this.canShare = this.downloadService.canShareFiles(dummyFile);
      } catch {
        this.canShare = false;
      }
    }
  }

  ngOnDestroy(): void {
    this.cleanupUrls();
    this.imageUploadService.cleanup();
  }

  async onPhotoSelected(file: File): Promise<void> {
    this.cleanupUrls();
    this.selectedImage = file;
    this.imagePreviewUrl = URL.createObjectURL(file);
    this.cropConfig = { ...DEFAULT_CROP_CONFIG };
  }

  onPhotoRemoved(): void {
    this.cleanupUrls();
    this.selectedImage = null;
    this.imagePreviewUrl = null;
    this.cropConfig = { ...DEFAULT_CROP_CONFIG };
    this.clearGenerated();
  }

  onUploadError(errorMsg: string): void {
    alert(errorMsg);
  }

  onCropChanged(crop: PhotoCropConfig): void {
    this.cropConfig = { ...crop };
    if (this.generatedUrl) {
      this.clearGenerated();
    }
  }

  onNameChanged(name: string): void {
    this.memberName = name;
    if (this.generatedUrl) {
      this.clearGenerated();
    }
  }

  async onGenerate(): Promise<void> {
    try {
      this.isGenerating = true;
      this.clearGenerated();

      const blob = await this.rendererService.generateBlob(
        this.imagePreviewUrl,
        this.memberName,
        this.cropConfig
      );

      this.generatedBlob = blob;
      this.generatedUrl = URL.createObjectURL(blob);
      this.generatedFileName = this.downloadService.generateFileName(this.memberName);

      // Auto trigger download
      this.onDownload();
    } catch (err) {
      console.error('Generation error:', err);
      alert("We couldn't generate your flyer. Please try again.");
    } finally {
      this.isGenerating = false;
    }
  }

  onDownload(): void {
    if (!this.generatedBlob) return;
    this.downloadService.downloadBlob(this.generatedBlob, this.generatedFileName);
  }

  async onShare(): Promise<void> {
    if (!this.generatedBlob) return;
    try {
      const file = new File([this.generatedBlob], this.generatedFileName, { type: 'image/png' });
      await this.downloadService.shareFile(
        file,
        'November Blessing Conference 2026',
        'I will be Attending November Blessing Conference 2026: Powered Witness (Acts 1:8)!'
      );
    } catch (err) {
      console.warn('Share error:', err);
    }
  }

  private clearGenerated(): void {
    if (this.generatedUrl) {
      URL.revokeObjectURL(this.generatedUrl);
      this.generatedUrl = null;
    }
    this.generatedBlob = null;
  }

  private cleanupUrls(): void {
    if (this.imagePreviewUrl) {
      URL.revokeObjectURL(this.imagePreviewUrl);
      this.imagePreviewUrl = null;
    }
    this.clearGenerated();
  }
}
