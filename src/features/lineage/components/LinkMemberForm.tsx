import { useState, useMemo, useRef, useEffect } from 'react';
import type { PersonCardActionType } from '../types';
import type { TransformedTreeType } from '../utils/transformToTree';
import type { TreeNode } from '../../../shared/datamodels/SupabaseDataModel';
import Label from '../../../shared/components/ui/Label';
import { MemberRelationsManagementService } from '../services';
import toast from 'react-hot-toast';

interface LinkMemberFormProps {
  transformedTree?: TransformedTreeType;
  personCardActions: PersonCardActionType;
}

function LinkMemberForm({ transformedTree, personCardActions }: LinkMemberFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTarget, setSelectedTarget] = useState<TreeNode | null>(null);
  const [relationship, setRelationship] = useState<'parent' | 'spouse' | 'child'>('parent');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredMembers = useMemo(() => {
    const linkedMembers = transformedTree?.linkedNodes || [];
    if (!searchTerm) return linkedMembers;
    const lowerTerm = searchTerm.toLowerCase();
    return linkedMembers.filter((m) => {
      const fullName = [m.first_name, m.middle_name, m.last_name].filter(Boolean).join(' ').toLowerCase();
      return fullName.includes(lowerTerm);
    });
  }, [transformedTree, searchTerm]);

  const sourceMember = useMemo(() => {
    return transformedTree?.allNodes.find((n) => n.member_id === personCardActions.data.focusedMemberId);
  }, [transformedTree, personCardActions.data.focusedMemberId]);

  const handleSelectMember = (member: TreeNode) => {
    setSelectedTarget(member);
    setSearchTerm([member.first_name, member.middle_name, member.last_name].filter(Boolean).join(' '));
    setIsDropdownOpen(false);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    let result;
    if (selectedTarget) {
      try {
        if (relationship === 'parent') {
          result = await MemberRelationsManagementService.AddRelationship_Parent(sourceMember!, selectedTarget);
        } else if (relationship === 'spouse') {
          result = await MemberRelationsManagementService.AddRelationship_Spouse(sourceMember!, selectedTarget);
        } else if (relationship === 'child') {
          result = await MemberRelationsManagementService.AddRelationship_Child(sourceMember!, selectedTarget);
        }
        console.log('Result: ',result);
        const message = `${[sourceMember?.first_name, sourceMember?.last_name].filter(Boolean).join(' ')} will be linked as the ${relationship} of ${[
          selectedTarget?.first_name,
          selectedTarget?.last_name,
        ]
          .filter(Boolean)
          .join(' ')}`;

        toast.success(message);
      } catch (e) {
        console.error('Error updating relationship:', e as Error);
      }
    } else {
      console.error('No target selected.');
    }
    setIsLoading(false);
    personCardActions.handlers.onSuccess!();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Searchable Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <Label htmlFor={''} labelText={'Select Family Member'} />
        <input
          type="text"
          className="w-full mt-sm p-sm h-2xl text-2xl rounded-md shadow-sm focus:border-accent-primary bg-background-primary focus:ring-2 outline-none text-text-primary"
          placeholder="Search for a member..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsDropdownOpen(true);
            if (selectedTarget) setSelectedTarget(null);
          }}
          onFocus={() => setIsDropdownOpen(true)}
        />
        {isDropdownOpen && filteredMembers.length > 0 && (
          <ul className="absolute z-10 w-full mt-sm max-h-60 overflow-auto bg-background-secondary border border-text-primary rounded shadow-lg">
            {filteredMembers.map((member) => (
              <li
                key={member.member_id}
                className="p-sm text-xl hover:bg-background-primary cursor-pointer text-text-primary border-b border-text-primary last:border-0"
                onClick={() => handleSelectMember(member)}
              >
                {[member.first_name, member.middle_name, member.last_name].filter(Boolean).join(' ')}
                <span className="text-sm text-text-secondary ml-2">({new Date(member.birth_date).getFullYear()})</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Relationship Radio Group */}
      <div>
        <Label htmlFor={''} labelText={'Relationship'} />
        <div className="flex gap-4">
          {['parent', 'spouse', 'child'].map((rel) => (
            <label key={rel} className="flex items-center gap-2 cursor-pointer text-xl">
              <input
                type="radio"
                name="relationship"
                value={rel}
                checked={relationship === rel}
                onChange={() => setRelationship(rel as 'parent' | 'spouse' | 'child')}
                className="text-accent-primary focus:ring-accent-primary"
              />
              <span className="text-text-primary capitalize">{rel}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Relationship Summary */}
      {selectedTarget && sourceMember && (
        <div className="p-sm bg-background-secondary border border-accent-primary rounded-md text-center">
          <p className="text-text-primary">
            <span className="font-bold">{[sourceMember.first_name, sourceMember.last_name].filter(Boolean).join(' ')}</span>
            {' will be linked as the '}
            <span className="font-bold text-accent-primary uppercase">{relationship}</span>
            {' of '}
            <span className="font-bold">{[selectedTarget.first_name, selectedTarget.last_name].filter(Boolean).join(' ')}</span>
          </p>
        </div>
      )}

      {/* --- Form Actions (Footer) --- */}
      <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={personCardActions.handlers.onClose}
          disabled={isLoading}
          className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="py-2 px-4 bg-accent-primary text-background-primary rounded-md hover:bg-accent-secondary transition disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Update Relationship'}
        </button>
      </div>
    </div>
  );
}

export default LinkMemberForm;
