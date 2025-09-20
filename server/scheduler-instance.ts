import { BlogScheduler } from "./blog-scheduler";

// Global instance holder for the blog scheduler
// This allows routes to access the scheduler that was initialized in index.ts
export class SchedulerInstance {
  private static instance: BlogScheduler | null = null;

  static set(scheduler: BlogScheduler): void {
    this.instance = scheduler;
  }

  static get(): BlogScheduler | null {
    return this.instance;
  }

  static isInitialized(): boolean {
    return this.instance !== null;
  }
}