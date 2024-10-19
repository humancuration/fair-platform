import winston from 'winston';
import expressWinston from 'express-winston';
import { v4 as uuidv4 } from 'uuid';
import { context, trace } from '@opentelemetry/api';
import Transport from 'winston-transport';

// Custom transport for sending logs to Logstash
class LogstashTransport extends Transport {
  constructor(opts?: Transport.TransportStreamOptions) {
    super(opts);
  }

  log(info: any, callback: () => void) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    // Send log to Logstash (you might want to use a more robust method like a queue)
    const net = require('net');
    const client = new net.Socket();
    client.connect(5000, 'localhost', () => {
      client.write(JSON.stringify(info) + '\n');
      client.destroy();
    });

    callback();
  }
}

// Create a Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new LogstashTransport()
  ],
});

// Middleware to add request ID to each request
export const addRequestId = (req: any, res: any, next: any) => {
  req.id = uuidv4();
  next();
};

// Express middleware for logging requests and responses
export const expressLogger = expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: false,
  ignoreRoute: (req: any, res: any) => false,
  dynamicMeta: (req: any, res: any) => {
    const span = trace.getSpan(context.active());
    return {
      requestId: req.id,
      traceId: span?.spanContext().traceId,
      spanId: span?.spanContext().spanId,
    };
  },
});

// Express middleware for logging errors
export const expressErrorLogger = expressWinston.errorLogger({
  winstonInstance: logger,
});

export default logger;
