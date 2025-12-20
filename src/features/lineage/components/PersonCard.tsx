import { PencilIcon, UserPlusIcon, TrashIcon, LinkIcon } from '@heroicons/react/24/solid';
import type { TreeNode } from '../../../shared/datamodels/SupabaseDataModel';
import type { PersonCardActionType } from '../types';

interface PersonCardProps {
  member: TreeNode;
  personCardActions: PersonCardActionType;
  variant?: 'default' | 'spouse';
}

export const PersonCard = ({ member, personCardActions, variant = 'default' }: PersonCardProps) => {
  const memberId = member.member_id;
  const isFocused = personCardActions.data.focusedMemberId === memberId;
  const isUnlinkedMember = member.parents.length === 0 && member.spouses.length === 0 && member.children.length === 0;

  const getFullName = () => {
    return [member.first_name, member.middle_name, member.last_name].filter(Boolean).join(' ');
  };

  const getLifeSpan = () => {
    const birthYear = new Date(member.birth_date).getFullYear();
    const deathYear = member.death_date ? new Date(member.death_date).getFullYear() : '';
    return `(${birthYear} - ${deathYear})`;
  };

  const primarySpouse = member.spouses.length > 0 ? member.spouses[0] : null;
  const spouseName = primarySpouse ? [primarySpouse.first_name, primarySpouse.middle_name, primarySpouse.last_name].filter(Boolean).join(' ') : 'N/A';

  return (
    <>
      <div
        onClick={(e) => {
          e.stopPropagation();
          personCardActions.handlers.onSelect(memberId);
        }}
        className={`bg-background-secondary p-4 rounded-lg shadow-md w-85 relative transition-all
          ${member.spouses.length === 0 && member.children.length === 0 ? 'h-65' : 'h-65'}
          ${variant === 'spouse' ? 'border-2 border-dashed border-text-secondary/30' : 'border border-solid border-text-secondary/20'}
          ${isFocused ? 'ring-2 ring-accent-primary' : ''}`}
      >
        {/* Action buttons top right */}
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              personCardActions.handlers.onEdit(memberId);
            }}
            className="p-1 hover:bg-background-primary rounded-full"
            title="Edit Member Details"
          >
            <PencilIcon className="h-5 w-5 text-text-secondary" />
          </button>
          {isUnlinkedMember ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="p-1 hover:bg-background-primary rounded-full"
              title="Link Member"
            >
              <LinkIcon className="h-5 w-5 text-text-secondary" />
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                personCardActions.handlers.onAdd(memberId, e);
              }}
              className="p-1 hover:bg-background-primary rounded-full"
            >
              <UserPlusIcon className="h-5 w-5 text-text-secondary" />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              personCardActions.handlers.onDelete(member);
            }}
            className="p-1 hover:bg-background-primary rounded-full"
          >
            <TrashIcon className="h-5 w-5 text-text-secondary" />
          </button>
        </div>

        {/* Top section: Image and Name */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className={`w-18 h-18 bg-background-primary rounded-full shrink-0 
            flex items-center justify-center text-2xl text-text-primary font-bold overflow-hidden
            ${isFocused ? 'border-6 border-accent-primary' : `border-4 ${member.gender === 'Female' ? 'border-pink-300' : 'border-blue-300'}`}`}
          >
            {member.profile_picture_url ? <img src={member.profile_picture_url} alt={member.first_name} className="w-full h-full object-cover" /> : getFullName().charAt(0)}
          </div>
          <div className="mt-4">
            <h2 className="text-lg font-bold text-text-primary">{getFullName()}</h2>
            <p className="text-sm text-text-secondary">{getLifeSpan()}</p>
          </div>
        </div>

        {/* Bottom section: Additional Details */}
        <div className="border-t bg-background-secondary pt-2 space-y-1">
          <div>
            <span className="text-sm font-semibold text-text-primary">Spouse: </span>
            <span className="text-sm text-text-secondary">{spouseName || 'N/A'}</span>
          </div>
          <div>
            <span className="text-sm font-semibold text-text-primary">Profession: </span>
            <span className="text-sm text-text-secondary">{member.profession || 'N/A'}</span>
          </div>
          <div>
            <span className="text-sm font-semibold text-text-primary">Born: </span>
            <span className="text-sm text-text-secondary">{member.birth_place || 'N/A'}</span>
          </div>
          <div className="hidden">
            <span className="text-sm font-semibold text-text-primary">Notes: </span>
            <span className="text-sm text-text-secondary italic">{member.notes || ''}</span>
          </div>
        </div>
      </div>
    </>
  );
};
