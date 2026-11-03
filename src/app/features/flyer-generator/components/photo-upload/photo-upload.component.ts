import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploadService } from '../../../../core/services/image-upload.service';

@Component({
  selector: 'app-photo-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-upload.component.html',
  styleUrl: './photo-upload.component.css'
})
export class PhotoUploadComponent {
  @Input() currentPreviewUrl: string | null = null;
  @Input() isLoading = false;
  @Input() hasError = false;
  @Input() errorMessage = '';

  @Output() photoSelected = new EventEmitter<File>();
  @Output() photoRemoved = new EventEmitter<void>();
  @Output() uploadError = new EventEmitter<string>();

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  constructor(private imageUploadService: ImageUploadService) {}

  triggerFileInput(): void {
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.click();
    }
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      await this.processFile(input.files[0]);
    }
    input.value = '';
  }

  private async processFile(file: File): Promise<void> {
    const result = await this.imageUploadService.validateAndLoadImage(file);
    if (result.valid && result.file) {
      this.hasError = false;
      this.photoSelected.emit(result.file);
    } else {
      this.uploadError.emit(result.error || 'Invalid photograph format.');
    }
  }

  removePhoto(event: Event): void {
    event.stopPropagation();
    this.photoRemoved.emit();
  }
}
