import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Family Tree", path: "/tree" },
//   { name: "Family Tree 1", path: "/tree_1" },
  { name: "Stories", path: "/stories" },
  { name: "Photos", path: "/photos" },
  { name: "Contact", path: "/contact" },
];

function DesktopNavigation() {
  return (
    <nav className="flex flex-col gap-4 p-md">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className="text-primary no-underline text-lg font-semibold hover:text-accent-primary transition-colors"
        >
          {item.name}
        </NavLink>
      ))}
    </nav>
  );
}

function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="sm:hidden">
        <button onClick={toggleMenu}>
          <Bars3Icon className="h-7 w-9 hover:bg-accent-primary rounded-md" />
        </button>
        <div
          className={`fixed inset-0 z-40 transition-opacity duration-500 ${
            isOpen ? "opacity-90" : "opacity-0 pointer-events-none"
          }`}
          onClick={closeMenu}
        >
          <div
            className={`fixed right-0 top-0 h-full w-1/2 bg-background-secondary shadow-lg p-4 transform transition-transform duration-500 ease-in-out z-50 ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeMenu}
              className="self-end text-text-primary text-lg absolute top-4 right-4 h-9 w-9"
            >
              <XMarkIcon />
            </button>
            <nav className="flex flex-col gap-4 mt-10">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className="text-primary no-underline text-lg font-semibold hover:text-accent-primary transition-colors duration-300"
                  onClick={closeMenu}
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

function SideNav() {
  return (
    <div>
      <div className="flex justify-stretch gap-4 p-sm">
        <div className="hidden sm:flex">
          <DesktopNavigation />
        </div>
        <MobileNavigation />
      </div>
    </div>
  );
}

export default SideNav;
