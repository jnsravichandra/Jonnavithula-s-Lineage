import { MemberService } from "../services/MemberService";
import { useEffect, useState } from "react";
import type { DescendantLinkage, Member, Spouse, TreeNode } from "../models/SupabaseDataModel";
import { DescendantLinkageService } from "../services/DescendantLinkageService";
import { SpouseService } from "../services/SpouseService";
import { TransformToTree } from "../services/TransformToTree";
import FamilyGroup from "../components/FamilyTree/FamilyGroup";
import { PlusIcon } from "@heroicons/react/24/solid";
import { ModalDialog } from "../components/ModalDialogComponent";
import { MemberForm } from "../components/MemberForm";
import UnlinkedMembers from "../components/FamilyTree/UnlinkedMember";
import Loading from "../components/Loading";

type FamilyTree = {
  members: Member[];
  linkages: DescendantLinkage[];
  spouses: Spouse[];
};

interface NodesToRenderProps {
  rootNode: TreeNode | null;
  unlinkedNodes: TreeNode[];
  allNodes: TreeNode[];
}

interface CardActionProps {
  onSelect: (memberId: string) => void;
  onEdit: (memberId: string) => void;
  onAdd: (memberId: string) => void;
  focusedMemberId: string | null;
}

function FamilyTree() {
  const [familyData, setFamilyData] = useState<FamilyTree>({
    members: [],
    linkages: [],
    spouses: [],
  });
  const [familyTreeNodes, setFamilyTreeNodes] = useState<NodesToRenderProps>();
  const [isLoading, setIsLoading] = useState(false);

  // --- Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);
  const [contextMemberId, setContextMemberId] = useState<string | null>(null);

  const [dataVersion, setDataVersion] = useState(0);

  // --- UI State ---
  const [focusedMemberId, setFocusedMemberId] = useState<string | null>(null);

  //active tab
  const [focussedTab, setFocussedTab] = useState<"family-tree" | "unlinked-members">("family-tree");
  const [activeTabStyles, setActiveTabStyles] = useState<string>();
  const [inactiveTabStyles, setInactiveTabStyles] = useState<string>();

  const handleSelect = (memberId: string) => {
    setFocusedMemberId(memberId);
  };

  const handleEdit = (memberId: string) => {
    const member = familyData.members.find((member) => member.member_id === memberId);
    if (member) {
      setMemberToEdit(member);
      setContextMemberId(null);
      setIsModalOpen(true);
    }
  };

  const handleAdd = (parentMemberId: string) => {
    setMemberToEdit(null);
    setContextMemberId(parentMemberId);
    setIsModalOpen(true);
  };

  const handleGlobalAdd = () => {
    setMemberToEdit(null);
    setContextMemberId(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMemberToEdit(null);
    setContextMemberId(null);
  };

  const cardActionProps: CardActionProps = {
    onSelect: handleSelect,
    onEdit: handleEdit,
    onAdd: handleAdd,
    focusedMemberId,
  };

  const handleSuccessfulSubmit = () => {
    handleCloseModal();
    setDataVersion((v) => v + 1); // Trigger data refetch
  };

  const ModalDialogForCRUD = () => {
    return (
      <>
        {/* --- Modal Dialog for CRUD Operations --- */}
        <ModalDialog
          open={isModalOpen}
          onClose={handleCloseModal}
          title={memberToEdit ? `Edit ${memberToEdit.first_name}` : "Add New Member"}
        >
          {/* MemberForm is conditionally rendered inside the modal */}
          <MemberForm
            // Pass the existing member for EDIT mode, or null for ADD mode
            member={memberToEdit}
            // Pass the context for relationship creation
            contextMemberId={contextMemberId}
            // Pass the success handler to close and refresh the tree
            onSuccess={handleSuccessfulSubmit}
            // Pass the close handler for cancellation
            onClose={handleCloseModal}
          />
        </ModalDialog>
      </>
    );
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [members, linkages, spouses] = await Promise.all([
        MemberService.getAllMembers(),
        DescendantLinkageService.getAllDescendantLinkages(),
        SpouseService.getAllSpouses(),
      ]);
      setFamilyData({ members, linkages, spouses });
    } catch (error) {
      console.error("Error fetching family tree data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dataVersion]);

  useEffect(() => {
    setIsLoading(true);
    setFamilyTreeNodes(TransformToTree(familyData.members, familyData.linkages, familyData.spouses));
    setIsLoading(false);
  }, [familyData]);

  const renderTreeContent = () => {
    if (isLoading) {
      return <Loading />;
    }

    if (!familyTreeNodes?.rootNode && familyData.members.length === 0) {
      return (
        <div className="text-center p-10 text-xl text-background-primary">
          No members found. Click "Add Member" to begin building your tree.
        </div>
      );
    }
    if (!isLoading && familyTreeNodes?.rootNode) {
      return (
        <>
          {/* Outer container: Handles horizontal scrolling */}
          <div className="flex py-xl overflow-auto">
            {/* Inner wrapper: Forces width expansion (min-w-max) and provides CRUCIAL LEFT PADDING to prevent cards on the far left from being clipped. */}
            <div className="">
              {familyTreeNodes?.rootNode ? (
                (console.log(familyTreeNodes.rootNode),
                (<FamilyGroup member={familyTreeNodes.rootNode} cardActionProps={cardActionProps} />))
              ) : (
                <div className="text-center p-10 text-xl text-error">
                  No root node established. Please link members to form a tree structure.
                </div>
              )}
            </div>
          </div>
        </>
      );
    }
  };

  const renderUnlinkedMembers = () => {
    return (
      <>
        {/* Unlinked Members display outside the scrollable tree area */}
        {familyTreeNodes?.unlinkedNodes && familyTreeNodes?.unlinkedNodes.length > 0 && (
          <div className="p-4">
            <UnlinkedMembers unlinkedNodes={familyTreeNodes.unlinkedNodes} cardActionProps={cardActionProps} />
          </div>
        )}
      </>
    );
  };

  const tabLayout = () => {
    return (
      <>
        <div className="flex ">
          <button onClick={() => changeActiveTab("family-tree")}>
            <p
              className={`${commonTabStyles}
            ${focussedTab === "family-tree" ? activeTabStyles : ""}
            ${focussedTab === "unlinked-members" ? inactiveTabStyles : ""}
              `}
            >
              Family Tree
            </p>
          </button>
          <button onClick={() => changeActiveTab("unlinked-members")}>
            <p
              className={`${commonTabStyles} 
            ${focussedTab === "unlinked-members" ? activeTabStyles : ""}
              ${focussedTab === "family-tree" ? inactiveTabStyles : ""}
              `}
            >
              Unlinked Members
            </p>
          </button>
        </div>
      </>
    );
  };

  const changeActiveTab = (tabKey: "family-tree" | "unlinked-members") => {
    setFocussedTab(tabKey);
    setActiveTabStyles("bg-highlight text-background-primary");
    setInactiveTabStyles("bg-background-primary");
  };

  const commonTabStyles = "font-bold transition-all duration-300 ease-in-out rounded shadow-sm text-xl p-4";

  return (
    <>
      <div className="flex justify-between items-center p-0 bg-background-secondary border-b rounded-2xl shadow-2xl ">
        {tabLayout()}
        <button
          className="bg-accent-primary text-background-primary font-semibold text-xl px-4 py-2 rounded-xl hover:bg-accent-secondary transition duration-150"
          onClick={handleGlobalAdd}
        >
          <span className="flex items-center gap-2">
            <PlusIcon className="h-6 w-6" />
            <p>Add Member</p>
          </span>
        </button>
      </div>

      {/* --- Main Tree and Unlinked Members Area --- */}
      <div className="">
        {focussedTab === "family-tree" && renderTreeContent()}
        {focussedTab === "unlinked-members" && renderUnlinkedMembers()}
      </div>

      {ModalDialogForCRUD()}
    </>
  );
}

export default FamilyTree;
