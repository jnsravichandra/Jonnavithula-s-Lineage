// TreePersonCard.tsx
import React from 'react';
import type { TreeNode } from '../../../../shared/datamodels';

interface TreePersonCardProps {
  person: TreeNode;
  isFocused: boolean;
  hasChildren: boolean;
  isCollapsed: boolean;
  onToggle: () => void;
  onSelect: () => void;
}

export const TreePersonCard: React.FC<TreePersonCardProps> = ({ person, isFocused, hasChildren, isCollapsed, onToggle, onSelect }) => {
  const fullName = person.full_name ?? `${person.member?.first_name ?? ''} ${person.member?.last_name ?? ''}`.trim();
  const birthYear = person.member?.birth_date ? new Date(person.member.birth_date).getFullYear() : '';
  const deathYear = person.member?.death_date ? new Date(person.member.death_date).getFullYear() : '';
  const lifeSpan = birthYear || deathYear ? `(${birthYear || '…'} - ${deathYear || '…'})` : '';

  const gender = person.member?.gender;
  const genderBorder = gender === 'Female' ? 'border-pink-300' : gender === 'Male' ? 'border-blue-300' : 'border-gray-300';

  return (
    <div
      className={`bg-white rounded-md shadow-sm border ${genderBorder} px-3 py-2 text-xs min-w-[140px] max-w-[180px] cursor-pointer
                  ${isFocused ? 'ring-2 ring-indigo-500' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-semibold overflow-hidden
                      ${genderBorder}`}
        >
          {person.member?.profile_picture_url ? (
            <img src={person.member.profile_picture_url} alt={fullName} className="w-full h-full object-cover" />
          ) : (
            fullName.charAt(0)
          )}
        </div>
        <div className="flex-1">
          <div className="font-semibold leading-tight">{fullName || 'Unknown'}</div>
          {lifeSpan && <div className="text-[10px] text-gray-500">{lifeSpan}</div>}
        </div>
      </div>

      <div className="mt-1 flex items-center justify-between text-[10px] text-gray-600">
        <span>{person.member?.profession || ''}</span>
        {hasChildren && (
          <button
            className="text-[10px] text-indigo-600 hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            {isCollapsed ? 'Expand' : 'Collapse'}
          </button>
        )}
      </div>
    </div>
  );
};
