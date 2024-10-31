import React from 'react';
import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  icon?: React.ComponentType;
}

interface TabNavProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'pills' | 'underline';
}

const TabNav: React.FC<TabNavProps> = ({ 
  tabs, 
  activeTab, 
  onChange,
  variant = 'pills' 
}) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-4" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`
                relative px-3 py-2 text-sm font-medium rounded-md
                ${variant === 'pills'
                  ? isActive
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                  : isActive
                    ? 'text-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <div className="flex items-center space-x-2">
                {Icon && <Icon className="w-5 h-5" />}
                <span>{tab.label}</span>
              </div>

              {variant === 'underline' && isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                  initial={false}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default TabNav; 