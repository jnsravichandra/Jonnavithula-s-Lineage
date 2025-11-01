import { ChevronUpIcon } from "@heroicons/react/24/solid";
import type { TreeNode } from "../../models/SupabaseDataModel";
import { PersonCard } from "./PersonCard";
import { ChevronDownIcon, ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

interface ParentNodeGroupProps {
  member: TreeNode;
  isExpanded: boolean;
  hasChildren: boolean;
  onToggleExpand: () => void;
}

function ParentNodeGroup({ member, isExpanded, hasChildren, onToggleExpand }: ParentNodeGroupProps) {
  const primarySpouse = member.spouses.length > 0 ? member.spouses[0] : null;

  return (
    <>
      <div className="flex justify-center relative pr-xl pl-xl">
        <div className="flex items-start justify-center relative pr-xl pl-xl">
          {/* 1. Primary Member Card (The anchor of this family unit) */}
          <div className="z-10">
            <PersonCard member={member} />
          </div>

          {/* --- Marriage Connector Line (New Central Element) --- */}
          {primarySpouse && (
            // The line is now an independent flex item that sits between the cards.
            // We use h-full to make the container visible for positioning the line itself.
            <>
              <div className="flex h-full items-center justify-center relative">
                {/* The actual line element is now tiny, centered, and placed at the desired vertical position. */}
                <ArrowLeftIcon className="h-4 w-4" />
                <div className="border-t-2 border-dashed border-accent-primary w-16 z-0" >
                </div>
                <ArrowRightIcon className="h-4 w-4" />
              </div>
            </>
          )}

          {/* 2. Spouse Card */}
          {primarySpouse && (
            <div className="z-10">
              <PersonCard member={primarySpouse} />
            </div>
          )}
        </div>

        {/* 3. Expand/Collapse Button (Placed below the center of the couple) */}
        {hasChildren && (
          <button
            onClick={onToggleExpand}
            className="absolute -bottom-1/10 z-10 p-1 bg-text-primary text-background-primary rounded-full shadow-lg hover:bg-background-secondary transition border-4 border-highlight"
            title={isExpanded ? "Collapse Children" : "Expand Children"}
          >
            {isExpanded ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
          </button>
        )}
      </div>
    </>
  );
}

export default ParentNodeGroup;
