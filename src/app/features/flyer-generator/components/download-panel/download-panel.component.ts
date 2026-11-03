import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-download-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './download-panel.component.html',
  styleUrl: './download-panel.component.css'
})
export class DownloadPanelComponent {
  @Input() generatedUrl: string | null = null;
  @Input() fileName = 'November-Blessing-2026-Flyer.png';
  @Input() canShare = false;

  @Output() downloadRequested = new EventEmitter<void>();
  @Output() shareRequested = new EventEmitter<void>();

  onDownload(): void {
    this.downloadRequested.emit();
  }

  onShare(): void {
    this.shareRequested.emit();
  }
}
