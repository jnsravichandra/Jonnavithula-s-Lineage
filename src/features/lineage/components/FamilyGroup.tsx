import { useState } from 'react';
import ParentNodeGroup from './ParentNodeGroup';
import { TreeConnectors } from './TreeConnectors';
import type { PersonCardActionType } from '../types';
import type { TreeNode } from '../../../shared/datamodels';

interface FamilyGroupProps {
  member: TreeNode;
  personCardActions: PersonCardActionType;
}

function FamilyGroup({ member, personCardActions }: FamilyGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = member.children.length > 0;

  return (
    <>
      <div className="flex flex-col items-center">
        {/* 1. Render the Parent Node Group (Horizontal Layout & Collapse/Expand Button) */}
        <ParentNodeGroup
          member={member}
          isExpanded={isExpanded}
          hasChildren={hasChildren}
          onToggleExpand={() => setIsExpanded(!isExpanded)}
          personCardActions={personCardActions}
        />

        {/* 2. Children Renderer (Recursive Step, Conditional Rendering) */}
        {hasChildren && (
          <div
            className={`grid transition-all duration-500 ease-in-out ${
              isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className=" p-4">
              <div className="mt-8 pt-6 relative">
                {/* Line 1: Vertical line from Parent to Children's Horizontal Line */}
                <TreeConnectors type="parent-to-children" />
                <div className="flex justify-center relative">
                  {/* Line 2: Horizontal Line connecting all siblings */}
                  <TreeConnectors type="sibling-connector" />
                  {member.children.map((child: TreeNode) => (
                    <div key={child.member_id} className="pt-6 relative">
                      {/* Line 3: Vertical Line from Sibling Line to Child's Group */}
                      <TreeConnectors type="child-vertical" />
                      <FamilyGroup member={child} personCardActions={personCardActions} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default FamilyGroup;
