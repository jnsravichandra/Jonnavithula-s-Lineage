import { useState, useEffect } from 'react';
import type { TreeNode } from '../../../../shared/datamodels';
import type { PersonCardActionType } from '../../types';
import ParentNodeGroup from './ParentNodeGroup';
import { TreeConnectors } from '..';

interface FamilyGroupProps {
  member: TreeNode;
  personCardActions: PersonCardActionType;
  initialExpanded?: boolean;
}

function FamilyGroup({ member, personCardActions, initialExpanded = true }: FamilyGroupProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [isOverflowVisible, setIsOverflowVisible] = useState(initialExpanded);
  const [resetKey, setResetKey] = useState(0);
  const [childExpanded, setChildExpanded] = useState(initialExpanded);
  const hasChildren = member.children.length > 0;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isExpanded) {
      timer = setTimeout(() => setIsOverflowVisible(true), 500);
    } else {
      timer = setTimeout(() => {
        setChildExpanded(false);
        setResetKey((prev) => prev + 1);
      }, 500);
    }
    return () => clearTimeout(timer);
  }, [isExpanded]);

  const onToggleExpand = () => {
    if (isExpanded) {
      setIsOverflowVisible(false);
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center">
        {/* 1. Render the Parent Node Group (Horizontal Layout & Collapse/Expand Button) */}
        <ParentNodeGroup
          member={member}
          isExpanded={isExpanded}
          hasChildren={hasChildren}
          onToggleExpand={onToggleExpand}
          personCardActions={personCardActions}
        />

        {/* 2. Children Renderer (Recursive Step, Conditional Rendering) */}
        {hasChildren && (
          <div className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className={`${isOverflowVisible ? 'overflow-visible' : 'overflow-hidden'} p-4 w-fit mx-auto`}>
              <div className="pt-4 relative">
                {/* Line 1: Vertical line from Parent to Children's Horizontal Line */}
                <TreeConnectors type="parent-to-children" /> 
                <div className="flex justify-center relative">
                  {/* Line 2: Horizontal Line connecting all siblings */}
                  <TreeConnectors type="sibling-connector" /> 
                  {member.children.map((child: TreeNode) => (
                    <div key={child.member_id} className="pt-4 relative shrink-0">
                      {/* Line 3: Vertical Line from Sibling Line to Child's Group */}
                      <TreeConnectors type="child-vertical" />
                      <FamilyGroup
                        key={`${child.member_id}-${resetKey}`}
                        member={child}
                        personCardActions={personCardActions}
                        initialExpanded={childExpanded}
                      />
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
