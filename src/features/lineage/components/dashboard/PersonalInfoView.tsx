import { BriefcaseIcon, CalendarIcon, MapPinIcon, HomeIcon, BookOpenIcon } from '@heroicons/react/24/solid';
import type { Member } from '../../../../shared/datamodels';

interface PersonalInfoViewProps {
  member: Member;
}

export function PersonalInfoView({ member }: PersonalInfoViewProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Gender</label>
          <p className="text-text-primary capitalize">{member.gender || 'Not specified'}</p>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Occupation</label>
          <div className="flex items-center text-text-primary">
            <BriefcaseIcon className="w-4 h-4 mr-2 text-text-secondary" />
            {member.profession || 'Unknown'}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Birth Date</label>
          <div className="flex items-center text-text-primary">
            <CalendarIcon className="w-4 h-4 mr-2 text-text-secondary" />
            {formatDate(member.birth_date?.toString())}
          </div>
        </div>

        {!member.is_alive && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Death Date</label>
            <div className="flex items-center text-text-primary">
              <CalendarIcon className="w-4 h-4 mr-2 text-text-secondary" />
              {formatDate(member.death_date?.toString())}
            </div>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Birth Place</label>
          <div className="flex items-center text-text-primary">
            <MapPinIcon className="w-4 h-4 mr-2 text-text-secondary" />
            {member.birth_place || 'Unknown'}
          </div>
        </div>

        {!member.is_alive && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Death Place</label>
            <div className="flex items-center text-text-primary">
              <MapPinIcon className="w-4 h-4 mr-2 text-text-secondary" />
              {member.death_place || 'Unknown'}
            </div>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Current Location</label>
          <div className="flex items-center text-text-primary">
            <HomeIcon className="w-4 h-4 mr-2 text-text-secondary" />
            {member.current_location || 'Unknown'}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Religion</label>
          <div className="flex items-center text-text-primary">
            <BookOpenIcon className="w-4 h-4 mr-2 text-text-secondary" />
            {member.religion || 'Not specified'}
          </div>
        </div>
      </div>

      {/* Bio / Notes Section */}
      <div className="pt-4 border-t border-gray-100">
        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 block">Biography / Notes</label>
        <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
          {member.notes || 'No additional notes available for this member.'}
        </p>
      </div>
    </div>
  );
}

function formatDate(dateString?: string | null) {
  if (!dateString) return 'Unknown';
  return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}