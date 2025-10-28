import { Route, Routes } from "react-router-dom";
import { lazy } from "react";

const Home = lazy(() => import("../pages/Home"));
const FamilyTree = lazy(() => import("../pages/FamilyTree"));
const Stories = lazy(() => import("../pages/Stories"));
const Photos = lazy(() => import("../pages/Photos"));
const About = lazy(() => import("../pages/About"));
const Contact = lazy(() => import("../pages/Contact"));

export default function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/family-tree" element={<FamilyTree />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/photos" element={<Photos />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}
