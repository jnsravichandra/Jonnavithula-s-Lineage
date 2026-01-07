import AppRoutes from "./routes";
import { Toaster } from "react-hot-toast";
import Header from "../shared/components/layout/Header";
import Footer from "../shared/components/layout/Footer";
import SideNav from "../shared/components/layout/SideNav";

function App() {
  const never = false;
  return (
    <div className="min-h-screen flex flex-col bg-background-primary text-text-primary font-body font-regular transition-colors duration-300">
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Header />
      {/* This fills all space between header and footer */}
      <div className="flex flex-1">
        {never && (
          /* Sidebar spans full height of this flex row */
          <aside className="w-auto border-r">
            /* your side nav here */
            <SideNav />
          </aside>
        )}
        {/* Main page content, scrolls if needed */}
        <main className="flex-1 overflow-y-auto">
          <AppRoutes />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;
