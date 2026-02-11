import { useEffect, useMemo, useState } from 'react';
import { EmptySelectionState } from '..';
import type { FamilyTreeDataType } from '../../hooks';
import type { Member } from '../../../../shared/datamodels';
import MemberDashboard from '../dashboard/MemberDashboard';
import MemberTreeContainer from './MemberTreeContainer';
import type { PersonCardActionType } from '../../types';

interface MemberDirectoryProps {
  familyTreeData: FamilyTreeDataType;
  personCardActions: PersonCardActionType;
}

function MemberDirectory({ familyTreeData, personCardActions }: MemberDirectoryProps) {
  const { hierarchy, selectedMember, handleMemberClick, setSelectedMember } = familyTreeData;
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = useMemo(() => {
    if (!searchTerm || !familyTreeData.familyData?.members) return [];
    const lowerTerm = searchTerm.toLowerCase();
    return familyTreeData.familyData.members.filter((member) => {
      const fullName = member.full_name || [member.first_name, member.middle_name, member.last_name].filter(Boolean).join(' ');
      return fullName.toLowerCase().includes(lowerTerm);
    });
  }, [familyTreeData.familyData, searchTerm]);

  const handleSearchSelect = (member: Member) => {
    setSelectedMember(member);
    setSearchTerm('');
  };

  useEffect(() => {
    // Wait for family data to load before attempting to select a member from URL
    if (!familyTreeData.familyData) return;

    const searchParams = new URLSearchParams(window.location.search);
    let memberIdFromUrl = searchParams.get('focusedMemberId');

    if (!memberIdFromUrl) {
      const pathSegments = window.location.pathname.split('/').filter(Boolean);
      const lastSegment = pathSegments[pathSegments.length - 1];
      if (lastSegment && lastSegment !== 'directory') {
        memberIdFromUrl = lastSegment;
      }
    }

    // console.log('memberIdFromUrl', memberIdFromUrl);
    if (memberIdFromUrl) {
      handleMemberClick(memberIdFromUrl);
    }
  }, [handleMemberClick, familyTreeData.familyData]);

  return (
    <div className="p-md md:flex gap-md h-[calc(100vh-65px)]">
      <div className={`flex flex-col gap-4 shrink-0 ${selectedMember ? 'hidden md:flex' : 'w-full'} md:w-1/3 md:min-w-[300px]`}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a member..."
            className="w-full p-2 rounded-md border border-text-secondary bg-background-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && filteredMembers.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 max-h-60 overflow-auto rounded-md border border-text-secondary bg-background-secondary shadow-lg">
              {filteredMembers.map((member) => (
                <li
                  key={member.member_id}
                  onClick={() => handleSearchSelect(member)}
                  className="cursor-pointer p-2 hover:bg-accent-primary hover:text-white text-text-primary"
                >
                  {member.full_name || [member.first_name, member.middle_name, member.last_name].filter(Boolean).join(' ')}
                </li>
              ))}
            </ul>
          )}
        </div>
        <MemberTreeContainer hierarchy={hierarchy} selectedMember={selectedMember} handleMemberClick={handleMemberClick} />
      </div>

      <div className={`w-full h-full ${selectedMember ? 'block' : 'hidden md:block'}`}>
        {selectedMember ? (
          <MemberDashboard
            hierarchy={hierarchy!}
            member={selectedMember}
            setSelectedMember={setSelectedMember}
            personCardActions={personCardActions}
          />
        ) : (
          <EmptySelectionState />
        )}
      </div>
    </div>
  );
}

export default MemberDirectory;
