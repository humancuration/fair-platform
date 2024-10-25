export interface GameTestData {
  bugReports: BugReport[];
  playerPositions: PlayerPosition[];
  metrics: GameMetrics;
  playerActions: PlayerAction[];
}

export interface ScreeningData {
  reactions: ViewerReaction[];
  timestamps: TimestampFeedback[];
  technical: TechnicalFeedback[];
  audience: AudienceData[];
}

export interface ProductionData {
  production: ProductionMetrics;
  workerFeedback: WorkerFeedback[];
  resources: ResourceUsage[];
  inspections: QualityInspection[];
}

export interface BugReport {
  id: string;
  type: string;
  severity: string;
  description: string;
  steps: string[];
  systemInfo: SystemInfo;
  screenshot?: string;
}

export interface PlayerPosition {
  timestamp: number;
  x: number;
  y: number;
  z: number;
  area: string;
  context: any;
}

export interface GameMetrics {
  fps: number[];
  memory: number[];
  latency: number[];
  loadTimes: number[];
}

export interface PlayerAction {
  timestamp: number;
  type: string;
  context: any;
  result: any;
}

export interface ViewerReaction {
  timestamp: number;
  emotion: string;
  intensity: number;
  context: any;
}

export interface TimestampFeedback {
  timestamp: number;
  type: string;
  comment: string;
  markers: string[];
}

export interface TechnicalFeedback {
  aspect: string;
  rating: number;
  issues: string[];
  timestamp: number;
}

export interface AudienceData {
  demographics: Demographics;
  preferences: any;
  history: ViewingHistory;
}

export interface ProductionMetrics {
  efficiency: number;
  wastage: number;
  cycleTime: number;
  quality: number;
}

export interface WorkerFeedback {
  workerId: string;
  comfort: number;
  strain: number;
  suggestions: string[];
  timestamp: number;
}

export interface ResourceUsage {
  type: string;
  amount: number;
  efficiency: number;
  environmental_impact: number;
}

export interface QualityInspection {
  timestamp: number;
  inspector: string;
  metrics: any;
  findings: string[];
}

interface SystemInfo {
  os: string;
  browser: string;
  hardware: any;
}

interface Demographics {
  age: number;
  gender: string;
  location: string;
  preferences: string[];
}

interface ViewingHistory {
  genres: string[];
  platforms: string[];
  frequency: string;
}
