import { storage } from './storage';
import { mailganerClient } from './email';
import { db } from './db';
import { sql } from 'drizzle-orm';
import type { SystemHealthCheck } from '@shared/schema';

export class HealthCheckService {
  private intervalId: NodeJS.Timeout | null = null;
  private checkInterval: number = 60000; // 1 minute
  
  constructor(intervalMinutes: number = 1) {
    this.checkInterval = intervalMinutes * 60 * 1000;
  }

  async performHealthCheck(serviceName: string): Promise<{
    status: 'healthy' | 'degraded' | 'down';
    responseTime: number;
    error?: string;
  }> {
    const startTime = Date.now();
    let status: 'healthy' | 'degraded' | 'down' = 'down';
    let error: string | undefined;
    
    try {
      switch (serviceName) {
        case 'database':
          await db.execute(sql`SELECT 1`);
          const dbTime = Date.now() - startTime;
          status = dbTime < 1000 ? 'healthy' : dbTime < 3000 ? 'degraded' : 'down';
          break;
          
        case 'email':
          const isConnected = await mailganerClient.verifyConnection();
          status = isConnected ? 'healthy' : 'down';
          break;
          
        case 'storage':
          // Quick storage check
          await storage.getUserAccountById('health-check');
          const storageTime = Date.now() - startTime;
          status = storageTime < 500 ? 'healthy' : storageTime < 2000 ? 'degraded' : 'down';
          break;
          
        case 'webserver':
          // Web server is healthy if we're running
          status = 'healthy';
          break;
          
        case 'compliance':
          // ФЗ-152 Compliance: System operates without external AI services
          status = 'healthy'; // Always healthy - no external data transfer
          break;
          
        default:
          throw new Error(`Unknown service: ${serviceName}`);
      }
    } catch (err: any) {
      error = err.message;
      status = 'down';
      console.error(`Health check failed for ${serviceName}:`, err);
    }
    
    const responseTime = Date.now() - startTime;
    
    // Record the health check result
    try {
      // Determine service category
      let serviceCategory: 'core' | 'external' | 'integration';
      switch (serviceName) {
        case 'database':
        case 'storage':
        case 'webserver':
          serviceCategory = 'core';
          break;
        case 'email':
        case 'compliance':
          serviceCategory = 'external';
          break;
        default:
          serviceCategory = 'integration';
      }
      
      await storage.createSystemHealthCheck({
        serviceName,
        serviceCategory,
        status,
        responseTimeMs: responseTime,
        errorMessage: error,
        metadata: {
          automatic: true,
          timestamp: new Date().toISOString(),
          checkInterval: this.checkInterval
        }
      });
      
      // Calculate uptime percentage
      const recentChecks = await storage.getSystemHealthChecks({
        serviceName
      });
      
      const last100 = recentChecks.slice(0, 100);
      const healthyCount = last100.filter((c: SystemHealthCheck) => c.status === 'healthy').length;
      const uptime = last100.length > 0 ? (healthyCount / last100.length) * 100 : 100;
      
      // Update the latest check with uptime
      const latestCheck = await storage.getLatestHealthCheckByService(serviceName);
      if (latestCheck) {
        await storage.updateSystemHealthCheck(latestCheck.id, { uptime });
      }
    } catch (err) {
      console.error(`Failed to record health check for ${serviceName}:`, err);
    }
    
    return { status, responseTime, error };
  }

  async runHealthChecks() {
    const services = ['database', 'email', 'storage', 'webserver', 'compliance'];
    
    console.log(`[${new Date().toISOString()}] Running automatic health checks...`);
    
    const results = await Promise.allSettled(
      services.map(service => this.performHealthCheck(service))
    );
    
    results.forEach((result, index) => {
      const service = services[index];
      if (result.status === 'fulfilled') {
        const { status, responseTime } = result.value;
        console.log(`  ✓ ${service}: ${status} (${responseTime}ms)`);
      } else {
        console.error(`  ✗ ${service}: failed to check`);
      }
    });
  }

  start() {
    if (this.intervalId) {
      console.warn('Health check service is already running');
      return;
    }
    
    console.log(`🏥 Starting health check service (interval: ${this.checkInterval / 1000}s)`);
    
    // Run initial health check
    this.runHealthChecks();
    
    // Schedule periodic health checks
    this.intervalId = setInterval(() => {
      this.runHealthChecks();
    }, this.checkInterval);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId as NodeJS.Timeout);
      this.intervalId = null;
      console.log('🛑 Health check service stopped');
    }
  }
}

// Export singleton instance
export const healthCheckService = new HealthCheckService(1); // Check every minute