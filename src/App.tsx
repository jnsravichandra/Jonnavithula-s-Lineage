import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
// import { useTheme } from "./hooks/useTheme";
// import NewHeader from "./components/newHeader";

function App() {
  // const { theme } = useTheme();
  return (
    <div className="bg-background-primary text-text-primary min-h-screen font-body font-regular transition-colors duration-300 flex flex-col">
      <BrowserRouter>
        <Header />
        <main className="grow p-md">
          <AppRoutes />
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
