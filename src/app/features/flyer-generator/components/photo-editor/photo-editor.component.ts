import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoCropConfig } from '../../../../core/models/flyer.model';

@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css'
})
export class PhotoEditorComponent {
  @Input() selectedImageUrl: string | null = null;
  @Input() cropConfig: PhotoCropConfig = { zoom: 1.0, offsetX: 0, offsetY: 0 };

  @Output() cropChanged = new EventEmitter<PhotoCropConfig>();

  private readonly STEP = 18; // px per tap

  move(dx: number, dy: number): void {
    this.cropConfig = {
      ...this.cropConfig,
      offsetX: this.cropConfig.offsetX + dx,
      offsetY: this.cropConfig.offsetY + dy
    };
    this.cropChanged.emit(this.cropConfig);
  }

  onZoomChange(zoom: number): void {
    const val = Math.min(3.0, Math.max(0.6, Math.round(zoom * 100) / 100));
    this.cropConfig = { ...this.cropConfig, zoom: val };
    this.cropChanged.emit(this.cropConfig);
  }

  onSliderInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.onZoomChange(parseFloat(input.value));
  }

  zoomIn(): void {
    const nextZoom = Math.min(3.0, Math.round((this.cropConfig.zoom + 0.1) * 10) / 10);
    this.onZoomChange(nextZoom);
  }

  zoomOut(): void {
    const nextZoom = Math.max(0.6, Math.round((this.cropConfig.zoom - 0.1) * 10) / 10);
    this.onZoomChange(nextZoom);
  }
}
