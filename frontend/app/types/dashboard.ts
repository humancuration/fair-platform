export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  pendingReports: number;
}

export interface Activity {
  id: string;
  description: string;
  createdAt: Date;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  userId: string;
}

export interface AffiliateProgram {
  id: string;
  name: string;
  commissionRate: number;
  description?: string;
}

export interface AffiliateLink {
  id: string;
  originalLink: string;
  generatedLink: string;
  customAlias?: string;
  clicks: number;
  conversions: number;
  affiliateProgram: AffiliateProgram;
  createdAt: Date;
}

export interface AnalyticsData {
  totalProducts: number;
  totalRevenue: number;
  averageGenerosity: number;
  activeUsers: number;
  revenueTrend: {
    labels: string[];
    values: number[];
  };
  userGrowth: {
    labels: string[];
    values: number[];
  };
}

export interface GroupsOverviewData {
  totalGroups: number;
  activeGroups: number;
  membershipGrowth: number;
  groups: Group[];
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  isVerified: boolean;
  coverPhoto?: string;
  resourceCredits: number;
  members: GroupMember[];
}

export interface GroupMember {
  id: string;
  userId: string;
  role: 'ADMIN' | 'MODERATOR' | 'MEMBER';
  joinedAt: Date;
}
