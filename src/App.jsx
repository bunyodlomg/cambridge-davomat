import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import LoginPage from "./pages/LoginPage";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Routes>
      {/* Login page */}
      <Route path="/" element={<LoginPage />} />

      {/* Universal dashboard → role bo‘yicha yo‘naltirish */}
      <Route
        path="/dashboard"
        element={
          user
            ? user.role === "admin"
              ? <Navigate to="/admin" />
              : <Navigate to="/teacher" />
            : <Navigate to="/" />
        }
      />

      {/* Admin panel */}
      <Route
        path="/admin"
        element={
          user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/" />
        }
      />

      {/* Teacher panel */}
      <Route
        path="/teacher"
        element={
          user?.role === "teacher" ? <TeacherDashboard /> : <Navigate to="/" />
        }
      />

      {/* Unknown routes → home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
