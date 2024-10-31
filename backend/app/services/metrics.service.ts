import { Registry, Counter, Histogram } from 'prom-client';

export class MetricsService {
  private registry: Registry;
  private counters: Map<string, Counter>;
  private histograms: Map<string, Histogram>;

  constructor() {
    this.registry = new Registry();
    this.counters = new Map();
    this.histograms = new Map();
  }

  getCounter(name: string, help: string): Counter {
    if (!this.counters.has(name)) {
      const counter = new Counter({ name, help });
      this.registry.registerMetric(counter);
      this.counters.set(name, counter);
    }
    return this.counters.get(name)!;
  }

  getHistogram(name: string, help: string, buckets?: number[]): Histogram {
    if (!this.histograms.has(name)) {
      const histogram = new Histogram({ name, help, buckets });
      this.registry.registerMetric(histogram);
      this.histograms.set(name, histogram);
    }
    return this.histograms.get(name)!;
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
} 