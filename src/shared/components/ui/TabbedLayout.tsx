import React from 'react';
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
  return (
    <div className="bg-background-secondary rounded-xl shadow-lg p-4 ">
      <div className="flex border-b border-background-primary mb-4 ">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`
              py-2 px-4 text-lg focus:outline-none transition-colors duration-300 ease-in-out flex items-center gap-2
              ${
                activeTabKey === tab.key
                  ? 'border-b-2 border-accent-primary text-accent-primary font-bold transition-colors'
                  : 'border-b-2 font-medium border-transparent text-text-secondary hover:text-text-primary hover:background-primary-hover'
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
