import { prisma } from '~/utils/db.server';

export interface VisualizationData {
  id: string;
  type: 'chart' | 'network' | 'supplyChain' | '3d';
  data: any;
  config: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChartDataPoint {
  date: Date;
  value: number;
  category?: string;
}

export interface NetworkNode {
  id: string;
  label: string;
  group?: string;
  title?: string;
}

export interface NetworkEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  width?: number;
  color?: string;
}

export interface SupplyChainNode {
  id: string;
  type: 'supplier' | 'manufacturer' | 'distributor' | 'retailer';
  name: string;
  sustainabilityScore: number;
  location: {
    lat: number;
    lng: number;
  };
  certifications: string[];
}

export interface SupplyChainLink {
  source: string;
  target: string;
  type: 'material' | 'transport';
  carbonEmission: number;
  verificationStatus: 'verified' | 'pending' | 'disputed';
}

export async function getVisualizationData(id: string) {
  return prisma.visualization.findUnique({
    where: { id },
    include: {
      data: true,
      config: true,
    },
  });
}

export async function getChartData(chartId: string) {
  return prisma.chartData.findMany({
    where: { chartId },
    orderBy: { date: 'asc' },
  });
}

export async function getNetworkData(networkId: string) {
  const nodes = await prisma.networkNode.findMany({
    where: { networkId },
  });
  
  const edges = await prisma.networkEdge.findMany({
    where: { networkId },
  });

  return { nodes, edges };
}

export async function getSupplyChainData(productId: string) {
  const nodes = await prisma.supplyChainNode.findMany({
    where: { productId },
  });
  
  const links = await prisma.supplyChainLink.findMany({
    where: { productId },
  });

  return { nodes, links };
}

export async function get3DModelData(modelId: string) {
  return prisma.model3D.findUnique({
    where: { id: modelId },
    include: {
      assets: true,
      animations: true,
    },
  });
}
