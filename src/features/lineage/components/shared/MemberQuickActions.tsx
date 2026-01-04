import { EllipsisVerticalIcon, ShareIcon, PencilSquareIcon, UserPlusIcon, LinkIcon, ChevronRightIcon, HeartIcon, UserIcon, FaceSmileIcon } from '@heroicons/react/24/solid';
import { useState, useRef, useEffect } from 'react';
import type { Member } from '../../../../shared/datamodels';
import { useAuth } from '../../../../shared/hooks/useAuth';

interface MemberQuickActionsProps {
  member: Member;
  isUnlinkedMember?: boolean;
  onEdit?: (memberId: string) => void;
  onShare?: (memberId: string) => void;
  onAddParent?: (memberId: string) => void;
  onAddSpouse?: (memberId: string) => void;
  onAddChild?: (memberId: string) => void;
  onLink?: (memberId: string) => void;
}

export default function MemberQuickActions({ member, onEdit, onAddParent, onAddSpouse, onAddChild, onShare, onLink }: MemberQuickActionsProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { isLoggedIn } = useAuth();

  const handleAction = (action?: (memberId: string) => void) => {
    if (action) action(member.member_id!);
    setIsMenuOpen(false);
    setIsAddMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setIsAddMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="flex gap-2 items-center" ref={menuRef}>
        {isLoggedIn && (
          <div className="relative">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 hover:bg-accent-secondary rounded-full transition-colors">
              <EllipsisVerticalIcon className="text-background-primary h-6 w-6" />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-background-primary rounded-md shadow-lg py-1 z-50 border border-text-secondary">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction(onEdit);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-background-secondary flex items-center gap-3"
                >
                  <PencilSquareIcon className="h-4 w-4" /> Edit Member Details
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction(onLink);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-background-secondary flex items-center gap-3"
                >
                  <LinkIcon className="h-4 w-4" /> Link Member
                </button>

                <div className="relative" onMouseEnter={() => setIsAddMenuOpen(true)} onMouseLeave={() => setIsAddMenuOpen(false)}>
                  <button className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-background-secondary flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <UserPlusIcon className="h-4 w-4" /> Add Linked Member
                    </div>
                    <ChevronRightIcon className="h-3 w-3 text-text-secondary" />
                  </button>

                  {isAddMenuOpen && (
                    <div className="absolute right-full top-0 w-40 pr-1">
                      <div className="bg-background-primary rounded-md shadow-lg py-1 border border-text-secondary">
                        <button
                          onClick={() => handleAction(onAddParent)}
                          className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-background-secondary flex items-center gap-3"
                        >
                          <UserIcon className="h-4 w-4" /> Add Parent
                        </button>
                        <button
                          onClick={() => handleAction(onAddSpouse)}
                          className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-background-secondary flex items-center gap-3"
                        >
                          <HeartIcon className="h-4 w-4" /> Add Spouse
                        </button>
                        <button
                          onClick={() => handleAction(onAddChild)}
                          className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-background-secondary flex items-center gap-3"
                        >
                          <FaceSmileIcon className="h-4 w-4" /> Add Child
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAction(onShare);
          }}
          className="p-2 rounded-full text-background-primary hover:bg-accent-secondary flex items-center"
        >
          <ShareIcon className="h-5 w-5" />
        </button>
      </div>
    </>
  );
}
