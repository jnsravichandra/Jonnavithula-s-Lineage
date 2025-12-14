import type {
  CardActionProps,
  ContextMenuState,
} from "../../hooks/usePersonCardActions";
import type { TreeNode } from "../../models/SupabaseDataModel";
import { ContextMenu } from "../shared/ContextMenu";
import FamilyGroup from "./FamilyGroup";

interface FamilyTreeViewProps {
  rootNode: TreeNode;
  cardActions: CardActionProps;
  addContextMenu: ContextMenuState;
  closeAddContextMenu: () => void;
  addContextMenuOptions: { label: string; action: () => void }[];
}

function FamilyTreeView({
  rootNode,
  cardActions,
  addContextMenu,
  closeAddContextMenu,
  addContextMenuOptions,
}: FamilyTreeViewProps) {
  return (
    <>
      {rootNode && (
        <div
          className="flex py-xl overflow-auto"
          onClick={() => {
            cardActions.onSelect("");
            closeAddContextMenu();
          }}
        >
          {addContextMenu && (
            <ContextMenu
              x={addContextMenu.x}
              y={addContextMenu.y}
              options={addContextMenuOptions}
              onClose={closeAddContextMenu}
            />
          )}
          <FamilyGroup member={rootNode!} cardActionProps={cardActions} />
        </div>
      )}
    </>
  );
}

export default FamilyTreeView;
