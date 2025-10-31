import { PersonCard } from "../components/PersonCard";
import { SampleData } from "../data/Sample_Data";


function FamilyTree() {
  const person = SampleData.memberList[0];
  return (
    <>
      <h1>This is Family Tree Page</h1>
      <PersonCard person={person}/>
    </>
  );
}

export default FamilyTree;
