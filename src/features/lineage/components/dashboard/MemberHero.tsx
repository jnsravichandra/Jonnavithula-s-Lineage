import { MapPinIcon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import type { Member } from '../../../../shared/datamodels';
import MemberQuickActions from '../shared/MemberQuickActions';

interface MemberHeroProps {
  member: Member;
  setSelectedMember: (member: Member | null) => void;
  onEdit?: (memberId: string) => void;
  onShare?: (memberId: string) => void;
  onAddParent?: (memberId: string) => void;
  onAddSpouse?: (memberId: string) => void;
  onAddChild?: (memberId: string) => void;
  onLink?: (memberId: string) => void;
}

export function MemberHero({ member, setSelectedMember, onEdit, onShare, onAddParent, onAddSpouse, onAddChild, onLink}: MemberHeroProps) {
    
  
  return (
    <div className="relative bg-gradient-to-r from-accent-primary via-highlight to-accent-primary p-6 flex items-center gap-6 border-b border-text-primary">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <MemberQuickActions member={member} onEdit={onEdit} onShare={onShare} onAddParent={onAddParent} onAddSpouse={onAddSpouse} onAddChild={onAddChild} onLink={onLink}/>
        <button
          onClick={() => setSelectedMember(null)}
          className="p-2 hover:bg-accent-secondary rounded-full transition-colors"
        >
          <XMarkIcon className="text-background-primary h-6 w-6" />
        </button>
      </div>
      <div className="relative">
        {member.profile_picture_url ? (
          <img
            src={member.profile_picture_url}
            alt={getFullName(member)}
            className="w-24 h-24 rounded-full object-cover border-4 border-background-primary shadow-md"
          />
        ) : (
          <UserCircleIcon className="w-24 h-24 text-background-secondary bg-white rounded-full" />
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-background-primary">{getFullName(member)}</h2>
        <p className="text-background-secondary font-medium mt-1">{getVitals(member)}</p>
        {(member.birth_place || member.current_location) && (
          <div className="flex items-center text-sm text-background-secondary mt-2">
            <MapPinIcon className="w-4 h-4 mr-1" />
            <span>{member.birth_place || member.current_location}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function getFullName(member: Member) {
  return [member.first_name, member.middle_name, member.last_name].filter(Boolean).join(' ');
}

function getVitals(member: Member) {
  const birth = member.birth_date ? new Date(member.birth_date).getFullYear() : '?';
  const death = member.death_date ? new Date(member.death_date).getFullYear() : member.is_alive ? 'Present' : '?';
  return `${birth} - ${death}`;
}
