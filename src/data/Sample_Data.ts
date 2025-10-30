import type { Member } from "../models/Member";

const member: Member = {
  // member_id: "M001",
  created_at: new Date("2023-01-01"),
  first_name: "John",
  middle_name: "Robert",
  last_name: "Smith",
  gender: "Male",
  birth_date: new Date("1980-05-15"),
  death_date: new Date("2050-12-31"),
  birth_place: "New York, USA",
  death_place: "Los Angeles, USA",
  occupation: "Software Engineer",
  religion: "Hindu",
  notes: "Graduated from MIT in 2002",
  profile_picture_url: "",
};

const memberList: Member[] = [
  {
    created_at: new Date("2023-01-01"),
    first_name: "John",
    middle_name: "Robert",
    last_name: "Smith",
    gender: "Male",
    birth_date: new Date("1980-05-15"),
    death_date: new Date("2050-12-31"),
    birth_place: "New York, USA",
    death_place: "Los Angeles, USA",
    occupation: "Software Engineer",
    religion: "Hindu",
    notes: "Graduated from MIT in 2002",
    profile_picture_url: "",
  },
  {
    member_id: "3",
    created_at: new Date("2023-01-02"),
    first_name: "Jane",
    middle_name: "Elizabeth",
    last_name: "Doe",
    gender: "Female",
    birth_date: new Date("1982-08-20"),
    death_date: new Date("2060-03-10"),
    birth_place: "London, UK",
    death_place: "Paris, France",
    occupation: "Doctor",
    religion: "Christian",
    notes: "Specialized in cardiology",
    profile_picture_url: "",
  },
  {
    created_at: new Date("2023-01-03"),
    first_name: "Peter",
    middle_name: "Allen",
    last_name: "Jones",
    gender: "Male",
    birth_date: new Date("1975-03-25"),
    death_date: new Date("2045-11-01"),
    birth_place: "Sydney, Australia",
    death_place: "Melbourne, Australia",
    occupation: "Architect",
    religion: "Agnostic",
    notes: "Designed several iconic buildings",
    profile_picture_url: "",
  }
];

export const SampleData = {
  member,
  memberList
};
