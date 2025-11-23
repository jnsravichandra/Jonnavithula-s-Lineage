import { Route, Routes } from "react-router-dom";
import { lazy } from "react";
import FamilyTree_1 from "../pages/MemberDirectory/FamilyTree_1";

const Home = lazy(() => import("../pages/Home"));
const FamilyTree = lazy(() => import("../pages/FamilyTree"));
const Stories = lazy(() => import("../pages/Stories"));
const Photos = lazy(() => import("../pages/Photos"));
const About = lazy(() => import("../pages/About"));
const Contact = lazy(() => import("../pages/Contact"));

export default function AppRoutes() {
  return (
    <div className="h-full">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tree" element={<FamilyTree />} />
        <Route path="/tree_1" element={<FamilyTree_1 />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/photos" element={<Photos />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}
