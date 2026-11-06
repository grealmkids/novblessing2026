import { Component, HostListener } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { VisitorCounterService, VisitorStats } from '../../../core/services/visitor-counter.service';

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

  uniqueVisitors = 0;
  returnVisitors = 0;
  todayVisitors = 0;
  totalVisits = 0;

  constructor(private counterService: VisitorCounterService) {}

  async openVisitorModal(): Promise<void> {
    const inputPassword = window.prompt('Enter password to view analytics:');
    if (inputPassword === null) {
      return;
    }

    if (inputPassword !== 'JesusChrist') {
      window.alert('Incorrect password.');
      return;
    }

    this.isModalOpen = true;
    this.isLoading = true;

    try {
      const stats: VisitorStats = await this.counterService.getStats();
      this.uniqueVisitors = stats.uniqueVisitors;
      this.returnVisitors = stats.returnVisitors;
      this.todayVisitors = stats.todayVisitors;
      this.totalVisits = stats.totalVisits;
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
