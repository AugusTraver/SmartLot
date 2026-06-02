import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AdminDashboard from "./vistasAdmin/admin_dashboard";
import GestionEmpleados from "./vistasAdmin/gestion_de_empleados";
import GestionGarages from "./vistasAdmin/gestion_garages";
import EditarZona from "./vistasAdmin/editar_zona";
import AgregarEmpleado from "./vistasAdmin/agregar_empleado";
import AgregarGarajista from "./vistasAdmin/agregar_garajista";
import AgregarZona from "./vistasAdmin/agregar_zona";
import LandingPage from "./vistasLanding/Landing";
import Auth from "./vistasLanding/Auth";
import EmpleadoDashboard from "./vistasEmpleados/empleados_dashboard";
import NuevaReserva from "./vistasEmpleados/nueva_reserva";
import GaragistaDashboard from "./vistasGaragista/garagista_dashboard";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./contexts/useAuth";
import { setNavigate } from "./api/navigation";

function AppRoutes() {
  const navigate = useNavigate();
  const { usuario, loading } = useAuth();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  if (loading) return null;

  return (
    <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/register-form" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Rutas protegidas - Empleados */}
        <Route path="/empleados_dashboard" element={
          <ProtectedRoute allowedRoles={[2]} usuario={usuario}>
            <EmpleadoDashboard />
          </ProtectedRoute>
        } />
        <Route path="/nueva_reserva" element={
          <ProtectedRoute allowedRoles={[2]} usuario={usuario}>
            <NuevaReserva />
          </ProtectedRoute>
        } />

        {/* Rutas protegidas - Garagista */}
        <Route path="/garagista_dashboard" element={
          <ProtectedRoute allowedRoles={[3]} usuario={usuario}>
            <GaragistaDashboard />
          </ProtectedRoute>
        } />

        {/* Rutas protegidas - Admin */}
        <Route path="/admin_dashboard" element={
          <ProtectedRoute allowedRoles={[1]} usuario={usuario}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/gestion_de_empleados" element={
          <ProtectedRoute allowedRoles={[1]} usuario={usuario}>
            <GestionEmpleados />
          </ProtectedRoute>
        } />
        <Route path="/agregar_empleado" element={
          <ProtectedRoute allowedRoles={[1]} usuario={usuario}>
            <AgregarEmpleado />
          </ProtectedRoute>
        } />
        <Route path="/agregar_garajista" element={
          <ProtectedRoute allowedRoles={[1]} usuario={usuario}>
            <AgregarGarajista />
          </ProtectedRoute>
        } />
        <Route path="/gestion_garages" element={
          <ProtectedRoute allowedRoles={[1]} usuario={usuario}>
            <GestionGarages />
          </ProtectedRoute>
        } />
        <Route path="/agregar_zona" element={
          <ProtectedRoute allowedRoles={[1]} usuario={usuario}>
            <AgregarZona />
          </ProtectedRoute>
        } />
        <Route path="/editar_zona" element={
          <ProtectedRoute allowedRoles={[1]} usuario={usuario}>
            <EditarZona />
          </ProtectedRoute>
        } />

        {/* Catch-all: redirigir a /login si no hay sesión */}
        <Route path="*" element={
          !usuario ? <Navigate to="/login" /> : <Navigate to="/" />
        } />
      </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App
