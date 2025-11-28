import { ChevronUpIcon } from "@heroicons/react/24/solid";
import type { TreeNode } from "../../models/SupabaseDataModel";
import { PersonCard } from "./PersonCard";
import { ChevronDownIcon, ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import type { CardActionProps } from "../../hooks/usePersonCardActions";

interface ParentNodeGroupProps {
  member: TreeNode;
  isExpanded: boolean;
  hasChildren: boolean;
  onToggleExpand: () => void;
  cardActionProps: CardActionProps;
}

function ParentNodeGroup({ member, isExpanded, hasChildren, onToggleExpand, cardActionProps }: ParentNodeGroupProps) {
  const primarySpouse = member.spouses.length > 0 ? member.spouses[0] : null;

  const parentNode_couple = () => {
    const primaryMemberCard = () => {
      return (
        <>
          <div className="z-10">
            <PersonCard member={member} {...cardActionProps} />
          </div>
        </>
      );
    };

    const spouseCard = () => {
      return (
        <>
          {primarySpouse && (
            <div className="z-10">
              <PersonCard member={primarySpouse} {...cardActionProps} />
            </div>
          )}
        </>
      );
    };

    const coupleConnector = () => {
      return (
        <>
          <>
            <div className="flex h-full items-center justify-center relative">
              {/* The actual line element is now tiny, centered, and placed at the desired vertical position. */}
              <ArrowLeftIcon className="h-4 w-4" />
              <div className="border-t-2 border-dashed border-accent-primary w-16 z-0"></div>
              <ArrowRightIcon className="h-4 w-4" />
            </div>
          </>
        </>
      );
    };

    return (
      <>
        <div className="flex items-start justify-center relative pr-xl pl-xl">
          {/* 1. Primary Member Card (The anchor of this family unit) */}
          {primaryMemberCard()}
          {/* --- Marriage Connector Line (New Central Element) --- */}
          {primarySpouse && coupleConnector()}
          {/* 2. Spouse Card */}
          {spouseCard()}
        </div>
      </>
    );
  };

  return (
    <>
      <div className="flex justify-center relative pr-xl pl-xl">
        {parentNode_couple()}

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
