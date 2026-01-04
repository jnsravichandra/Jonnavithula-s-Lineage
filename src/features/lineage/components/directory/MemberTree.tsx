import { ChevronRightIcon, ChevronDownIcon, LinkIcon } from '@heroicons/react/24/solid';
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
  const fullName = member.full_name;
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(memberId);

  return (
    <li className="my-sm w-fit">
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
          <span className="w-2 mr-1"></span>
        )}
        <div className="flex flex-col items-start gap-2 p-2 rounded-md border-b border-dashed border-text-secondary">
          <div
            onClick={() => handleMemberClick(memberId)}
            className={`cursor-pointer px-sm py-sm rounded hover:bg-accent-primary hover:text-background-primary transition-colors duration-300 border ${
              selectedMember?.member_id === member.member_id ? 'bg-accent-primary text-background-primary font-bold hover:text-text-primary' : 'bg-background-secondary text-text-primary'
            } 
            ${member.member?.gender === 'Male' ? 'border-blue-500' : member.member?.gender === 'Female' ? 'border-pink-500' : 'border-text-primary'}
            `}
          >
            {fullName === 'Root' ? "Jonnavithula's" : <p>{fullName}</p>}
          </div>
          {member.spouses && member.spouses.length > 0 && (
            <>
            <LinkIcon className="w-3 h-3 self-center" />
              <div className=" ">
                {member.spouses.map((spouse) => (
                  <div
                    key={spouse.member_id + spouse.full_name}
                    onClick={() => handleMemberClick(spouse.member_id)}
                    className={`cursor-pointer px-sm py-sm rounded hover:bg-accent-primary hover:text-background-primary transition-colors duration-300 border ${
                      selectedMember?.member_id === spouse.member_id
                        ? 'bg-accent-primary text-background-primary font-bold hover:text-text-primary'
                        : 'bg-background-secondary text-text-primary'
                    }
                    ${spouse.member?.gender === 'Male' ? 'border-blue-500' : spouse.member?.gender === 'Female' ? 'border-pink-500' : 'border-text-primary'}
                    `}
                  >
                    {spouse.full_name}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      {hasChildren && (
        <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <div className="overflow-hidden min-w-max">
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
