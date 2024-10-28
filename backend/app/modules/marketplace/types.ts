import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string(),
  price: z.number().positive(),
  sellerId: z.string().uuid(),
  category: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const CompanySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  industry: z.string(),
  description: z.string(),
  referralTerms: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type Product = z.infer<typeof ProductSchema>;
export type Company = z.infer<typeof CompanySchema>;
