import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import { clearCache } from "../cache/cacheStore";
import { useAuth } from "../contexts/useAuth";
import {
  eliminarSuperadminBackup,
  eliminarUsuarioImpersonado,
  obtenerSuperadminBackup,
  obtenerUsuarioImpersonado,
} from "../helpers/superadminSession";

export default function GaragistaDashboard() {
  const navigate = useNavigate();
  const { setUsuario, setRoleTransition } = useAuth();

  const handleCerrarSesion = async () => {
    const cookies = document.cookie.split("; ").filter(Boolean);
    const superadminBackup = obtenerSuperadminBackup();
    const usuarioImpersonado = obtenerUsuarioImpersonado();

    if (cookies.length > 1 && superadminBackup && usuarioImpersonado) {
      eliminarUsuarioImpersonado();
      clearCache();
      setRoleTransition(true);
      setUsuario(superadminBackup);
      navigate("/superadmin_dashboard", { replace: true });
      return;
    }

    try {
      await apiClient.post("/api/usuario/logout");
    } catch {
      // Salimos localmente aunque falle el logout del servidor.
    }

    eliminarSuperadminBackup();
    eliminarUsuarioImpersonado();
    setUsuario(null);
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column", color: "#333", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Panel Garagista</h1>
      <p style={{ fontSize: "1.1rem", color: "#888" }}>Proximamente</p>
      <button
        type="button"
        onClick={handleCerrarSesion}
        style={{
          marginTop: "1.5rem",
          border: "none",
          borderRadius: "12px",
          padding: "0.85rem 1.25rem",
          background: "#fee2e2",
          color: "#b91c1c",
          fontSize: "0.95rem",
          fontWeight: 800,
          cursor: "pointer",
        }}
      >
        Cerrar sesion
      </button>
    </div>
  );
}
