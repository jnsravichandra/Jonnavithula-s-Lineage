import { useEffect, useState, useCallback } from "react";
import type { Member, TreeNode } from "../models/SupabaseDataModel";
import { MemberService } from "../services/MemberService";

export type DeleteResult = {
    success: boolean;
    message: string;
};

export interface CardActionProps {
    onSelect: (memberId: string) => void;
    onEdit: (memberId: string) => void;
    // Let's use the full member object to provide a better success message.
    onDelete: (member: TreeNode) => Promise<DeleteResult>;
    onAdd: (parentMemberId: string) => void;
    onClose?: () => void;
    onSuccess?: () => void;
    focusedMemberId: string | null;
}

function usePersonCardActions() {
    const [focusedMemberId, setFocusedMemberId] = useState<string | null>(null);
    const [cardActions, setCardActions] = useState<CardActionProps>();
    
    const [member, setMember] = useState<Member>();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getMember = useCallback(async (memberId: string) => {
        const currentMember: Member | null = await MemberService.getMemberById(memberId);
        if (currentMember) {
            setMember(currentMember);
        }
    }, []);

    const handleSelect = useCallback(async (memberId: string) => {
        setFocusedMemberId(memberId);
        console.log(`Select ${memberId}`);
        getMember(memberId);
    }, [getMember]);

    const handleEdit = useCallback(async (memberId: string) => {
        console.log(`Edit ${memberId}`);
        setFocusedMemberId(memberId);
        setIsModalOpen(true);
        getMember(memberId);
    }, [getMember]);

    const handleDelete = useCallback(async (member: TreeNode): Promise<DeleteResult> => {
        console.log(`Delete ${member.member_id}`);
        try {
            await MemberService.deleteMember(member.member_id);
            const successMessage = `Member "${member.first_name} ${member.last_name || ''}" was deleted successfully.`;
            return { success: true, message: successMessage };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const errorMessage = `Failed to delete member: ${error.message}`;
            return { success: false, message: errorMessage };
        }
    }, []);

    const handleAdd = useCallback(async (parentMemberId: string) => {
        console.log(`Add Member `+ parentMemberId );
        setFocusedMemberId(parentMemberId);
        setIsModalOpen(true);
        // getMember(memberId);
    }, []);

    const handleClose = useCallback(() => {
        setIsModalOpen(false);
        setFocusedMemberId(null);
    }, []);

    const handleSuccess = useCallback(() => {
        setIsModalOpen(false);
        setFocusedMemberId(null);
    }, []);

    useEffect(() => {
    }, [])

    useEffect(() => {
        setCardActions({
            onSelect: handleSelect,
            onEdit: handleEdit,
            onDelete: handleDelete,
            onAdd: handleAdd,
            onClose: handleClose,
            onSuccess: handleSuccess,
            focusedMemberId: focusedMemberId,
        });
    }, [focusedMemberId, handleAdd, handleClose, handleDelete, handleEdit, handleSelect, handleSuccess]);

    return {
        cardActions,
        focusedMemberId,
        setFocusedMemberId,
        member,
        isModalOpen,
        setIsModalOpen,
    };
}

export default usePersonCardActions;