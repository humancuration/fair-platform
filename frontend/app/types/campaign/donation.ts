export interface Donation {
  id: string;
  campaignId: string;
  donorId: string;
  amount: number;
  message?: string;
  isAnonymous: boolean;
  createdAt: Date;
}
