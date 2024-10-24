type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logHistory: LogEntry[] = [];
  private maxHistorySize = 1000;

  private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    };
  }

  private log(level: LogLevel, message: string, ...args: any[]) {
    const entry = this.createLogEntry(level, message, args);
    
    if (this.isDevelopment) {
      const consoleMethod = level === 'error' ? 'error' : 
                          level === 'warn' ? 'warn' : 
                          level === 'debug' ? 'debug' : 'log';
      
      console[consoleMethod](`[${entry.timestamp}] [${level.toUpperCase()}] ${message}`, ...args);
    }

    this.logHistory.push(entry);
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift();
    }

    // In production, you might want to send logs to a service
    if (process.env.NODE_ENV === 'production') {
      this.sendToLogService(entry);
    }
  }

  private async sendToLogService(entry: LogEntry) {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
    } catch (error) {
      console.error('Failed to send log to service:', error);
    }
  }

  info(message: string, ...args: any[]) {
    this.log('info', message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.log('warn', message, ...args);
  }

  error(message: string, ...args: any[]) {
    this.log('error', message, ...args);
  }

  debug(message: string, ...args: any[]) {
    this.log('debug', message, ...args);
  }

  getHistory(): LogEntry[] {
    return [...this.logHistory];
  }

  clearHistory() {
    this.logHistory = [];
  }
}

export default new Logger();
