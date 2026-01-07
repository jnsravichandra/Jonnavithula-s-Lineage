import toast from 'react-hot-toast';
import { useState, useRef, useEffect } from 'react';
import Label from '../../../../shared/components/ui/shared/Label';
import type { Member } from '../../../../shared/datamodels';
import { MemberRelationsManagementService } from '../../services';
import type { PersonCardActionType } from '../../types';
import type { FamilyTreeDataType } from '../../hooks';
import FormInput from '../../../../shared/components/ui/shared/FormInput';
import FormSelect from '../../../../shared/components/ui/shared/FormSelect';
import FormTextArea from '../../../../shared/components/ui/shared/FormTextArea';

interface LinkMemberFormProps {
  familyTreeData: FamilyTreeDataType;
  personCardActions: PersonCardActionType;
}

function LinkMemberForm({ familyTreeData, personCardActions }: LinkMemberFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTarget, setSelectedTarget] = useState<Member>({} as Member);
  const [relationship, setRelationship] = useState<'parent' | 'spouse' | 'child'>('parent');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sourceMember, setSourceMember] = useState<Member | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [linkageDetails, setLinkageDetails] = useState({
    relationship_type: 'Biological',
    date_established: '',
    date_terminated: '',
    notes: '',
    relationship_status: '', // Initialize relationship_status
  });

  const [spouseDetails, setSpouseDetails] = useState({
    relationship_status: '',
    start_date: '',
    end_date: '',
    location: '',
    notes: '',
  });

  const handleLinkageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLinkageDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpouseDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSpouseDetails((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    setSourceMember(personCardActions.data.member!);

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [personCardActions.data.member]);

  const linkedMembers: Member[] | undefined = familyTreeData.familyData?.members.filter((m) => {
    const isNotUnassociated = !familyTreeData.unassociatedMembers.includes(m);
    const fullName = [m.first_name, m.middle_name, m.last_name].filter(Boolean).join(' ');
    return isNotUnassociated && fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSelectMember = (member: Member) => {
    setSelectedTarget(member);
    setSearchTerm(member.full_name!);
    setIsDropdownOpen(false);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    let result;
    if (selectedTarget) {
      const payload = {
        ...linkageDetails,
        ...spouseDetails,
      };

      try {
        if (relationship === 'parent') {
          result = await MemberRelationsManagementService.AddRelationship_Parent(sourceMember!, selectedTarget, payload);
        } else if (relationship === 'spouse') {
          result = await MemberRelationsManagementService.AddRelationship_Spouse(sourceMember!, selectedTarget, payload);
        } else if (relationship === 'child') {
          result = await MemberRelationsManagementService.AddRelationship_Child(sourceMember!, selectedTarget, payload);
        }

        const message = `${sourceMember?.full_name} will be linked as the ${relationship} of ${selectedTarget.full_name}`;
        // console.log('result: ', result);
        if(!result) {
          toast.error('Failed to update relationship.');
          return;
        }
        toast.success(message);
        await personCardActions.handlers.onSuccess!();
      } catch (e) {
        console.error('Error updating relationship:', e as Error);
        toast.error('Failed to update relationship.');
      }
    } else {
      console.error('No target selected.');
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Searchable Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <FormInput
          label="Select Family Member"
          name="search_member"
          placeholder="Search for a member..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsDropdownOpen(true);
            if (selectedTarget) setSelectedTarget(selectedTarget);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          autoComplete="off"
        />
        {isDropdownOpen && linkedMembers && linkedMembers.length > 0 && (
          <ul className={`absolute z-20 w-full mt-sm max-h-60 overflow-auto bg-background-secondary border border-text-primary rounded shadow-lg`}>
            {linkedMembers &&
              linkedMembers.map((member) => (
                <li
                  key={member.member_id}
                  className="p-sm text-xl hover:bg-background-primary cursor-pointer text-text-primary border-b border-text-primary last:border-0"
                  onClick={() => handleSelectMember(member)}
                >
                  {[member.first_name, member.middle_name, member.last_name].filter(Boolean).join(' ')}
                  <span className="text-sm text-text-secondary ml-2">({new Date(member.birth_date!).getFullYear()})</span>
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* Relationship Radio Group */}
      <div>
        <Label htmlFor={''} labelText={'Relationship'} className="block text-lg font-bold text-text-secondary mb-2" />
        <div className="flex gap-4 bg-background-primary p-2 rounded-md">
          {['parent', 'spouse', 'child'].map((rel) => (
            <label key={rel} className="flex items-center gap-2 cursor-pointer text-xl">
              <input
                type="radio"
                name="relationship"
                value={rel}
                checked={relationship === rel}
                onChange={() => setRelationship(rel as 'parent' | 'spouse' | 'child')}
                className="w-5 h-5 text-accent-primary border-text-secondary focus:ring-accent-primary"
              />
              <span className="text-text-primary capitalize">{rel}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Relationship Summary */}
      {selectedTarget && sourceMember && (
        <div className="p-sm bg-background-primary border border-accent-primary rounded-md text-center">
          <p className="text-text-primary">
            <span className="font-bold">{sourceMember.full_name}</span>
            {' will be linked as the '}
            <span className="font-bold text-accent-primary uppercase">{relationship}</span>
            {' of '}
            <span className="font-bold">{selectedTarget.full_name}</span>
          </p>
        </div>
      )}

      {/* Additional Info */}
      {(relationship === 'parent' || relationship === 'child') && (
        <div className=''>
          <h4 className="text-lg font-bold text-text-primary mb-2 capitalize">Additional Info for {relationship}</h4>
          <FormSelect
            label="Relationship Type"
            name="relationship_type"
            value={linkageDetails.relationship_type}
            onChange={handleLinkageChange}
            options={[
              { label: 'Biological', value: 'Biological' },
              { label: 'Adopted', value: 'Adopted' },
              // { label: 'Step', value: 'Step' },
              { label: 'Foster', value: 'Foster' },
            ]}
          />
          <FormInput
            label="Date Established"
            name="date_established"
            type="date"
            value={linkageDetails.date_established}
            onChange={handleLinkageChange}
          />
          <FormInput
            label="Date Terminated"
            name="date_terminated"
            type="date"
            value={linkageDetails.date_terminated}
            onChange={handleLinkageChange}
          />
          <FormTextArea label="Notes" name="notes" value={linkageDetails.notes} onChange={handleLinkageChange} rows={3} />
        </div>
      )}
      {relationship.toLowerCase() === 'spouse' && (
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 capitalize">Additonal info for Spouse</h4>
          <FormSelect
            label="Relationship Status"
            name="relationship_status"
            value={spouseDetails.relationship_status || ''} // Ensure value is a string
            onChange={handleSpouseDetailsChange}
            options={[
              { label: 'Married', value: 'Married' },
              { label: 'Divorced', value: 'Divorced' },
              { label: 'Separated', value: 'Separated' },
              { label: 'Engaged', value: 'Engaged' },
              { label: 'Partnered', value: 'Partnered' },
            ]}
          />
          <FormInput
            label="Start Date"
            name="start_date"
            type="date"
            value={spouseDetails.start_date} // Reusing date_established for start_date
            onChange={handleSpouseDetailsChange}
          />
          <FormInput
            label="End Date"
            name="end_date"
            type="date"
            value={spouseDetails.end_date} // Reusing date_terminated for end_date
            onChange={handleSpouseDetailsChange}
          />
          <FormInput label="Location" name="location" value={spouseDetails.location} onChange={handleSpouseDetailsChange} />
          <FormTextArea label="Notes" name="notes" value={spouseDetails.notes} onChange={handleSpouseDetailsChange} rows={3} />
        </div>
      )}
      {/* --- Form Actions (Footer) --- */}
      <div className="flex justify-end gap-4 py-4 border-t border-border-secondary">
        <button
          type="button"
          onClick={personCardActions.handlers.onClose}
          disabled={isLoading}
          className={`py-2 px-4 text-xl
            bg-background-secondary text-text-primary hover:bg-action-secondary
            rounded-md transition disabled:opacity-50`}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`py-2 px-4 text-xl 
            bg-action-secondary text-text-primary hover:bg-accent-secondary
            rounded-md transition disabled:opacity-50`}
        >
          {isLoading ? 'Saving...' : 'Update Relationship'}
        </button>
    </div>
    </div>
  );
}

export default LinkMemberForm;
