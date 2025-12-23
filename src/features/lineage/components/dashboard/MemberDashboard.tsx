import { UserCircleIcon, UsersIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { MemberHero } from './MemberHero';
import { FamilyRelationshipsView } from './FamilyRelationshipsView';
import { PersonalInfoView } from './PersonalInfoView';
import TabbedLayout from '../../../../shared/components/ui/TabbedLayout';
import type { Member } from '../../../../shared/datamodels';

interface MemberDashboardProps {
  member: Member;
  setSelectedMember: (member: Member | null) => void;
}

const dashboardTabs = [
  { key: 'personal', label: 'Personal Info', icon: <UserCircleIcon className="w-5 h-5" /> },
  { key: 'family', label: 'Family', icon: <UsersIcon className="w-5 h-5" /> },
];

export default function MemberDashboard({ member, setSelectedMember }: MemberDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>('personal');

  return (
    <div className="bg-background-primary rounded-xl shadow-sm border border-highlight overflow-hidden h-full flex flex-col">
      {/* Hero Section */}
      
      <MemberHero member={member} setSelectedMember={setSelectedMember} />

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto p-4">
        <TabbedLayout tabs={dashboardTabs} activeTabKey={activeTab} onTabChange={setActiveTab}>
          {activeTab === 'personal' && <PersonalInfoView member={member} />}
          {activeTab === 'family' && <FamilyRelationshipsView />}
        </TabbedLayout>
      </div>
    </div>
  );
}
