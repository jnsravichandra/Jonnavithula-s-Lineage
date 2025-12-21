import { useEffect, useState } from 'react';
import type { Member } from '../../../shared/datamodels/SupabaseDataModel';

import toast from 'react-hot-toast';
import Label from '../../../shared/components/ui/Label';
import { ImageUploader } from '../../../shared/components/ui/ImageUploader';
import { MemberRelationsManagementService } from '../services/MemberRelationsManagementService';
import { MemberService } from '../services';
import { StorageManagerService } from '../services/StorageManagerService';
import type { PersonCardActionType } from '../types';

const initialFormState: Partial<Member> = {
  first_name: '',
  middle_name: '',
  last_name: '',
  gender: 'Male',
  birth_date: new Date(), // Default to today's date
  death_date: null, // Default to null
  birth_place: '',
  profession: '',
  notes: '',
  profile_picture_url: '',
  member_id: '',
};

interface MemberFormProps {
  member: Member | null;
  personCardActions: PersonCardActionType;
  focussedMemberId: string | null;
  operationType: string;
  relationType: string | null;
}

export const MemberForm = ({ member, personCardActions, focussedMemberId, operationType, relationType }: MemberFormProps) => {
  const [formData, setFormData] = useState<Partial<Member>>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ((operationType === 'edit' || operationType === 'add-global') && member) {
      setFormData({
        ...member,
        birth_date: member.birth_date ? new Date(member.birth_date) : new Date(),
        death_date: member.death_date ? new Date(member.death_date) : null,
      });
    } else {
      setFormData(initialFormState);
    }
    // Reset staged image file when member or op type changes
    setProfileImageFile(null);
  }, [member, operationType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (e.target.type === 'date') {
      setFormData((prev: Partial<Member>) => ({
        ...prev,
        [name]: new Date(value).toISOString(),
      }));
    } else {
      setFormData((prev: Partial<Member>) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (file: File) => {
    setProfileImageFile(file);
  };

  // --- Logic for UPDATING an existing member ---
  const handleUpdateMember = async (data: Partial<Member>) => {
    if (!member) throw new Error('No member data available for update.');

    const updatedMember: Member = {
      ...data,
      member_id: member.member_id,
      created_at: member.created_at,
    } as Member;

    await MemberService.updateMember(updatedMember);
    toast.success('Member updated successfully!');
  };

  // --- Logic for CREATING a new member (and optionally linking it) ---
  const handleCreateMember = async (data: Partial<Member>) => {
    const newMember: Partial<Member> = {
      ...data,
      created_at: new Date(),
    };
    delete newMember.member_id;

    const insertedMember = await MemberService.insertMember(newMember as Member);
    toast.success(`Member created successfully! Member ID: ${insertedMember.member_id}`);
  };

  const handleAddLinkedMember = async (data: Partial<Member>) => {
    if (!relationType || !focussedMemberId) {
      throw new Error('Relation type or context member ID is missing for a linked operation.');
    }

    const newMember: Partial<Member> = {
      ...data,
      created_at: new Date(),
    };
    delete newMember.member_id;

    const contextMember = await MemberService.getMemberById(focussedMemberId);
    if (!contextMember) {
      throw new Error('Could not find the context member to link to.');
    }

    if (relationType === 'Sibling') {
      await MemberRelationsManagementService.AddSiblingMember(newMember as Member, contextMember);
      toast.success('New sibling added successfully!');
    } else if (relationType === 'Child') {
      await MemberRelationsManagementService.AddChildMember(newMember as Member, contextMember);
      toast.success('New child added successfully!');
    } else if (relationType === 'Spouse') {
      await MemberRelationsManagementService.AddSpouseMember(newMember as Member, contextMember);
      toast.success('New spouse added successfully!');
    } else {
      toast.error(`Adding relation of type "${relationType}" is not yet supported.`);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // await signInWithEmail_RC()
      const memberDataPayload = { ...formData };

      if (profileImageFile) {
        const newImageUrl = await StorageManagerService.uploadProfilePicture(profileImageFile);
        console.log('Profile picture uploaded successfully:', newImageUrl);
        memberDataPayload.profile_picture_url = newImageUrl;
      }

      if (operationType === 'edit') {
        await handleUpdateMember(memberDataPayload);
      } else if (operationType === 'add-linked') {
        await handleAddLinkedMember(memberDataPayload);
      } else {
        await handleCreateMember(memberDataPayload);
      }
      personCardActions.handlers.onSuccess!();
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Failed to save member:', errorMessage);
      toast.error(`Error: ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      // await AuthAPI.signOut();
    }
  };

  // Determine if the form is in "edit" mode to control button text
  const isEditing = operationType === 'edit';

  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    try {
      return new Date(date).toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const formTextInput = (name: string, id: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, isRequired = false) => {
    return (
      <input
        type="text"
        name={name}
        id={id}
        value={value!}
        onChange={onChange}
        className="mt-sm h-2xl p-sm text-2xl block w-full rounded-md border border-text-secondary shadow-sm focus:border-accent-primary focus:ring-accent-primary"
        required={isRequired}
      />
    );
  };

  const formDateInput = (name: string, id: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, isRequired = false) => {
    return (
      <>
        <input
          type="date"
          name={name}
          id={id}
          value={value}
          onChange={onChange}
          className="mt-sm p-sm h-2xl text-2xl block w-full rounded-md border border-text-secondary  shadow-sm focus:border-accent-primary focus:ring-accent-primary"
          required={isRequired}
        />
      </>
    );
  };

  const formDropdownInput = (
    name: string,
    id: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void,
    options: { label: string; value: string }[]
  ) => {
    return (
      <>
        <select
          name={name}
          id={id}
          value={value}
          onChange={onChange}
          className="mt-sm p-sm h-2xl text-2xl block w-full rounded-md border border-text-secondary shadow-sm focus:border-accent-primary focus:ring-accent-primary"
        >
          {options.map((option) => (
            <option className="bg-background-secondary" key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </>
    );
  };

  const formTextAreaInput = (name: string, id: string, value: string, rows: number, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void) => {
    return (
      <>
        <textarea
          name={name}
          id={id}
          rows={rows}
          value={value}
          onChange={onChange}
          className="mt-sm p-sm h-2xl text-2xl block w-full rounded-md border border-text-secondary  shadow-sm focus:border-accent-primary focus:ring-accent-primary"
        />
      </>
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* --- Form Fields --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-150 overflow-y-auto p-2">
          {/* Profile Picture Uploader */}
          <div className="md:col-span-2 flex flex-col items-center">
            <Label htmlFor="profile_picture_url" labelText="Profile Picture" className="block text-lg font-bold text-text-secondary mb-2" />
            <ImageUploader initialImage={formData.profile_picture_url} onChange={handleImageChange} />
          </div>

          {/* First Name */}
          <div>
            <Label htmlFor="first_name" labelText="First Name" className="block text-lg font-bold text-text-secondary" />
            {formTextInput('first_name', 'first_name', formData.first_name!, handleChange, true)}
          </div>

          {/* Middle Name */}
          <div>
            <Label htmlFor="middle_name" labelText="Middle Name" className="block text-lg font-bold text-text-secondary" />
            {formTextInput('middle_name', 'middle_name', formData.middle_name!, handleChange, false)}
          </div>

          {/* Last Name */}
          <div>
            <Label htmlFor="last_name" labelText="Last Name" className="block text-lg font-bold text-text-secondary" />
            {formTextInput('last_name', 'last_name', formData.last_name!, handleChange, true)}
          </div>

          {/* Gender */}
          <div>
            <Label htmlFor="gender" labelText="Gender" className="block text-lg font-bold text-text-secondary" />
            {formDropdownInput('gender', 'gender', formData.gender!, handleChange, [
              { label: 'Male', value: 'Male' },
              { label: 'Female', value: 'Female' },
              { label: 'Other', value: 'Other' },
            ])}
          </div>

          {/* Birth Date */}
          <div>
            <Label htmlFor="birth_date" labelText="Birth Date" className="block text-lg font-bold text-text-secondary" />
            {formDateInput('birth_date', 'birth_date', formatDateForInput(formData.birth_date!), handleChange, true)}
          </div>

          {/* Death Date */}
          <div>
            <Label htmlFor="death_date" labelText="Death Date" className="block text-lg font-bold text-text-secondary" />
            {formDateInput('death_date', 'death_date', formatDateForInput(formData.death_date!), handleChange, false)}
          </div>

          {/* Birth Place */}
          <div>
            <Label htmlFor="birth_place" labelText="Birth Place" className="block text-lg font-bold text-text-secondary" />
            {formTextInput('birth_place', 'birth_place', formData.birth_place!, handleChange, false)}
          </div>

          {/* Death Place */}
          <div>
            <Label htmlFor="death_place" labelText="Death Place" className="block text-lg font-bold text-text-secondary" />
            {formTextInput('death_place', 'death_place', formData.death_place!, handleChange, false)}
          </div>

          {/* Profession */}
          <div>
            <Label htmlFor="profession" labelText="Profession" className="block text-lg font-bold text-text-secondary" />
            {formTextInput('profession', 'profession', formData.profession!, handleChange, false)}
          </div>

          {/* Religion */}
          <div>
            <Label htmlFor="religion" labelText="Religion" className="block text-lg font-bold text-text-secondary" />
            {formTextInput('religion', 'religion', formData.religion!, handleChange, false)}
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <Label htmlFor="notes" labelText="Notes" className="block text-lg font-bold text-text-secondary" />
            {formTextAreaInput('notes', 'notes', formData.notes!, 3, handleChange)}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-600 bg-red-100 border border-red-400 p-3 rounded-md">
            <p>
              <strong>Error:</strong> {error}
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
            type="submit"
            disabled={isLoading}
            className="py-2 px-4 bg-accent-primary text-background-primary rounded-md hover:bg-accent-secondary transition disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Member'}
          </button>
        </div>
      </form>
    </>
  );
};
