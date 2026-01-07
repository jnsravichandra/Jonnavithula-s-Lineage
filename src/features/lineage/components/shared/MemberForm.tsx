import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import ImageUploader from '../../../../shared/components/ui/ImageUploader';
import Label from '../../../../shared/components/ui/shared/Label';
import type { Member } from '../../../../shared/datamodels';
import { MemberRelationsManagementService, MemberService } from '../../services';
import { StorageManagerService } from '../../services/StorageManagerService';
import type { PersonCardActionType } from '../../types';
import FormInput from '../../../../shared/components/ui/shared/FormInput';
import FormSelect from '../../../../shared/components/ui/shared/FormSelect';
import FormTextArea from '../../../../shared/components/ui/shared/FormTextArea';
import { toTitleCase } from '../../../../shared/utils/utils';

const initialFormState: Member = {
  first_name: '',
  middle_name: '',
  last_name: '',
  gender: 'Male',
  birth_date: null, // Default to today's date
  death_date: null, // Default to null
  birth_place: '',
  profession: '',
  notes: '',
  profile_picture_url: '',
  member_id: '',
  is_alive: true,
  created_at: new Date(),
  current_location: '',
  death_place: '',
  religion: '',
};

interface MemberFormProps {
  member: Member | null;
  personCardActions: PersonCardActionType;
  focussedMemberId: string | null;
  operationType: string;
  relationType: string | null;
}

// --- Reusable Form Components (Candidates for shared/components/ui) ---

