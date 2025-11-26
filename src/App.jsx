import React, { useContext } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider, ThemeContext } from "./context/ThemeContext";
import AppRoutes from "./routes/AppRoutes";

const AppContent = () => {
  const { theme } = useContext(ThemeContext);

  return (
    // Shu div dark mode’ni boshqaradi
    <div className="">
      <AppRoutes />
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
