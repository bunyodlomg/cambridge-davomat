
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

// Components
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Groups from "./pages/Groups";
import Attendance from "./pages/Attendance";

const App = () => {
  const { user } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => (!user ? <Navigate to="/login" /> : children);

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        {user && <Sidebar />}
        <div className="flex-1 flex flex-col">
          {user && <Topbar user={user} />}
          <main className="flex-1 p-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
              <Route path="/teachers" element={<ProtectedRoute><Teachers /></ProtectedRoute>} />
              <Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
              <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
