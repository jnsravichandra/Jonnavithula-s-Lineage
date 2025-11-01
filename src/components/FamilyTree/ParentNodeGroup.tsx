import { ChevronUpIcon } from "@heroicons/react/24/solid";
import type { TreeNode } from "../../models/SupabaseDataModel";
import { PersonCard } from "./PersonCard";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

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
      <div className="flex justify-center relative">
        {/* 1. Primary Member Card (The anchor of this family unit) */}
        <div className="mx-8">
          <PersonCard member={member} />
        </div>

        {/* --- Marriage Connector Line (CSS Border/Div) --- */}
        {primarySpouse && (
          // This absolute div is positioned to stretch exactly between the two card centers
          <div
            className="absolute h-0 border-t-2 border-dashed border-gray-500 top-1/2 left-1/2 transform -translate-x-1/2 z-0"
            // Tailwind doesn't have a utility for "calc(100% - X)", so we use inline style:
            style={{ width: "calc(100% - 100px)", marginLeft: "50px" }}
          />
        )}

        {/* 2. Spouse Card */}
        {primarySpouse && (
          <div className="mx-8">
            <PersonCard member={primarySpouse} />
          </div>
        )}

        {/* 3. Expand/Collapse Button (Placed below the center of the couple) */}
        {hasChildren && (
          <button
            onClick={onToggleExpand}
            className="absolute -bottom-4 z-10 p-1 bg-teal-500 text-white rounded-full shadow-lg hover:bg-teal-600 transition border-4 border-white"
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
