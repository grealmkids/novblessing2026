import { Component, HostListener } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { VisitorCounterService } from '../../../core/services/visitor-counter.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './app-footer.component.html',
  styleUrl: './app-footer.component.css'
})
export class AppFooterComponent {
  isModalOpen = false;
  isLoading = false;
  totalVisits = 0;
  todayVisits = 0;

  constructor(private counterService: VisitorCounterService) {}

  async openVisitorModal(): Promise<void> {
    this.isModalOpen = true;
    this.isLoading = true;

    try {
      const stats = await this.counterService.getStats();
      this.totalVisits = stats.total;
      this.todayVisits = stats.today;
    } finally {
      this.isLoading = false;
    }
  }

  closeVisitorModal(): void {
    this.isModalOpen = false;
  }

  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    if (this.isModalOpen) {
      this.closeVisitorModal();
    }
  }
}
