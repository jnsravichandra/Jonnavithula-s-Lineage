import type { HierarchyNode } from 'd3';
import type { Member, TreeNode } from '../../../../shared/datamodels/SupabaseDataModel';
import { useTreeExpansion } from '../../hooks/useTreeExpansion';
import { MemberTree } from '..';

interface MemberTreeContainerProps {
  hierarchy: HierarchyNode<TreeNode> | null;
  selectedMember: Member | null;
  handleMemberClick: (id: string) => void;
}

const BUTTON_CLASSES =
  'px-sm py-sm text-sm font-medium text-text-primary bg-background-secondary rounded hover:bg-accent-primary hover:text-background-primary focus:outline-none focus:ring-2 focus:ring-gray-500';

export default function MemberTreeContainer({ hierarchy, selectedMember, handleMemberClick }: MemberTreeContainerProps) {
  const { expandedNodes, toggleExpand, expandAll, collapseAll } = useTreeExpansion(hierarchy);

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-4">Member Directory</h1>
      <div className="flex gap-2 mb-4">
        <button onClick={expandAll} className={BUTTON_CLASSES}>
          Expand All
        </button>
        <button onClick={collapseAll} className={BUTTON_CLASSES}>
          Collapse All
        </button>
      </div>
      {hierarchy ? (
        <ul className="list-none pl-0 overflow-y-auto max-h-[70vh]">
          <MemberTree
            node={hierarchy}
            expandedNodes={expandedNodes}
            toggleExpand={toggleExpand}
            selectedMember={selectedMember}
            handleMemberClick={handleMemberClick}
          />
        </ul>
      ) : (
        <p>No members found.</p>
      )}
    </div>
  );
}
