// import { PersonCard } from "../components/PersonCard";
import { MemberService } from "../services/MemberService";
import { useEffect, useState } from "react";
import type { DescendantLinkage, Member, Spouse, TreeNode } from "../models/SupabaseDataModel";
import { DescendantLinkageService } from "../services/DescendantLinkageService";
import { SpouseService } from "../services/SpouseService";
import { TransformToTree } from "../services/TransformToTree";

type FamilyTree = {
  members: Member[];
  linkages: DescendantLinkage[];
  spouses: Spouse[];
};

function FamilyTree() {
  const [FamilyData, setFamilyData] = useState<FamilyTree>({
    members: [],
    linkages: [],
    spouses: [],
  });

  const [familyTreeNodes, setFamilyTreeNodes] = useState<TreeNode[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [members, linkages, spouses] = await Promise.all([
          MemberService.getAllMembers(),
          DescendantLinkageService.getAllDescendantLinkages(),
          SpouseService.getAllSpouses(),
        ]);
        setFamilyData({ members, linkages, spouses });
      } catch (error) {
        console.error("Error fetching family tree data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log(FamilyData);
    setFamilyTreeNodes(TransformToTree(FamilyData.members, FamilyData.linkages, FamilyData.spouses));
  }, [FamilyData]);


  return (
    <>
      <h1>This is Family Tree Page</h1>
      {console.log(familyTreeNodes)}
      
    </>
  );
}

export default FamilyTree;
