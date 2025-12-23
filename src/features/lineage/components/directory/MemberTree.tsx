import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import type { HierarchyNode } from 'd3';
import type { Member, TreeNode } from '../../../../shared/datamodels/SupabaseDataModel';

interface MemberTreeNodeProps {
  node: HierarchyNode<TreeNode>;
  expandedNodes: Set<string>;
  toggleExpand: (id: string) => void;
  selectedMember: Member | null;
  handleMemberClick: (id: string) => void;
}

const MemberTree = ({ node, expandedNodes, toggleExpand, selectedMember, handleMemberClick }: MemberTreeNodeProps) => {
  const member = node.data;
  const memberId = member.member_id;
  const fullName = [member.first_name, member.middle_name, member.last_name].filter(Boolean).join(' ');
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(memberId);

  return (
    <li className="my-sm">
      <div className="flex items-center">
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(memberId);
            }}
            className="p-xs hover:bg-background-secondary rounded mr-xs text-text-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            {isExpanded ? <ChevronDownIcon className="w-6 h-6" /> : <ChevronRightIcon className="w-6 h-6" />}
          </button>
        ) : (
          <span className="w-6 mr-1"></span>
        )}
        <div
          onClick={() => handleMemberClick(memberId)}
          className={`cursor-pointer px-sm py-sm rounded hover:bg-accent-primary hover:text-background-primary transition-colors duration-300 flex-grow ${
            selectedMember?.member_id === member.member_id ? 'bg-accent-primary text-background-primary font-bold hover:text-text-primary' : ''
          }`}
        >
          {fullName}
        </div>
      </div>
      {hasChildren && (
        <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <div className="overflow-hidden">
            <ul className="pl-4 border-l-2 border-text-secondary ml-sm list-none">
              {node.children!.map((child) => (
                <MemberTree
                  key={child.data.member_id}
                  node={child}
                  expandedNodes={expandedNodes}
                  toggleExpand={toggleExpand}
                  selectedMember={selectedMember}
                  handleMemberClick={handleMemberClick}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
};

export default MemberTree;