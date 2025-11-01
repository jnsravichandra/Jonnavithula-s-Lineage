import type { TreeNode } from "../../models/SupabaseDataModel";
import { useState } from "react";
import ParentNodeGroup from "./ParentNodeGroup";
import { TreeConnectors } from "./TreeConnectors";

interface FamilyGroupProps {
  member: TreeNode;
}

function FamilyGroup({ member }: FamilyGroupProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  // const primarySpouse = member.spouses.length > 0 ? member.spouses[0] : null;
  const hasChildren = member.children.length > 0;

  return (
    <>
      <div className="flex flex-col items-center">
        {/* 1. Render the Parent Node Group (Horizontal Layout & Collapse/Expand Button) */}
        <ParentNodeGroup member={member} isExpanded={isExpanded} hasChildren={hasChildren} onToggleExpand={() => setIsExpanded(!isExpanded)} />

        {/* 2. Children Renderer (Recursive Step, Conditional Rendering) */}
        {hasChildren && isExpanded && (
          <>
            <div className="mt-8 pt-6 relative">
              {/* Line 1: Vertical line from Parent to Children's Horizontal Line */}
              <TreeConnectors type="parent-to-children" />

              <div className="flex justify-center relative">
                {/* Line 2: Horizontal Line connecting all siblings */}
                <TreeConnectors type="sibling-connector" />
                {member.children.map((child) => (
                  <>
                    <div key={child.member_id} className="pt-6 relative">
                      {/* Line 3: Vertical Line from Sibling Line to Child's Group */}
                      <TreeConnectors type="child-vertical" />
                      <FamilyGroup member={child} />
                    </div>
                  </>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default FamilyGroup;
