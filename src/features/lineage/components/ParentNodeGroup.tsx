import { ChevronUpIcon } from '@heroicons/react/24/solid';
import type { TreeNode } from '../../../shared/datamodels/SupabaseDataModel';
import { PersonCard } from './PersonCard';
import { ChevronDownIcon, HeartIcon } from '@heroicons/react/24/solid';
import type { PersonCardActionType } from '../types';

interface ParentNodeGroupProps {
  member: TreeNode;
  isExpanded: boolean;
  hasChildren: boolean;
  onToggleExpand: () => void;
  personCardActions: PersonCardActionType;
}

function ParentNodeGroup({ member, isExpanded, hasChildren, onToggleExpand, personCardActions }: ParentNodeGroupProps) {
  const primarySpouse = member.spouses.length > 0 ? member.spouses[0] : null;

  return (
    <>
      <div className="flex justify-center relative pr-xl pl-xl pb-10">
        <div className="flex items-start justify-center relative pr-xl pl-xl">
          {/* 1. Primary Member Card */}
          <div className="z-10">
            <PersonCard member={member} personCardActions={personCardActions} />
          </div>

          {/* 2. Marriage Connector */}
          {primarySpouse && (
            <div className="flex h-full items-center justify-center relative px-2 self-center mt-32">
              <div className="border-t-2 border-text-secondary/30 w-8"></div>
              <HeartIcon className="h-6 w-6 text-red-400 mx-1" title="Married" />
              <div className="border-t-2 border-text-secondary/30 w-8"></div>
            </div>
          )}

          {/* 3. Spouse Card */}
          {primarySpouse && (
            <div className="z-10">
              <PersonCard member={primarySpouse} personCardActions={personCardActions} variant="spouse" />
            </div>
          )}
        </div>

        {/* 3. Expand/Collapse Button (Placed below the center of the couple) */}
        {hasChildren && (
          <button
            onClick={onToggleExpand}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 p-1 bg-text-primary text-background-primary rounded-full shadow-lg hover:bg-background-secondary transition border-4 border-highlight"
            title={isExpanded ? 'Collapse Children' : 'Expand Children'}
          >
            {isExpanded ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
          </button>
        )}
      </div>
    </>
  );
}

export default ParentNodeGroup;
