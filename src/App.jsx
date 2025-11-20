import AdminDashboard from "./pages/admin/AdminDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import LoginPage from "./pages/LoginPage";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      {/* Protected routes */}
      <Route path="/admin" element={
        user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/" />
      } />

      <Route path="/teacher" element={
        user?.role === "teacher" ? <TeacherDashboard /> : <Navigate to="/" />
      } />
    </Routes>
  );
}

export default App;
