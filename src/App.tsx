import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { useTheme } from "./hooks/useTheme";

function App() {
  const { theme } = useTheme();
  return (
    <div
      style={{
        backgroundColor: theme.colors.backgroundPrimary,
        minHeight: "100vh",
        color: theme.colors.textPrimary,
        transition: theme.transition,
        transitionDuration: theme.transitionDuration,
        fontFamily: theme.typography.fonts.body,
        fontWeight: theme.typography.weights.regular,
      }}
    >
      <BrowserRouter>
        <Header />
        <main style={{ flex: 1 }}>
          <AppRoutes />
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
