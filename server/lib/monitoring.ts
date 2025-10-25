// Enterprise monitoring and metrics collection

import { logger } from './logger';

export interface Metrics {
  requests: {
    total: number;
    success: number;
    errors: number;
    avgResponseTime: number;
  };
  database: {
    queries: number;
    avgQueryTime: number;
    errors: number;
  };
  cache: {
    hits: number;
    misses: number;
    hitRate: number;
  };
  system: {
    uptime: number;
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    cpu: {
      percentage: number;
    };
  };
}

class Monitor {
  private metrics: Metrics = {
    requests: {
      total: 0,
      success: 0,
      errors: 0,
      avgResponseTime: 0,
    },
    database: {
      queries: 0,
      avgQueryTime: 0,
      errors: 0,
    },
    cache: {
      hits: 0,
      misses: 0,
      hitRate: 0,
    },
    system: {
      uptime: process.uptime(),
      memory: {
        used: 0,
        total: 0,
        percentage: 0,
      },
      cpu: {
        percentage: 0,
      },
    },
  };

  private responseTimes: number[] = [];
  private queryTimes: number[] = [];

  recordRequest(success: boolean, responseTime: number) {
    this.metrics.requests.total++;
    if (success) {
      this.metrics.requests.success++;
    } else {
      this.metrics.requests.errors++;
    }

    this.responseTimes.push(responseTime);
    if (this.responseTimes.length > 1000) {
      this.responseTimes.shift();
    }

    this.metrics.requests.avgResponseTime =
      this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
  }

  recordDatabaseQuery(queryTime: number, success: boolean = true) {
    this.metrics.database.queries++;
    if (!success) {
      this.metrics.database.errors++;
    }

    this.queryTimes.push(queryTime);
    if (this.queryTimes.length > 1000) {
      this.queryTimes.shift();
    }

    this.metrics.database.avgQueryTime =
      this.queryTimes.reduce((a, b) => a + b, 0) / this.queryTimes.length;
  }

  recordCacheHit(hit: boolean) {
    if (hit) {
      this.metrics.cache.hits++;
    } else {
      this.metrics.cache.misses++;
    }

    const total = this.metrics.cache.hits + this.metrics.cache.misses;
    this.metrics.cache.hitRate = total > 0 ? this.metrics.cache.hits / total : 0;
  }

  updateSystemMetrics() {
    const memUsage = process.memoryUsage();
    this.metrics.system.uptime = process.uptime();
    this.metrics.system.memory.used = memUsage.heapUsed;
    this.metrics.system.memory.total = memUsage.heapTotal;
    this.metrics.system.memory.percentage =
      (memUsage.heapUsed / memUsage.heapTotal) * 100;

    // CPU usage would require additional libraries in production
    // For now, we'll use a placeholder
    this.metrics.system.cpu.percentage = 0;
  }

  getMetrics(): Metrics {
    this.updateSystemMetrics();
    return { ...this.metrics };
  }

  resetMetrics() {
    this.metrics = {
      requests: {
        total: 0,
        success: 0,
        errors: 0,
        avgResponseTime: 0,
      },
      database: {
        queries: 0,
        avgQueryTime: 0,
        errors: 0,
      },
      cache: {
        hits: 0,
        misses: 0,
        hitRate: 0,
      },
      system: {
        uptime: process.uptime(),
        memory: {
          used: 0,
          total: 0,
          percentage: 0,
        },
        cpu: {
          percentage: 0,
        },
      },
    };
    this.responseTimes = [];
    this.queryTimes = [];
  }

  // Health check
  getHealthStatus(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    checks: Record<string, boolean>;
  } {
    const checks = {
      memory: this.metrics.system.memory.percentage < 90,
      errorRate: this.metrics.requests.errors / this.metrics.requests.total < 0.05,
      responseTime: this.metrics.requests.avgResponseTime < 1000,
      database: this.metrics.database.errors / this.metrics.database.queries < 0.01,
    };

    const healthyCount = Object.values(checks).filter(Boolean).length;
    const totalChecks = Object.keys(checks).length;

    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (healthyCount === totalChecks) {
      status = 'healthy';
    } else if (healthyCount >= totalChecks / 2) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    return { status, checks };
  }
}

// Singleton instance
export const monitor = new Monitor();

// Update system metrics every 60 seconds
setInterval(() => {
  monitor.updateSystemMetrics();
  const health = monitor.getHealthStatus();
  if (health.status !== 'healthy') {
    logger.warn('System health degraded', { health });
  }
}, 60000);

