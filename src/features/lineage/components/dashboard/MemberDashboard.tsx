import { UserCircleIcon, UsersIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { MemberHero } from './MemberHero';
import { FamilyRelationshipsView } from './FamilyRelationshipsView';
import { PersonalInfoView } from './PersonalInfoView';
import TabbedLayout from '../../../../shared/components/ui/TabbedLayout';
import type { Member, TreeNode } from '../../../../shared/datamodels';
import type { HierarchyNode } from 'd3';
import type { PersonCardActionType } from '../../types';

interface MemberDashboardProps {
  hierarchy: HierarchyNode<TreeNode>;
  member: Member;
  setSelectedMember: (member: Member | null) => void;
  personCardActions: PersonCardActionType;
}

const dashboardTabs = [
  { key: 'personal', label: 'Personal Info', icon: <UserCircleIcon className="w-5 h-5" /> },
  { key: 'family', label: 'Family', icon: <UsersIcon className="w-5 h-5" /> },
];

export default function MemberDashboard({ hierarchy, member, setSelectedMember, personCardActions }: MemberDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>('personal');

  const activeNode: TreeNode = hierarchy.descendants().find((d) => d.data.member_id === member.member_id)?.data as TreeNode;

  return (
    <div className="bg-background-primary rounded-xl shadow-sm border border-highlight overflow-hidden h-full flex flex-col">
      {/* Hero Section */}

      <MemberHero
        member={member}
        setSelectedMember={setSelectedMember}
        onEdit={personCardActions.handlers?.onEdit}
        onShare={personCardActions.handlers?.onShare}
        onAddParent={() => personCardActions.handlers?.onAdd1('Parent', member.member_id!)}
        onAddSpouse={() => personCardActions.handlers?.onAdd1('Spouse', member.member_id!)}
        onAddChild={() => personCardActions.handlers?.onAdd1('Child', member.member_id!)}
        onLink={personCardActions.handlers?.onLink}
        onDelete={personCardActions.handlers?.onDelete}
      />

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto p-4">
        <TabbedLayout tabs={dashboardTabs} activeTabKey={activeTab} onTabChange={setActiveTab}>
          {activeTab === 'personal' && <PersonalInfoView member={member} />}
          {activeTab === 'family' && (
            <FamilyRelationshipsView activeNode={activeNode} setSelectedMember={setSelectedMember} setActiveTab={setActiveTab} />
          )}
        </TabbedLayout>
      </div>
    </div>
  );
}
