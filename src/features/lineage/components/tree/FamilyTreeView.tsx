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
        className="flex py-sm overflow-auto"
        onClick={() => {
          personCardActions.handlers.onSelect('');
          closeAddContextMenu();
        }}
      >
        <FamilyGroup member={rootNode} personCardActions={personCardActions} />
      </div>
    )
  );
}

export default FamilyTreeView;