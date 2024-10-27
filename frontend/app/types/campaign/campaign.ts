export interface Campaign {
  id: string;
  title: string;
  description: string;
  goal: number;
  currentAmount: number;
  startDate: Date;
  endDate: Date;
  status: CampaignStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type CampaignStatus = 'draft' | 'active' | 'completed' | 'cancelled';

export interface CampaignCreateInput {
  title: string;
  description: string;
  goal: number;
  startDate: Date;
  endDate: Date;
}
