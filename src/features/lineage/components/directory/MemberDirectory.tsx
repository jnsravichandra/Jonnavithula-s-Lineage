import { EmptySelectionState } from "..";
import type { FamilyTreeDataType } from "../../hooks";
import { useMemberDirectory } from "../../hooks/useMemberDirectory";
import MemberDashboard from "../dashboard/MemberDashboard";
import MemberTreeContainer from "./MemberTreeContainer";

interface MemberDirectoryProps {
  familyTreeData: FamilyTreeDataType;
}

function MemberDirectory({ familyTreeData }: MemberDirectoryProps) {
  const { hierarchy, selectedMember, setSelectedMember, handleMemberClick } = useMemberDirectory(familyTreeData);

  return (
    <div className="p-md flex gap-md">
      <div className="w-1/3">
        <MemberTreeContainer hierarchy={hierarchy} selectedMember={selectedMember} handleMemberClick={handleMemberClick} />
      </div>

      <div className="w-2/3">
        {selectedMember ? <MemberDashboard member={selectedMember} setSelectedMember = {setSelectedMember} /> : <EmptySelectionState />}
      </div>
    </div>
  );
}

export default MemberDirectory;