export interface Campaign {
  id: string;
  title: string;
  description: string;
  goal: number;
  amountRaised: number;
  deadline: string;
  category: string;
  image?: string;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
  createdBy: {
    id: string;
    username: string;
    avatar?: string;
  };
  donations: Donation[];
  createdAt: string;
  updatedAt: string;
}

export interface Donation {
  id: string;
  amount: number;
  campaignId: string;
  donor: {
    username: string;
  };
  message?: string;
  isAnonymous: boolean;
  createdAt: string;
}
