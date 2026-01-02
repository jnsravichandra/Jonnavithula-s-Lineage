import { FamilyGroup } from '..';
import type { FamilyTreeDataType } from '../../hooks';
import type { PersonCardActionType } from '../../types';

interface FamilyTreeViewProps {
  familyTreeData: FamilyTreeDataType
  personCardActions: PersonCardActionType;
}

function FamilyTreeView({ familyTreeData, personCardActions }: FamilyTreeViewProps) {
  return (
    familyTreeData.hierarchy?.data && (
      <div
        className="flex py-xl overflow-auto w-full h-full"
        onClick={() => {
          personCardActions.handlers.onSelect('');
          personCardActions.ui.contextMenu.close();
        }}
      >
        <div className="min-w-fit m-auto">
          <FamilyGroup hierarchyData={familyTreeData.hierarchy} personCardActions={personCardActions} />
        </div>
      </div>
    )
  );
}

export default FamilyTreeView;