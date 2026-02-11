import type { Member, TreeNode } from '../../../../shared/datamodels';

interface FamilyRelationshipsViewProps {
  activeNode: TreeNode;
  setSelectedMember?: (member: Member | null) => void;
  setActiveTab?: (tab: string) => void;
}

const MemberCard = ({
  node,
  label,
  onClick,
  isCenter = false,
}: {
  node: TreeNode;
  label?: string;
  onClick?: (n: TreeNode) => void;
  isCenter?: boolean;
}) => {
  const member = node.member;
  if (!member) return null;

  const displayName = member.full_name || [member.first_name, member.last_name].filter(Boolean).join(' ');

  return (
    <div
      className={`flex flex-col items-center p-4 rounded-lg shadow-sm transition-all duration-200
        ${
          isCenter
            ? 'bg-background-secondary border-2 border-accent-primary scale-105 z-10'
            : 'bg-background-primary border border-text-secondary hover:shadow-md hover:border-accent-secondary cursor-pointer'
        }
        min-w-[140px] max-w-[200px]
      `}
      onDoubleClick={() => !isCenter && onClick?.(node)}
    >
      <div
        className={`rounded-full overflow-hidden mb-3 border-2 
          ${isCenter ? 'border-accent-primary w-20 h-20' : 'w-16 h-16'}
          ${node.member?.gender === 'Male' ? 'border-blue-500' : 'border-pink-500'}
          ` 
      }
      >
        {member.profile_picture_url ? (
          <img src={member.profile_picture_url} alt={displayName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-background-secondary flex items-center justify-center text-text-primary font-bold text-xl">
            {member.first_name?.[0]}
          </div>
        )}
      </div>

      <div className="text-center">
        <h4 className={`font-semibold text-text-primary ${isCenter ? 'text-lg' : 'text-sm'}`}>{displayName}</h4>
        {label && (
          <span className="inline-block mt-1 px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium text-text-secondary bg-background-secondary rounded-full">
            {label}
          </span>
        )}
        {member.birth_date && <p className="text-xs text-text-secondary mt-1">{new Date(member.birth_date).getFullYear()}</p>}
      </div>
    </div>
  );
};

export function FamilyRelationshipsView({ activeNode, setSelectedMember, setActiveTab }: FamilyRelationshipsViewProps) {
  if (!activeNode) {
    return (
      <div className="text-center text-text-primary py-8">
        <p>No member selected.</p>
      </div>
    );
  }

  const parents = activeNode.parents || [];
  const spouses = activeNode.spouses || [];
  const children = activeNode.children || [];

  const onNodeClick = (node: TreeNode) => {
    if (setSelectedMember) setSelectedMember(node.member!);
    if (setActiveTab) setActiveTab('personal');
  };

  return (
    <div className="flex flex-col items-center gap-8 md:gap-12 p-4 md:p-8 w-full">
      {/* Parents Section */}
      {parents.length > 0 && (
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest">Parents</h3>
          <div className="flex gap-8 justify-center flex-wrap">
            {parents.map((p) => (
              <MemberCard key={p.member_id} node={p} label="Parent" onClick={onNodeClick} />
            ))}
          </div>
        </div>
      )}

      {/* Center Section (Self + Spouses) */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-12 items-center justify-center flex-wrap">
          <MemberCard node={activeNode} isCenter />

          {spouses.length > 0 && (
            <div className="flex gap-4 items-center border-l-2 border-text-secondary pl-8">
              {spouses.map((s) => (
                <MemberCard key={s.member_id} node={s} label="Spouse" onClick={onNodeClick} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Children Section */}
      {children.length > 0 && (
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest">Children</h3>
          <div className="flex gap-8 justify-center flex-wrap">
            {children.map((c) => (
              <MemberCard key={c.member_id} node={c} label="Child" onClick={onNodeClick} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
