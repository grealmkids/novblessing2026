import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { FlyerRendererService } from '../../../../core/services/flyer-renderer.service';
import { PhotoCropConfig } from '../../../../core/models/flyer.model';

@Component({
  selector: 'app-flyer-preview',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './flyer-preview.component.html',
  styleUrl: './flyer-preview.component.css'
})
export class FlyerPreviewComponent implements AfterViewInit, OnChanges {
  @Input() photoUrl: string | null = null;
  @Input() memberName = '';
  @Input() cropConfig: PhotoCropConfig = { zoom: 1.0, offsetX: 0, offsetY: 0 };
  @Input() isGenerating = false;

  @ViewChild('previewCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  isLoading = true;
  hasError = false;

  constructor(private rendererService: FlyerRendererService) {}

  ngAfterViewInit(): void {
    this.render();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.canvasRef) {
      this.render();
    }
  }

  private async render(): Promise<void> {
    if (!this.canvasRef) return;

    try {
      this.isLoading = true;
      this.hasError = false;
      await this.rendererService.renderComposition(
        this.canvasRef.nativeElement,
        this.photoUrl,
        this.memberName,
        this.cropConfig
      );
    } catch (err) {
      console.error('Error rendering preview canvas:', err);
      this.hasError = true;
    } finally {
      this.isLoading = false;
    }
  }
}

