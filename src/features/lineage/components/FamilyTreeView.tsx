import type { TreeNode } from '../../../shared/datamodels/SupabaseDataModel';
import FamilyGroup from './FamilyGroup';
import type { PersonCardActionType } from '../types';

interface FamilyTreeViewProps {
  rootNode: TreeNode | null;
  personCardActions: PersonCardActionType;
  closeAddContextMenu: () => void;
}

function FamilyTreeView({ rootNode, personCardActions, closeAddContextMenu }: FamilyTreeViewProps) {
  return (
    <>
      {rootNode && (
        <div
          className="flex py-xl overflow-auto"
          onClick={() => {
            personCardActions.handlers.onSelect('');
            closeAddContextMenu();
          }}
        >
          <FamilyGroup member={rootNode} personCardActions={personCardActions} />
        </div>
      )}
    </>
  );
}

export default FamilyTreeView;
