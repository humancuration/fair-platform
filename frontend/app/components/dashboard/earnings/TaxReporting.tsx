import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFileDownload, FaChartPie, FaCalculator, FaTags, FaGlobe, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface TaxCategory {
  id: string;
  name: string;
  description: string;
  percentage: number;
  amount: number;
  deductible: boolean;
}

interface TaxReport {
  year: number;
  totalEarnings: number;
  categories: TaxCategory[];
  deductions: {
    equipment: number;
    software: number;
    marketing: number;
    other: number;
  };
  jurisdictions: {
    country: string;
    amount: number;
    taxRate: number;
    currency: string;
  }[];
}

const ReportingContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  color: white;
  margin-top: 20px;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const CategoryCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  position: relative;
`;

const ExportButton = styled(motion.button)`
  background: linear-gradient(45deg, #43cea2, #185a9d);
  border: none;
  border-radius: 25px;
  padding: 12px 24px;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
`;

const TaxReporting: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [taxReport, setTaxReport] = useState<TaxReport | null>(null);

  const fetchTaxReport = async (year: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/earnings/tax-report/${year}`);
      const data = await response.json();
      setTaxReport(data);
    } catch (error) {
      console.error('Failed to fetch tax report:', error);
      toast.error('Could not load tax report');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format: 'pdf' | 'csv' | 'turbotax' | 'quickbooks') => {
    try {
      const response = await fetch(`/api/earnings/tax-report/${selectedYear}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format, includeDeductions: true })
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tax_report_${selectedYear}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success(`Tax report exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export tax report');
    }
  };

  const calculateTotalDeductions = () => {
    if (!taxReport) return 0;
    return Object.values(taxReport.deductions).reduce((sum, val) => sum + val, 0);
  };

  const calculateEffectiveTaxRate = () => {
    if (!taxReport) return 0;
    const totalTax = taxReport.jurisdictions.reduce(
      (sum, j) => sum + (j.amount * j.taxRate), 0
    );
    return (totalTax / taxReport.totalEarnings) * 100;
  };

  return (
    <ReportingContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaCalculator /> Tax Reporting
        </h2>
        <div className="flex gap-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-transparent border border-gray-500 rounded px-3 py-2"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <ExportButton
              onClick={() => exportReport('turbotax')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaFileDownload /> Export for TurboTax
            </ExportButton>
            <ExportButton
              onClick={() => exportReport('quickbooks')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaFileDownload /> Export for QuickBooks
            </ExportButton>
          </div>
        </div>
      </div>

      {taxReport && (
        <>
          <CategoryGrid>
            <CategoryCard whileHover={{ scale: 1.02 }}>
              <FaChartPie className="text-2xl mb-2" />
              <h3 className="font-semibold">Total Earnings</h3>
              <div className="text-2xl font-bold mt-2">
                ${taxReport.totalEarnings.toLocaleString()}
              </div>
              <p className="text-sm opacity-70">Across all platforms and sources</p>
            </CategoryCard>

            <CategoryCard whileHover={{ scale: 1.02 }}>
              <FaTags className="text-2xl mb-2" />
              <h3 className="font-semibold">Deductions</h3>
              <div className="text-2xl font-bold mt-2">
                ${calculateTotalDeductions().toLocaleString()}
              </div>
              <p className="text-sm opacity-70">Total tax-deductible expenses</p>
            </CategoryCard>

            <CategoryCard whileHover={{ scale: 1.02 }}>
              <FaGlobe className="text-2xl mb-2" />
              <h3 className="font-semibold">Effective Tax Rate</h3>
              <div className="text-2xl font-bold mt-2">
                {calculateEffectiveTaxRate().toFixed(2)}%
              </div>
              <p className="text-sm opacity-70">Blended rate across jurisdictions</p>
            </CategoryCard>
          </CategoryGrid>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Income Categories</h3>
            <div className="space-y-4">
              {taxReport.categories.map(category => (
                <div key={category.id} className="bg-opacity-10 bg-white rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{category.name}</h4>
                      <p className="text-sm opacity-70">{category.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${category.amount.toLocaleString()}</div>
                      <div className="text-sm opacity-70">{category.percentage}% of total</div>
                    </div>
                  </div>
                  {category.deductible && (
                    <div className="mt-2 text-sm text-green-400 flex items-center gap-1">
                      <FaInfoCircle />
                      Tax deductible
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Jurisdictional Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {taxReport.jurisdictions.map((jurisdiction, index) => (
                <div key={index} className="bg-opacity-10 bg-white rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{jurisdiction.country}</h4>
                      <p className="text-sm opacity-70">Tax Rate: {(jurisdiction.taxRate * 100).toFixed(2)}%</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">
                        {jurisdiction.amount.toLocaleString()} {jurisdiction.currency}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </ReportingContainer>
  );
};

export default TaxReporting;
