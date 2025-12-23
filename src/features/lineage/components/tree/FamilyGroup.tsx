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

function FamilyGroup({ member, personCardActions, initialExpanded = false }: FamilyGroupProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [isOverflowVisible, setIsOverflowVisible] = useState(initialExpanded);
  const [resetKey, setResetKey] = useState(0);
  const [childExpanded, setChildExpanded] = useState(initialExpanded);
  const hasChildren = member.children && member.children.length > 0;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isExpanded) {
      timer = setTimeout(() => setIsOverflowVisible(true), 500);
    } else {
      setIsOverflowVisible(false); // Immediate hide on collapse to prevent scrollbars
      timer = setTimeout(() => {
        setChildExpanded(false);
        setResetKey((prev) => prev + 1);
      }, 500);
    }
    return () => clearTimeout(timer);
  }, [isExpanded]);

  const onToggleExpand = () => {
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* 1. Parent Node */}
      <ParentNodeGroup
        member={member}
        isExpanded={isExpanded}
        hasChildren={hasChildren}
        onToggleExpand={onToggleExpand}
        personCardActions={personCardActions}
      />

      {/* 2. Children Renderer */}
      {hasChildren && (
        <div 
          className={`grid transition-all duration-500 ease-in-out ${
            isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          {/* FIX 1: Use min-w-max to prevent cards from squishing/truncating. 
              FIX 2: Reduced padding from p-4 to px-1 or p-2 to tighten spacing.
          */}
          <div className={`${isOverflowVisible ? 'overflow-visible' : 'overflow-hidden'} px-2 min-w-max mx-auto`}>
            <div className="pt-4 relative">
              
              <TreeConnectors type="parent-to-children" /> 
              
              {/* FIX 3: Use a tight gap between siblings instead of large padding */}
              <div className="flex justify-center relative gap-x-4">
                <TreeConnectors type="sibling-connector" /> 
                
                {member.children.map((child: TreeNode) => (
                  <div key={child.member_id} className="pt-4 relative shrink-0">
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
  );
}

export default FamilyGroup;