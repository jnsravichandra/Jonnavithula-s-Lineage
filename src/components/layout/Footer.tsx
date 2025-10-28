import { useTheme } from "../../hooks/useTheme";

function Footer() {
  const { theme } = useTheme();
  return (
    <footer
      style={{
        padding: "1rem 1rem",
        textAlign: "center",
        backgroundColor: theme.colors.backgroundSecondary,
        transition: theme.transition,
      }}
    >
      <p>© {new Date().getFullYear()} Jonnavithula Family. All rights reserved.</p>
    </footer>
  );
}

export default Footer;