import { Route, Routes } from "react-router-dom";
import { lazy } from "react";

const Home = lazy(() => import("../features/core/pages/HomePage"));
const FamilyTree = lazy(() => import("../features/lineage/pages/FamilyTreePage"));
const Stories = lazy(() => import("../features/stories/pages/StoriesPage"));
const Photos = lazy(() => import("../features/core/pages/PhotosPage"));
const About = lazy(() => import("../features/core/pages/AboutPage"));
const Contact = lazy(() => import("../features/core/pages/ContactPage"));

export default function AppRoutes() {
  return (
    <div className="h-full">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tree" element={<FamilyTree />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/photos" element={<Photos />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}
