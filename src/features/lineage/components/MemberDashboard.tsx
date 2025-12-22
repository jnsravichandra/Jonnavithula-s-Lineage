import { useState } from 'react';
import { UserCircleIcon, MapPinIcon, CalendarIcon, BriefcaseIcon, InformationCircleIcon, UsersIcon } from '@heroicons/react/24/solid';
import type { Member } from '../../../shared/datamodels';
import type { FamilyTreeDataType } from '../hooks';
import TabbedLayout from '../../../shared/components/ui/TabbedLayout';

interface MemberDashboardProps {
  member: Member;
  familyTreeData?: FamilyTreeDataType;
}

const dashboardTabs = [
  { key: 'personal', label: 'Personal Info', icon: <UserCircleIcon className="w-5 h-5" /> },
  { key: 'family', label: 'Family', icon: <UsersIcon className="w-5 h-5" /> },
];

export default function MemberDashboard({ member }: MemberDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>('personal');

  const getFullName = () => {
    return [member.first_name, member.middle_name, member.last_name].filter(Boolean).join(' ');
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getVitals = () => {
    const birth = member.birth_date ? new Date(member.birth_date).getFullYear() : '?';
    const death = member.death_date ? new Date(member.death_date).getFullYear() : member.is_alive ? 'Present' : '?';
    return `${birth} - ${death}`;
  };

  return (
    <div className="bg-background-primary rounded-xl shadow-sm border border-highlight overflow-hidden h-full flex flex-col">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-accent-primary via-highlight to-accent-primary p-6 flex items-center gap-6 border-b border-text-primary">
        <div className="relative">
          {member.profile_picture_url ? (
            <img src={member.profile_picture_url} alt={getFullName()} className="w-24 h-24 rounded-full object-cover border-4 border-background-primary shadow-md" />
          ) : (
            <UserCircleIcon className="w-24 h-24 text-background-secondary bg-white rounded-full" />
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-background-primary">{getFullName()}</h2>
          <p className="text-background-secondary font-medium mt-1">{getVitals()}</p>
          {(member.birth_place || member.current_location) && (
            <div className="flex items-center text-sm text-background-secondary mt-2">
              <MapPinIcon className="w-4 h-4 mr-1" />
              <span>{member.birth_place || member.current_location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto p-4">
        <TabbedLayout tabs={dashboardTabs} activeTabKey={activeTab} onTabChange={setActiveTab}>
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Gender</label>
                  <p className="text-text-primary capitalize">{member.gender || 'Not specified'}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Occupation</label>
                  <div className="flex items-center text-text-primary">
                    <BriefcaseIcon className="w-4 h-4 mr-2 text-text-secondary" />
                    {member.profession || 'Unknown'}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Birth Date</label>
                  <div className="flex items-center text-text-primary">
                    <CalendarIcon className="w-4 h-4 mr-2 text-text-secondary" />
                    {formatDate(member.birth_date?.toString())}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Death Date</label>
                  <div className="flex items-center text-text-primary">
                    <CalendarIcon className="w-4 h-4 mr-2 text-text-secondary" />
                    {member.is_alive ? 'Living' : formatDate(member.death_date?.toString())}
                  </div>
                </div>
              </div>

              {/* Bio / Notes Section */}
              <div className="pt-4 border-t border-gray-100">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 block">Biography / Notes</label>
                <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
                  {/* {member.notes || "No additional notes available for this member."} */}
                  No additional notes available for this member.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'family' && (
            <div className="text-center text-text-primary py-8">
              <InformationCircleIcon className="w-12 h-12 mx-auto text-text-primary mb-3" />
              <p>Family relationships view coming soon.</p>
            </div>
          )}
        </TabbedLayout>
      </div>
    </div>
  );
}
