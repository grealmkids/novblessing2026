import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-generation-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generation-controls.component.html',
  styleUrl: './generation-controls.component.css'
})
export class GenerationControlsComponent {
  @Input() isPhotoUploaded = false;
  @Input() isNameValid = false;
  @Input() isGenerating = false;

  @Output() generateRequested = new EventEmitter<void>();

  onGenerate(): void {
    this.generateRequested.emit();
  }
}
