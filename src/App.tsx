import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { useTheme } from "./hooks/useTheme";

function App() {
  const { theme } = useTheme();
  return (
    <div style={{ backgroundColor: theme.colors.backgroundPrimary }}>
      <Header />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
