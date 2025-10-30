import { useState } from "react";
import logo from "../../assets/Logo1-nobackground.png";
import { Link, NavLink } from "react-router-dom";
import {
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

const headerLogo = () => {
  return (
    <Link to="/" className="flex items-center gap-4 cursor-pointer">
      <div className="flex items-center">
        <img
          src={logo}
          alt="Jonnavithula's Lineage Logo"
          className="h-[60px] block"
        />
      </div>
      <h1 className="text-2xl font-heading font-bold text-primary hover:text-accent-primary">
        Jonnavithula's Lineage
      </h1>
    </Link>
  );
};

const navItems = [
  { name: "Home", path: "/" },
  { name: "Family Tree", path: "/tree" },
  { name: "Stories", path: "/stories" },
  { name: "Photos", path: "/photos" },
  { name: "Contact", path: "/contact" },
];

function DesktopNavigation() {
  return (
    <nav className="flex items-center gap-4 p-md">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className="text-primary no-underline text-lg font-semibold hover:text-accent-primary transition-colors duration-300"
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

function Header() {
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );

  const toggleTheme = () => {
    setIsDarkMode((prevMode: string) =>
      prevMode === "light" ? "dark" : "light"
    );
    document.documentElement.classList.toggle("dark");
  };

  const themeToggleButton = () => {
    return (
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full bg-background-primary text-accent-primary hover:bg-accent-secondary hover:text-background-primary transition-colors duration-300"
        aria-label="Toggle theme"
      >
        {isDarkMode === "light" ? (
          <MoonIcon className="h-7 w-9" />
        ) : (
          <SunIcon className="h-7 w-9" />
        )}
      </button>
    );
  };

  return (
    <>
      <header className="container bg-background-secondary p-sm shadow-md">
        <div className="mx-auto flex justify-between items-center h-[60px] p-sm">
          {headerLogo()}
          <div className="flex justify-end items-center gap-4 p-sm">
            <div className="hidden sm:flex">
              <DesktopNavigation />
            </div>
            <MobileNavigation />
            {themeToggleButton()}
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