export const MemberForm = ({ member, personCardActions, focussedMemberId, operationType, relationType }: MemberFormProps) => {
  const [formData, setFormData] = useState<Partial<Member>>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploaderKey, setUploaderKey] = useState(0);

  useEffect(() => {
    if ((operationType === 'edit' || operationType === 'add-global') && member) {
      setFormData({
        ...member,
        birth_date: member.birth_date ? new Date(member.birth_date) : null,
        death_date: member.death_date ? new Date(member.death_date) : null,
        is_alive: member.is_alive ?? !member.death_date,
      });
    } else {
      setFormData(initialFormState);
    }
    // Reset staged image file when member or op type changes
    setProfileImageFile(null);
    setUploaderKey((prev) => prev + 1);
  }, [member, operationType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (e.target.type === 'date') {
      const dateValue = value ? new Date(value) : null;
      if (dateValue && !isNaN(dateValue.getTime())) {
        setFormData((prev: Partial<Member>) => ({
          ...prev,
          [name]: dateValue.toISOString(),
        }));
      } else {
        setFormData((prev: Partial<Member>) => ({ ...prev, [name]: null }));
      }
    } else {
      setFormData((prev: Partial<Member>) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (file: File) => {
    setProfileImageFile(file);
  };

  const handleIsAliveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      is_alive: checked,
      ...(checked ? { death_date: null, death_place: '' } : {}),
    }));
  };

  // --- Logic for UPDATING an existing member ---
  const handleUpdateMember = async (data: Partial<Member>) => {
    if (!member) throw new Error('No member data available for update.');

    const updatedMember: Member = {
      ...data,
      member_id: member.member_id,
      created_at: member.created_at,
    } as Member;

    updatedMember.first_name = updatedMember.first_name ? toTitleCase(updatedMember.first_name.trim()) : updatedMember.first_name;
    updatedMember.middle_name = updatedMember.middle_name ? toTitleCase(updatedMember.middle_name.trim()) : updatedMember.middle_name;
    updatedMember.last_name = updatedMember.last_name ? toTitleCase(updatedMember.last_name.trim()) : updatedMember.last_name;
    updatedMember.birth_place = updatedMember.birth_place ? toTitleCase(updatedMember.birth_place.trim()) : updatedMember.birth_place;
    updatedMember.death_place = updatedMember.death_place ? toTitleCase(updatedMember.death_place.trim()) : updatedMember.death_place;
    updatedMember.profession = updatedMember.profession ? toTitleCase(updatedMember.profession.trim()) : updatedMember.profession;
    updatedMember.current_location = updatedMember.current_location
      ? toTitleCase(updatedMember.current_location.trim())
      : updatedMember.current_location;
    updatedMember.religion = updatedMember.religion ? toTitleCase(updatedMember.religion.trim()) : updatedMember.religion;
    // updatedMember.notes = updatedMember.notes ? toTitleCase(updatedMember.notes.trim()) : updatedMember.notes;
    updatedMember.full_name = updatedMember.full_name ? toTitleCase(updatedMember.full_name.trim()) : updatedMember.full_name;
    updatedMember.gender = updatedMember.gender ? toTitleCase(updatedMember.gender.trim()) : updatedMember.gender;

    await MemberService.updateMember(updatedMember);
    toast.success('Member updated successfully!');
  };

  // --- Logic for CREATING a new member (and optionally linking it) ---
  const handleCreateMember = async (data: Partial<Member>) => {
    const newMember: Partial<Member> = {
      ...data,
      created_at: new Date(),
    };

    newMember.first_name = newMember.first_name ? toTitleCase(newMember.first_name.trim()) : newMember.first_name;
    newMember.middle_name = newMember.middle_name ? toTitleCase(newMember.middle_name.trim()) : newMember.middle_name;
    newMember.last_name = newMember.last_name ? toTitleCase(newMember.last_name.trim()) : newMember.last_name;
    newMember.birth_place = newMember.birth_place ? toTitleCase(newMember.birth_place.trim()) : newMember.birth_place;
    newMember.death_place = newMember.death_place ? toTitleCase(newMember.death_place.trim()) : newMember.death_place;
    newMember.profession = newMember.profession ? toTitleCase(newMember.profession.trim()) : newMember.profession;
    newMember.current_location = newMember.current_location ? toTitleCase(newMember.current_location.trim()) : newMember.current_location;
    newMember.religion = newMember.religion ? toTitleCase(newMember.religion.trim()) : newMember.religion;
    // newMember.notes = newMember.notes ? toTitleCase(newMember.notes.trim()) : newMember.notes;
    newMember.full_name = newMember.full_name
      ? toTitleCase(newMember.full_name.trim())
      : toTitleCase([newMember.first_name, newMember.middle_name, newMember.last_name].filter(Boolean).join(' '));
    newMember.gender = newMember.gender ? toTitleCase(newMember.gender.trim()) : newMember.gender;

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

    // console.log('relationship type: ', relationType);
    // console.log('newMember: ', newMember);
    // console.log('contextMember: ', contextMember);

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

      memberDataPayload.first_name = memberDataPayload.first_name ? toTitleCase(memberDataPayload.first_name?.trim()) : memberDataPayload.first_name;
      memberDataPayload.middle_name = memberDataPayload.middle_name
        ? toTitleCase(memberDataPayload.middle_name?.trim())
        : memberDataPayload.middle_name;
      memberDataPayload.last_name = memberDataPayload.last_name ? toTitleCase(memberDataPayload.last_name?.trim()) : memberDataPayload.last_name;
      memberDataPayload.birth_place = memberDataPayload.birth_place
        ? toTitleCase(memberDataPayload.birth_place?.trim())
        : memberDataPayload.birth_place;
      memberDataPayload.death_place = memberDataPayload.death_place
        ? toTitleCase(memberDataPayload.death_place?.trim())
        : memberDataPayload.death_place;
      memberDataPayload.profession = memberDataPayload.profession ? toTitleCase(memberDataPayload.profession?.trim()) : memberDataPayload.profession;
      memberDataPayload.current_location = memberDataPayload.current_location
        ? toTitleCase(memberDataPayload.current_location?.trim())
        : memberDataPayload.current_location;
      memberDataPayload.religion = memberDataPayload.religion ? toTitleCase(memberDataPayload.religion?.trim()) : memberDataPayload.religion;
      // memberDataPayload.notes = memberDataPayload.notes? toTitleCase(memberDataPayload.notes?.trim()) : memberDataPayload.notes;
      memberDataPayload.full_name = memberDataPayload.full_name ? toTitleCase(memberDataPayload.full_name?.trim()) : memberDataPayload.full_name;
      memberDataPayload.gender = memberDataPayload.gender ? toTitleCase(memberDataPayload.gender?.trim()) : memberDataPayload.gender;

      if (profileImageFile) {
        const newImageUrl = await StorageManagerService.uploadProfilePicture(profileImageFile);
        // console.log('Profile picture uploaded successfully:', newImageUrl);
        memberDataPayload.profile_picture_url = newImageUrl;
      }

      if (operationType === 'edit') {
        await handleUpdateMember(memberDataPayload);
      } else if (operationType === 'add-linked') {
        await handleAddLinkedMember(memberDataPayload);
      } else {
        await handleCreateMember(memberDataPayload);
      }

      if (operationType !== 'edit') {
        setFormData(initialFormState);
      }
      setProfileImageFile(null);
      setUploaderKey((prev) => prev + 1);
      await personCardActions.handlers.onSuccess!();
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Failed to save member:', errorMessage);
      toast.error(`Error: ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine if the form is in "edit" mode to control button text
  const isEditing = operationType === 'edit';

  const formatDateForInput = (date: Date | string | null | undefined) => {
    if (!date) return '';
    try {
      return new Date(date).toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* --- Form Fields --- */}
        <div className="grid grid-cols-1 bg-background-secondary md:grid-cols-2 gap-4 overflow-y-auto p-2">
          {/* Profile Picture Uploader */}
          <div className="md:col-span-2 flex flex-col items-center">
            <Label htmlFor="profile_picture_url" labelText="Profile Picture" />
            <ImageUploader key={uploaderKey} initialImage={formData.profile_picture_url} onChange={handleImageChange} />
          </div>

          <FormInput label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} required />
          <FormInput label="Middle Name" name="middle_name" value={formData.middle_name!} onChange={handleChange} />
          <FormInput label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} />

          <FormSelect
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={[
              { label: 'Male', value: 'Male' },
              { label: 'Female', value: 'Female' },
              { label: 'Other', value: 'Other' },
            ]}
          />
          <FormInput label="Current Location" name="current_location" value={formData.current_location} onChange={handleChange} />
          <FormInput label="Occupation" name="profession" value={formData.profession} onChange={handleChange} />

          <FormInput
            label="Birth Date"
            name="birth_date"
            type="date"
            value={formatDateForInput(formData.birth_date)}
            onChange={handleChange}
            // required
          />
          <FormInput label="Birth Place" name="birth_place" value={formData.birth_place} onChange={handleChange} />

          <div className="flex items-center h-full pt-4 md:col-span-2">
            <input
              type="checkbox"
              id="is_alive"
              checked={formData.is_alive ?? true}
              onChange={handleIsAliveChange}
              className="w-6 h-6 text-accent-primary border-text-secondary rounded focus:ring-accent-primary"
            />
            <label htmlFor="is_alive" className="ml-2 text-xl font-bold text-text-secondary cursor-pointer">
              Is Alive?
            </label>
          </div>

          {!formData.is_alive && (
            <FormInput label="Death Date" name="death_date" type="date" value={formatDateForInput(formData.death_date)} onChange={handleChange} />
          )}
          {!formData.is_alive && <FormInput label="Death Place" name="death_place" value={formData.death_place!} onChange={handleChange} />}

          <FormInput label="Profession" name="profession" value={formData.profession} onChange={handleChange} />
          <FormInput label="Religion" name="religion" value={formData.religion} onChange={handleChange} />

          <FormTextArea label="Notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} className="md:col-span-2" />
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
        <div className="flex justify-end gap-4 pt-4 border-t border-border-secondary">
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
            type="submit"
            disabled={isLoading}
            className={`py-2 px-4 text-xl 
            bg-action-secondary text-text-primary hover:bg-accent-secondary
            rounded-md transition disabled:opacity-50`}
          >
            {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Member'}
          </button>
        </div>
      </form>
    </>
  );
};
