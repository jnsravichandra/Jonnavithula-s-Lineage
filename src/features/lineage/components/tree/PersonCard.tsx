import { TrashIcon } from '@heroicons/react/24/solid';
import type { TreeNode } from '../../../../shared/datamodels';
import { useAuth } from '../../../../shared/hooks/useAuth';
import type { PersonCardActionType } from '../../types';
import { getLifeSpan } from '../../../../shared/utils/utils';
import MemberQuickActions from '../shared/MemberQuickActions';

interface PersonCardProps {
  person: TreeNode;
  personCardActions: PersonCardActionType;
  variant?: 'default' | 'spouse';
}

export const PersonCard = ({ person, personCardActions, variant = 'default' }: PersonCardProps) => {
  const { isLoggedIn } = useAuth();
  const memberId = person.member_id;
  const isFocused = personCardActions.data.focusedMemberId === memberId;
  const isUnlinkedMember =
    (person.parents?.length === 0 || person.parents === undefined) &&
    (person.spouses?.length === 0 || person.spouses === undefined) &&
    (person.children?.length === 0 || person.children === undefined);

  const primarySpouse = person.spouses ? (person.spouses.length > 0 ? person.spouses[0] : null) : null;
  const spouseName = primarySpouse ? primarySpouse.full_name : 'N/A';

  return (
    <>
      <div
        onClick={(e) => {
          e.stopPropagation();
          personCardActions.handlers.onSelect(memberId);
        }}
        className={`bg-background-secondary p-4 rounded-lg shadow-md w-85 relative transition-all 
          ${
            (person.spouses?.length === 0 || person.spouses === undefined) && (person.children?.length === 0 || person.children === undefined)
              ? 'h-65'
              : 'h-65'
          }
          ${variant === 'spouse' ? 'border-2 border-dashed' : 'border border-solid'}
          ${isFocused ? 'ring-2 ring-accent-primary' : ''}`}
      >
        {/* Action buttons top right */}
        {isLoggedIn && (
          <>
            <div className="absolute top-2 right-2 flex gap-2 bg-accent-primary rounded-full  shadow-md">
              {/* Quick Actions Menu */}
              <MemberQuickActions
                member={person.member!}
                isUnlinkedMember={isUnlinkedMember}
                onEdit={() => personCardActions.handlers.onEdit(memberId)}
                onLink={() => personCardActions.handlers.onLink(memberId)}
                onShare={() => personCardActions.handlers.onShare(memberId)}
                onAddSpouse={() => personCardActions.handlers.onAdd1('Spouse', memberId)}
                onAddChild={() => personCardActions.handlers.onAdd1('Child', memberId)}
                onAddParent={() => personCardActions.handlers.onAdd1('Parent', memberId)}
              />
              {/* 
              // Edit Member Details Button
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

              Link Member Button
              {isUnlinkedMember && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    personCardActions.handlers.onLink(memberId);
                  }}
                  className="p-1 hover:bg-background-primary rounded-full"
                  title="Link Member"
                >
                  <LinkIcon className="h-5 w-5 text-text-secondary" />
                </button>
              )}
              Add Member Button
              {!isUnlinkedMember && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    personCardActions.handlers.onAdd(memberId, e);
                  }}
                  className="p-1 hover:bg-background-primary rounded-full"
                >
                  <UserPlusIcon className="h-5 w-5 text-text-secondary" />
                </button>
              )} */}

              {/* Delete Member Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  personCardActions.handlers.onDelete(person.member!);
                }}
                className="p-2 hover:bg-accent-secondary rounded-full transition-colors"
              >
                <TrashIcon className="h-5 w-5 text-background-primary" />
              </button>
            </div>
          </>
        )}

        {/* Top section: Image and Name */}
        <div className="flex items-center gap-4 my-4">
          {/* Image */}
          <div
            className={`w-18 h-18 bg-background-primary rounded-full shrink-0 
            flex items-center justify-center text-2xl text-text-primary font-bold overflow-hidden
            ${
              isFocused ? 'border-6 border-accent-primary' : `border-4 ${person.member?.gender === 'Female' ? 'border-pink-300' : 'border-blue-300'}`
            }`}
          >
            {person.member?.profile_picture_url ? (
              <img src={person.member?.profile_picture_url} alt={person.member?.first_name} className="w-full h-full object-cover" />
            ) : (
              person.member?.full_name?.charAt(0)
            )}
          </div>
          {/* Name */}
          <div className="mt-0">
            <h2 className="text-lg font-bold text-text-primary">{person.member?.full_name}</h2>
            <p className="text-sm text-text-secondary">
              {person.member?.birth_date && person.member?.death_date && getLifeSpan(person.member?.birth_date, person.member?.death_date)}
            </p>
          </div>
        </div>

        {/* Bottom section: Additional Details */}
        <div className="border-t bg-background-secnondary pt-2 space-y-1">
          <div>
            <span className="text-sm font-semibold text-text-primary">Spouse: </span>
            <span className="text-sm text-text-secondary">{spouseName || 'N/A'}</span>
          </div>
          <div>
            <span className="text-sm font-semibold text-text-primary">Profession: </span>
            <span className="text-sm text-text-secondary">{person.member?.profession || 'N/A'}</span>
          </div>
          <div>
            <span className="text-sm font-semibold text-text-primary">Born: </span>
            <span className="text-sm text-text-secondary">{person.member?.birth_place || 'N/A'}</span>
          </div>
          <div className="hidden">
            <span className="text-sm font-semibold text-text-primary">Notes: </span>
            <span className="text-sm text-text-secondary italic">{person.member?.notes || ''}</span>
          </div>
        </div>
      </div>
    </>
  );
};
