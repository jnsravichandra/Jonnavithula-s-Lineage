import { FamilyGroup } from '..';
import type { TreeNode } from '../../../../shared/datamodels/SupabaseDataModel';
import type { PersonCardActionType } from '../../types';

interface FamilyTreeViewProps {
  rootNode: TreeNode | null;
  personCardActions: PersonCardActionType;
  closeAddContextMenu: () => void;
}

function FamilyTreeView({ rootNode, personCardActions, closeAddContextMenu }: FamilyTreeViewProps) {
  return (
    rootNode && (
      <div
        className="flex py-xl overflow-auto w-full h-full"
        onClick={() => {
          personCardActions.handlers.onSelect('');
          closeAddContextMenu();
        }}
      >
        <div className="min-w-fit m-auto">
          <FamilyGroup member={rootNode} personCardActions={personCardActions} />
        </div>
      </div>
    )
  );
}

export default FamilyTreeView;