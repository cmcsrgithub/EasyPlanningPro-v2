// Enterprise-grade logging system

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  userId?: number;
  requestId?: string;
  stack?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 10000; // Keep last 10k logs in memory

  private formatLog(entry: LogEntry): string {
    const { timestamp, level, message, context, userId, requestId } = entry;
    const parts = [
      `[${timestamp}]`,
      `[${level.toUpperCase()}]`,
      requestId ? `[${requestId}]` : '',
      userId ? `[User:${userId}]` : '',
      message,
      context ? `\n${JSON.stringify(context, null, 2)}` : '',
    ];
    return parts.filter(Boolean).join(' ');
  }

  private addLog(level: LogLevel, message: string, context?: Record<string, any>, userId?: number, requestId?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      userId,
      requestId,
    };

    // Add to in-memory logs
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output (development)
    if (process.env.NODE_ENV === 'development') {
      const formatted = this.formatLog(entry);
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(formatted);
          break;
        case LogLevel.INFO:
          console.info(formatted);
          break;
        case LogLevel.WARN:
          console.warn(formatted);
          break;
        case LogLevel.ERROR:
        case LogLevel.CRITICAL:
          console.error(formatted);
          if (entry.stack) console.error(entry.stack);
          break;
      }
    }

    // TODO: In production, send to external logging service (e.g., Sentry, LogRocket, DataDog)
    // this.sendToExternalService(entry);
  }

  debug(message: string, context?: Record<string, any>, userId?: number, requestId?: string) {
    this.addLog(LogLevel.DEBUG, message, context, userId, requestId);
  }

  info(message: string, context?: Record<string, any>, userId?: number, requestId?: string) {
    this.addLog(LogLevel.INFO, message, context, userId, requestId);
  }

  warn(message: string, context?: Record<string, any>, userId?: number, requestId?: string) {
    this.addLog(LogLevel.WARN, message, context, userId, requestId);
  }

  error(message: string, error?: Error, context?: Record<string, any>, userId?: number, requestId?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.ERROR,
      message,
      context: {
        ...context,
        error: error?.message,
      },
      userId,
      requestId,
      stack: error?.stack,
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    if (process.env.NODE_ENV === 'development') {
      console.error(this.formatLog(entry));
      if (error?.stack) console.error(error.stack);
    }
  }

  critical(message: string, error?: Error, context?: Record<string, any>, userId?: number, requestId?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.CRITICAL,
      message,
      context: {
        ...context,
        error: error?.message,
      },
      userId,
      requestId,
      stack: error?.stack,
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('🚨 CRITICAL:', this.formatLog(entry));
      if (error?.stack) console.error(error.stack);
    }

    // TODO: Send critical alerts (e.g., PagerDuty, Slack, email)
  }

  getLogs(level?: LogLevel, limit: number = 100): LogEntry[] {
    let filtered = this.logs;
    if (level) {
      filtered = filtered.filter((log) => log.level === level);
    }
    return filtered.slice(-limit);
  }

  clearLogs() {
    this.logs = [];
  }
}

// Singleton instance
export const logger = new Logger();

