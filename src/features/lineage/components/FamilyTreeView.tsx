import type { TreeNode } from '../../../shared/datamodels/SupabaseDataModel';
import { ContextMenu } from '../../../shared/components/ui/ContextMenu';
import FamilyGroup from './FamilyGroup';
import type { ContextMenuState, PersonCardHandlers } from '../types';

interface FamilyTreeViewProps {
  rootNode: TreeNode;
  handlers: PersonCardHandlers;
  addContextMenu: ContextMenuState;
  closeAddContextMenu: () => void;
  addContextMenuOptions: { label: string; action: () => void }[];
}

function FamilyTreeView({ rootNode, handlers, addContextMenu, closeAddContextMenu, addContextMenuOptions }: FamilyTreeViewProps) {
  return (
    <>
      {rootNode && (
        <div
          className="flex py-xl overflow-auto"
          onClick={() => {
            handlers.onSelect('');
            closeAddContextMenu();
          }}
        >
          {addContextMenu && <ContextMenu x={addContextMenu.x} y={addContextMenu.y} options={addContextMenuOptions} onClose={closeAddContextMenu} />}
          <FamilyGroup member={rootNode!} cardActionProps={handlers} />
        </div>
      )}
    </>
  );
}

export default FamilyTreeView;
