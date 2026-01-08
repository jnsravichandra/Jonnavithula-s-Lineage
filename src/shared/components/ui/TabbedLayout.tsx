import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
interface Tab {
  key: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabbedLayoutProps {
  tabs: Tab[];
  activeTabKey: string;
  onTabChange: (tabKey: string) => void;
  children: React.ReactNode;
}

function TabbedLayout({ tabs, activeTabKey, onTabChange, children }: TabbedLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeTab = tabs.find((tab) => tab.key === activeTabKey);

  return (
    <div className="bg-background-secondary rounded-xl shadow-lg p-4 ">
      {/* Mobile Navigation */}
      <div className="sm:hidden mb-4 relative">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full flex items-center justify-between p-3 rounded-lg bg-background-primary text-text-primary border border-background-primary hover:border-action-primary transition-colors"
        >
          <span className="flex items-center gap-2">
            {activeTab?.icon}
            {activeTab?.label || 'Select Tab'}
          </span>
          <ChevronDownIcon className={`h-5 w-5 transform transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {isMobileMenuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="absolute top-full left-0 right-0 mt-2 z-20 bg-background-secondary border border-background-primary rounded-lg shadow-xl overflow-hidden animate-tab-fade-in">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    onTabChange(tab.key);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 p-3 text-left hover:bg-background-primary transition-colors
                    ${activeTabKey === tab.key ? 'text-action-primary font-bold bg-background-primary/50' : 'text-text-primary'}
                  `}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Desktop Navigation */}
      <div className="hidden sm:flex border-b border-background-primary mb-4 ">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`
              py-2 px-4 text-lg focus:outline-none transition-colors duration-300 ease-in-out flex items-center gap-2
              ${
                activeTabKey === tab.key
                  ? 'border-b-2 border-action-primary text-action-primary font-bold transition-colors'
                  : 'border-b-2 font-medium border-transparent text-text-primary hover:text-text-primary hover:background-primary-hover'
              }
            `}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      <div 
        key={activeTabKey}
        className="p-4 bg-background-primary rounded-b-xl animate-tab-fade-in"
      >
        {children}
      </div>
      <style>{`
        @keyframes tabFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-tab-fade-in {
          animation: tabFadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default TabbedLayout;
