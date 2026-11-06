import { Injectable } from '@angular/core';

export interface VisitorStats {
  total: number;
  today: number;
}

@Injectable({
  providedIn: 'root'
})
export class VisitorCounterService {
  private readonly BASE_URL = 'https://countapi.mileshilliard.com/api/v1';
  private readonly TOTAL_KEY = 'chministries-nbc2026-total-visitors';
  private readonly SESSION_STORAGE_KEY = 'nbc2026_visit_recorded';
  private readonly LOCAL_TOTAL_CACHE = 'nbc2026_cached_total';
  private readonly LOCAL_TODAY_CACHE = 'nbc2026_cached_today';

  private cachedStats: VisitorStats = {
    total: 1,
    today: 1
  };

  constructor() {
    this.loadFromLocalCache();
    this.recordVisit();
  }

  /**
   * Format today's date string: YYYY-MM-DD
   */
  private getTodayKey(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `chministries-nbc2026-daily-${year}-${month}-${day}`;
  }

  private loadFromLocalCache(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const savedTotal = localStorage.getItem(this.LOCAL_TOTAL_CACHE);
      const savedToday = localStorage.getItem(this.LOCAL_TODAY_CACHE);
      if (savedTotal) this.cachedStats.total = parseInt(savedTotal, 10) || 1;
      if (savedToday) this.cachedStats.today = parseInt(savedToday, 10) || 1;
    } catch {
      // Ignore storage access errors
    }
  }

  private saveToLocalCache(stats: VisitorStats): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(this.LOCAL_TOTAL_CACHE, stats.total.toString());
      localStorage.setItem(this.LOCAL_TODAY_CACHE, stats.today.toString());
    } catch {
      // Ignore storage access errors
    }
  }

  /**
   * Record visit once per browser session
   */
  public async recordVisit(): Promise<void> {
    if (typeof sessionStorage === 'undefined') return;

    try {
      const alreadyRecorded = sessionStorage.getItem(this.SESSION_STORAGE_KEY);
      const todayKey = this.getTodayKey();

      if (!alreadyRecorded) {
        sessionStorage.setItem(this.SESSION_STORAGE_KEY, 'true');

        // Increment both total and daily counter
        const [totalRes, todayRes] = await Promise.allSettled([
          this.fetchHit(this.TOTAL_KEY),
          this.fetchHit(todayKey)
        ]);

        if (totalRes.status === 'fulfilled' && totalRes.value > 0) {
          this.cachedStats.total = totalRes.value;
        }
        if (todayRes.status === 'fulfilled' && todayRes.value > 0) {
          this.cachedStats.today = todayRes.value;
        }

        this.saveToLocalCache(this.cachedStats);
      }
    } catch (err) {
      console.warn('Could not record visit counter:', err);
    }
  }

  /**
   * Fetch current stats for the popup modal
   */
  public async getStats(): Promise<VisitorStats> {
    const todayKey = this.getTodayKey();

    try {
      const [totalVal, todayVal] = await Promise.all([
        this.fetchGet(this.TOTAL_KEY),
        this.fetchGet(todayKey)
      ]);

      if (totalVal > 0) this.cachedStats.total = totalVal;
      if (todayVal > 0) this.cachedStats.today = todayVal;

      this.saveToLocalCache(this.cachedStats);
    } catch {
      // Fallback to cached stats
    }

    return { ...this.cachedStats };
  }

  private async fetchHit(key: string): Promise<number> {
    try {
      const res = await fetch(`${this.BASE_URL}/hit/${key}`);
      if (!res.ok) return 0;
      const data = await res.json();
      return typeof data.value === 'number' ? data.value : 0;
    } catch {
      return 0;
    }
  }

  private async fetchGet(key: string): Promise<number> {
    try {
      const res = await fetch(`${this.BASE_URL}/get/${key}`);
      if (res.status === 404) return 0;
      if (!res.ok) return 0;
      const data = await res.json();
      return typeof data.value === 'number' ? data.value : 0;
    } catch {
      return 0;
    }
  }
}

