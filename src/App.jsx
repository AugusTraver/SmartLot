import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";

// Vistas de Administración
import AdminDashboard from "./vistasAdmin/admin_dashboard";
import GestionEmpleados from "./vistasAdmin/gestion_de_empleados";
import GestionGarages from "./vistasAdmin/gestion_garages";
import EditarZona from "./vistasAdmin/editar_zona";
import AgregarEmpleado from "./vistasAdmin/agregar_empleado";
import AgregarGarajista from "./vistasAdmin/agregar_garajista";
import AgregarZona from "./vistasAdmin/agregar_zona";
import PerfilAdmin from "./vistasAdmin/perfil_admin";

// Vistas de Superadmin
import SuperadminDashboard from "./vistasSuperadmin/superadmin_dashboard";
import GestionUsuarios from "./vistasSuperadmin/gestion_usuarios";
import AgregarUsuario from "./vistasSuperadmin/agregar_usuario";
import GestionEmpresas from "./vistasSuperadmin/gestion_empresas";
import AgregarEmpresa from "./vistasSuperadmin/agregar_empresa";
import GestionSedes from "./vistasSuperadmin/gestion_sedes";
import AgregarSede from "./vistasSuperadmin/agregar_sede";

// Vistas Landing & Base
import LandingPage from "./vistasLanding/Landing";
import Auth from "./vistasLanding/Auth";
import AuthCallback from "./vistasLanding/AuthCallback";

// Vistas de Empleados (Conexión corregida del perfil de empleado)
import EmpleadoDashboard from "./vistasEmpleados/empleados_dashboard";
import NuevaReserva from "./vistasEmpleados/nueva_reserva";
import PerfilEmpleado from "./vistasEmpleados/perfil_empleado";
import AgregarVehiculo from "./vistasEmpleados/agregar_vehiculo";

// Vistas Adicionales y Utilidades
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
      <Route path="/auth/callback" element={<AuthCallback />} />

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

      
      {/* Ruta del Perfil del Empleado protegida */}
      <Route path="/perfil_empleado" element={
        <ProtectedRoute allowedRoles={[2]} usuario={usuario}>
          <PerfilEmpleado />
        </ProtectedRoute>
      } />
      <Route path="/agregar_vehiculo" element={
        <ProtectedRoute allowedRoles={[2]} usuario={usuario}>
          <AgregarVehiculo />
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
      {/* Ruta del Perfil del Admin protegida */}
      <Route path="/perfil_admin" element={
        <ProtectedRoute allowedRoles={[1]} usuario={usuario}>
          <PerfilAdmin />
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

      {/* Rutas protegidas - Superadmin */}
      <Route path="/superadmin_dashboard" element={
        <ProtectedRoute allowedRoles={[4]} usuario={usuario}>
          <SuperadminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/superadmin/gestion_usuarios" element={
        <ProtectedRoute allowedRoles={[4]} usuario={usuario}>
          <GestionUsuarios />
        </ProtectedRoute>
      } />
      <Route path="/superadmin/agregar_usuario" element={
        <ProtectedRoute allowedRoles={[4]} usuario={usuario}>
          <AgregarUsuario />
        </ProtectedRoute>
      } />
      <Route path="/superadmin/gestion_empresas" element={
        <ProtectedRoute allowedRoles={[4]} usuario={usuario}>
          <GestionEmpresas />
        </ProtectedRoute>
      } />
      <Route path="/superadmin/agregar_empresa" element={
        <ProtectedRoute allowedRoles={[4]} usuario={usuario}>
          <AgregarEmpresa />
        </ProtectedRoute>
      } />
      <Route path="/superadmin/gestion_sedes" element={
        <ProtectedRoute allowedRoles={[4]} usuario={usuario}>
          <GestionSedes />
        </ProtectedRoute>
      } />
      <Route path="/superadmin/agregar_sede" element={
        <ProtectedRoute allowedRoles={[4]} usuario={usuario}>
          <AgregarSede />
        </ProtectedRoute>
      } />

      {/* Catch-all: Fallback seguro */}
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

export default App;
