import type { CardActionProps } from "../hooks/usePersonCardActions";
import type { TreeNode } from "../../../shared/datamodels/SupabaseDataModel";

interface LinkMemberProps {
    member: TreeNode;
    cardActionProps: CardActionProps;
}

function LinkMember({ member, cardActionProps }: LinkMemberProps) {
    const handleLinkMember = () => {
        cardActionProps.onEdit(member.member_id);
        console.log(cardActionProps)
    }
  return (
    <>
    {handleLinkMember()}
      <h1>Link Member</h1>
    </>
  );
}

export default LinkMember;
