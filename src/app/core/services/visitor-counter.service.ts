import { Injectable } from '@angular/core';

export interface VisitorStats {
  uniqueVisitors: number;   // First-time unique individuals
  returnVisitors: number;   // Return visits from past visitors
  todayVisitors: number;    // Unique people who visited today
  totalVisits: number;      // Total visits (unique + returning)
}

@Injectable({
  providedIn: 'root'
})
export class VisitorCounterService {
  private readonly BASE_URL = 'https://countapi.mileshilliard.com/api/v1';

  // Distinct namespace keys for accurate conference tracking
  private readonly KEY_UNIQUE = 'chministries-nbc2026-unique-v3';
  private readonly KEY_RETURNING = 'chministries-nbc2026-returning-v3';

  // Browser storage keys
  private readonly LS_FIRST_VISIT = 'nbc2026_first_visit_flag';
  private readonly SS_SESSION_LOGGED = 'nbc2026_session_active';
  private readonly LS_STATS_CACHE = 'nbc2026_stats_cache';

  private cachedStats: VisitorStats = {
    uniqueVisitors: 1,
    returnVisitors: 0,
    todayVisitors: 1,
    totalVisits: 1
  };

  constructor() {
    this.loadFromCache();
    this.recordVisit();
  }

  /**
   * Generates a date-stamped key for daily unique tracking (YYYY-MM-DD)
   */
  private getTodayKey(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `chministries-nbc2026-daily-v3-${year}-${month}-${day}`;
  }

  private loadFromCache(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const saved = localStorage.getItem(this.LS_STATS_CACHE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.uniqueVisitors === 'number') {
          this.cachedStats = parsed;
        }
      }
    } catch {
      // Ignore cache parsing errors
    }
  }

  private saveToCache(stats: VisitorStats): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(this.LS_STATS_CACHE, JSON.stringify(stats));
    } catch {
      // Ignore storage errors
    }
  }

  /**
   * Tracks visitors accurately:
   * 1. Refreshing the browser NEVER increments any counter.
   * 2. First-time visitors are recorded once per device/browser.
   * 3. Returning visitors are recorded once per new session.
   * 4. Daily visitors are recorded once per day per device.
   */
  public async recordVisit(): Promise<void> {
    if (typeof localStorage === 'undefined' || typeof sessionStorage === 'undefined') return;

    try {
      const isFirstTimeEver = !localStorage.getItem(this.LS_FIRST_VISIT);
      const isSessionAlreadyLogged = sessionStorage.getItem(this.SS_SESSION_LOGGED);
      const todayKey = this.getTodayKey();
      const isLoggedToday = localStorage.getItem(`nbc2026_day_${todayKey}`);

      // SCENARIO 1: First-Time Visitor
      if (isFirstTimeEver) {
        localStorage.setItem(this.LS_FIRST_VISIT, new Date().toISOString());
        sessionStorage.setItem(this.SS_SESSION_LOGGED, 'true');
        localStorage.setItem(`nbc2026_day_${todayKey}`, 'true');

        // Increment Unique First-Time count and Today count
        await Promise.allSettled([
          this.fetchHit(this.KEY_UNIQUE),
          this.fetchHit(todayKey)
        ]);
      } else {
        // SCENARIO 2: Returning visitor or browser refresh.
        // If the session is already active, user simply hit REFRESH (F5).
        // DO NOT INCREMENT ANYTHING ON REFRESH!
        if (!isSessionAlreadyLogged) {
          // This is a NEW session by a RETURNING visitor
          sessionStorage.setItem(this.SS_SESSION_LOGGED, 'true');

          const calls: Promise<number>[] = [this.fetchHit(this.KEY_RETURNING)];

          // If visiting for the first time today, also count in today's unique visitors
          if (!isLoggedToday) {
            localStorage.setItem(`nbc2026_day_${todayKey}`, 'true');
            calls.push(this.fetchHit(todayKey));
          }

          await Promise.allSettled(calls);
        }
      }

      // Fetch fresh stats to update cache
      await this.getStats();
    } catch (err) {
      console.warn('Could not record visit:', err);
    }
  }

  /**
   * Fetches latest stats without incrementing
   */
  public async getStats(): Promise<VisitorStats> {
    const todayKey = this.getTodayKey();

    try {
      const [uniqueVal, returnVal, todayVal] = await Promise.all([
        this.fetchGet(this.KEY_UNIQUE),
        this.fetchGet(this.KEY_RETURNING),
        this.fetchGet(todayKey)
      ]);

      const unique = uniqueVal > 0 ? uniqueVal : (this.cachedStats.uniqueVisitors || 1);
      const returning = returnVal >= 0 ? returnVal : (this.cachedStats.returnVisitors || 0);
      const today = todayVal > 0 ? todayVal : (this.cachedStats.todayVisitors || 1);

      this.cachedStats = {
        uniqueVisitors: unique,
        returnVisitors: returning,
        todayVisitors: today,
        totalVisits: unique + returning
      };

      this.saveToCache(this.cachedStats);
    } catch {
      // Return cached stats on failure
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
