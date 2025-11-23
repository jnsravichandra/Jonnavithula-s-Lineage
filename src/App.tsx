import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

function App() {
  return (
    <div className="bg-background-primary text-text-primary min-h-screen font-body font-regular transition-colors duration-300 flex flex-col">
      <Header />
      <main className="grow">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;
