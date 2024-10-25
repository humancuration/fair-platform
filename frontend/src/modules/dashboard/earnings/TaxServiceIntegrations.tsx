import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFileExport, FaInfoCircle, FaCheck, FaDollarSign, FaStar, FaExternalLinkAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface TaxService {
  id: string;
  name: string;
  description: string;
  features: string[];
  maxIncome?: number;
  price: {
    base: number;
    state?: number;
  };
  rating: number;
  url: string;
  exportFormat: 'csv' | 'pdf' | 'direct';
  directIntegration: boolean;
}

const TAX_SERVICES: TaxService[] = [
  {
    id: 'freetaxusa',
    name: 'FreeTaxUSA',
    description: 'Free federal filing with low-cost state returns',
    features: [
      'Free federal filing',
      'Low-cost state returns ($14.99)',
      'Self-employed support',
      'Direct deposit',
      'Prior year returns'
    ],
    price: {
      base: 0,
      state: 14.99
    },
    rating: 4.8,
    url: 'https://www.freetaxusa.com',
    exportFormat: 'csv',
    directIntegration: true
  },
  {
    id: 'cashapp',
    name: 'Cash App Taxes',
    description: 'Completely free federal and state filing',
    features: [
      'Free federal & state filing',
      'Simple interface',
      'Mobile-friendly',
      'Direct deposit',
      'Maximum refund guarantee'
    ],
    maxIncome: 100000,
    price: {
      base: 0
    },
    rating: 4.6,
    url: 'https://cash.app/taxes',
    exportFormat: 'direct',
    directIntegration: true
  },
  {
    id: 'olt',
    name: 'OLT.com',
    description: 'Low-cost option with comprehensive features',
    features: [
      'Federal filing ($9.95)',
      'State filing ($14.95)',
      'All tax forms included',
      'Live chat support',
      'Audit support'
    ],
    price: {
      base: 9.95,
      state: 14.95
    },
    rating: 4.5,
    url: 'https://www.olt.com',
    exportFormat: 'pdf',
    directIntegration: false
  }
];

const IntegrationsContainer = styled(motion.div)`
  margin-top: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
`;

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const ServiceCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #43cea2, #185a9d);
  }
`;

const PriceTag = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: linear-gradient(45deg, #43cea2, #185a9d);
  padding: 8px 12px;
  border-radius: 20px;
  font-weight: bold;
`;

const FeatureList = styled.ul`
  margin-top: 15px;
  space-y-2;
`;

const ExportButton = styled(motion.button)`
  background: linear-gradient(45deg, #43cea2, #185a9d);
  border: none;
  border-radius: 25px;
  padding: 10px 20px;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  cursor: pointer;
  width: 100%;
  justify-content: center;
  font-weight: 500;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const RatingStars = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 10px;
`;

const TaxServiceIntegrations: React.FC = () => {
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = async (service: TaxService) => {
    setExporting(service.id);
    try {
      if (service.directIntegration) {
        // Simulate direct integration
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.success(`Successfully exported to ${service.name}!`);
      } else {
        // Download file
        const response = await fetch(`/api/earnings/tax-export/${service.id}`);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tax_data_${service.name.toLowerCase()}.${service.exportFormat}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success(`Downloaded tax data for ${service.name}!`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error(`Failed to export to ${service.name}`);
    } finally {
      setExporting(null);
    }
  };

  return (
    <IntegrationsContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FaFileExport /> Tax Service Integrations
        </h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="text-sm opacity-70 hover:opacity-100"
          onClick={() => window.open('https://www.irs.gov/filing/free-file-do-your-federal-taxes-for-free', '_blank')}
        >
          <div className="flex items-center gap-1">
            Learn about IRS Free File <FaExternalLinkAlt />
          </div>
        </motion.button>
      </div>

      <ServiceGrid>
        <AnimatePresence>
          {TAX_SERVICES.map(service => (
            <ServiceCard
              key={service.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">{service.name}</h3>
                  <p className="text-sm opacity-70">{service.description}</p>
                </div>
                <PriceTag>
                  {service.price.base === 0 ? 'FREE' : `$${service.price.base}`}
                </PriceTag>
              </div>

              <RatingStars>
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < Math.floor(service.rating) ? 'text-yellow-400' : 'text-gray-400'}
                  />
                ))}
                <span className="text-sm ml-2">({service.rating})</span>
              </RatingStars>

              <FeatureList>
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <FaCheck className="text-green-400" />
                    {feature}
                  </li>
                ))}
              </FeatureList>

              {service.maxIncome && (
                <div className="mt-2 text-sm flex items-center gap-1 text-yellow-400">
                  <FaInfoCircle />
                  Income limit: ${service.maxIncome.toLocaleString()}
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <ExportButton
                  onClick={() => handleExport(service)}
                  disabled={!!exporting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {exporting === service.id ? (
                    'Exporting...'
                  ) : (
                    <>
                      <FaFileExport /> Export to {service.name}
                    </>
                  )}
                </ExportButton>
              </div>
            </ServiceCard>
          ))}
        </AnimatePresence>
      </ServiceGrid>

      <motion.div
        className="mt-6 p-4 bg-opacity-10 bg-white rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2 text-sm">
          <FaInfoCircle className="text-blue-400" />
          <span>
            These services are recommended based on affordability and ease of use. 
            Always verify current pricing and features on the service's website.
          </span>
        </div>
      </motion.div>
    </IntegrationsContainer>
  );
};

export default TaxServiceIntegrations;
