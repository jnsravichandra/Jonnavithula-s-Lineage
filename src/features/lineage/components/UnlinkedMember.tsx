import type { TreeNode } from '../../../shared/datamodels/SupabaseDataModel';
import { PersonCard } from '..';
import type { PersonCardActionType } from '../types';

interface UnlinkedMemberProps {
  unlinkedNodes: TreeNode[];
  personCardActions: PersonCardActionType;
}

function UnlinkedMembers({ unlinkedNodes, personCardActions }: UnlinkedMemberProps) {
  return (
    <>
      <div className="flex flex-wrap justify-center">
        {unlinkedNodes.length > 0 &&
          unlinkedNodes.map((node: TreeNode) => (
            <span key={node.member_id} className="p-2 ">
              <PersonCard
                member={node}
                personCardActions={personCardActions}
              />
            </span>
          ))}
        {unlinkedNodes.length === 0 && (
          <>
            <h1>No unlinked members found.</h1>
          </>
        )}
      </div>
    </>
  );
}

export default UnlinkedMembers;
