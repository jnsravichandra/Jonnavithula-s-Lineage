import { useTheme } from "../../hooks/useTheme";
import logo from "../../assets/Logo1-nobackground.png";
import { Link } from "react-router-dom";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

function Header() {
  const { theme, toggleTheme } = useTheme();
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Family Tree", path: "/tree" },
    { name: "Stories", path: "/stories" },
    { name: "Photos", path: "/photos" },
    { name: "Contact", path: "/contact" },
  ];

  const headerLogo = () => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          cursor: "pointer",
        }}
      >
        <Link to="/">
          <img
            src={logo}
            alt="Jonnavithula's Lineage Logo"
            style={{ height: "60px", display: "block" }}
          />
        </Link>
        <h1>
          Jonnavithula's Lineage
        </h1>
      </div>
    );
  };

  const navigationBar = () => {
    return (
      <nav style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <div
          style={{
            width: "1px",
            height: "24px",
            backgroundColor: theme.colors.textSecondary,
          }}
        />
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            style={{
              color: theme.colors.textPrimary,
              textDecoration: "none",
              fontSize: theme.typography.sizes.lg,
              fontWeight: theme.typography.weights.regular,
            }}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    );
  };

  const themeToggleButton = () => {
    return (
      <div
        onClick={toggleTheme}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
        aria-label="Toggle theme"
      >
        <SunIcon
          style={{
            height: "1.5rem",
            width: "1.5rem",
            color:
              theme.name === "light"
                ? theme.colors.accentSecondary
                : theme.colors.textSecondary,
          }}
        />
        <div
          style={{
            width: "40px",
            height: "24px",
            backgroundColor: theme.colors.backgroundSecondary,
            borderRadius: "12px",
            position: "relative",
            display: "flex",
            alignItems: "center",
            padding: "2px",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: theme.colors.backgroundPrimary,
              borderRadius: "50%",
              position: "absolute",
              left: theme.name === "light" ? "2px" : "18px",
              transition: "left 0.3s ease-in-out",
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }}
          />
        </div>
        <MoonIcon
          style={{
            height: "1.5rem",
            width: "1.5rem",
            color:
              theme.name === "dark"
                ? theme.colors.accentPrimary
                : theme.colors.textSecondary,
          }}
        />
      </div>
    );
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        backgroundColor: theme.colors.backgroundPrimary,
        padding: "0 1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "70px",
        borderBottom: `1px solid ${theme.colors.backgroundSecondary}`,
        transition: theme.transition,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {headerLogo()}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        {navigationBar()}
        {themeToggleButton()}
      </div>
    </header>
  );
}

export default Header;
