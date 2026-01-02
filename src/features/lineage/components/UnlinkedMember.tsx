import type { Member, TreeNode } from '../../../shared/datamodels/SupabaseDataModel';
import { PersonCard, type FamilyTreeDataType } from '..';
import type { PersonCardActionType } from '../types';
import { useEffect, useState } from 'react';

interface UnlinkedMemberProps {
  familyTreeData: FamilyTreeDataType;
  personCardActions: PersonCardActionType;
}

function UnlinkedMembers({ familyTreeData, personCardActions }: UnlinkedMemberProps) {
  const [unlinkedNodes, setUnlinkedNodes] = useState<TreeNode[]>();

  useEffect(() => {
    const getUnlinkedNodes = () => {
      return familyTreeData.unassociatedMembers.map((member: Member) => {
        const node: TreeNode = {
          member_id: member.member_id ? member.member_id : '',
          member: member,
        };
        return node;
      });
    };
    setUnlinkedNodes(getUnlinkedNodes());
  }, [familyTreeData.unassociatedMembers]);
  // console.log(unlinkedNodes);
  return (
    <>
      <div className="flex flex-wrap justify-center">
        {unlinkedNodes &&
          unlinkedNodes.length > 0 &&
          unlinkedNodes.map((node: TreeNode) => (
            // console.log(node),
            <span key={node.member_id} className="p-2 ">
              <PersonCard person={node} personCardActions={personCardActions} />
            </span>
          ))}
        {unlinkedNodes && unlinkedNodes.length === 0 && (
          <>
            <h1>No unlinked members found.</h1>
          </>
        )}
      </div>
    </>
  );
}

export default UnlinkedMembers;
