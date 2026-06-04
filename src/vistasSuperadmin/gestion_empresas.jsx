import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, CirclePlus, Pencil, Trash2, X, Check } from "lucide-react";
import Swal from "sweetalert2";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import "./gestion_empresas.css";
import HeaderSuperadmin from "../componentesSuperadmin/header_superadmin";
import FooterSuperadmin from "../componentesSuperadmin/footer_superadmin";
import BotonGenerico from "../componentesAdmin/boton_generico";
import { EmpresasGetAll, EmpresasUpdate, EmpresasDelete } from "../servicies/API_Empresa";

gsap.registerPlugin(useGSAP);

const obtenerListado = (datos) => {
  if (Array.isArray(datos)) return datos;
  if (Array.isArray(datos?.datos)) return datos.datos;
  if (Array.isArray(datos?.data)) return datos.data;
  return [];
};

const SkeletonCard = () => (
  <div className="empresa-card-skeleton">
    <div className="skeleton-line skeleton-empresa-icon" />
    <div className="skeleton-empresa-body">
      <span className="skeleton-line skeleton-empresa-name" />
      <span className="skeleton-line skeleton-empresa-desc" />
    </div>
  </div>
);

function GestionEmpresas() {
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [editDescripcion, setEditDescripcion] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const res = await EmpresasGetAll();
      if (!mounted) return;
      if (res.respuesta) {
        setEmpresas(obtenerListado(res.datos));
      } else {
        setError("No se pudieron cargar las empresas.");
      }
      setLoading(false);
    };
    load();
    return () => { mounted = false; };
  }, []);

  useGSAP(() => {
    if (!loading && empresas.length > 0) {
      gsap.fromTo(
        ".empresa-card",
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.06, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [loading, empresas]);

  const handleEdit = (emp) => {
    setEditingId(emp.id);
    setEditNombre(emp.nombre || "");
    setEditDescripcion(emp.descripcion || "");
  };

  const handleSaveEdit = async () => {
    if (!editNombre.trim()) {
      Swal.fire("Error", "El nombre es requerido.", "error");
      return;
    }
    const res = await EmpresasUpdate(editingId, {
      nombre: editNombre.trim(),
      descripcion: editDescripcion.trim(),
    });
    if (res.respuesta) {
      setEmpresas((prev) =>
        prev.map((e) => (e.id === editingId ? { ...e, nombre: editNombre.trim(), descripcion: editDescripcion.trim() } : e))
      );
      setEditingId(null);
      Swal.fire({ title: "Actualizada", text: "Empresa actualizada correctamente.", icon: "success", timer: 1200, showConfirmButton: false });
    } else {
      Swal.fire("Error", res.datos?.message || "No se pudo actualizar.", "error");
    }
  };

  const handleDelete = async (id, nombre) => {
    const result = await Swal.fire({
      title: "Eliminar empresa?",
      text: `${nombre} será eliminada del sistema.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;
    const res = await EmpresasDelete(id);
    if (res.respuesta) {
      setEmpresas((prev) => prev.filter((e) => e.id !== id));
      Swal.fire("Eliminada", "Empresa eliminada correctamente.", "success");
    } else {
      Swal.fire("Error", "No se pudo eliminar.", "error");
    }
  };

  return (
    <div className="gestion-empresas-page">
      <HeaderSuperadmin />
      <main className="gestion-empresas-main">
        <div className="gestion-empresas-top">
          <button className="boton-back" onClick={() => navigate("/superadmin_dashboard")}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <p>SUPERADMIN</p>
            <h1>Gestión de Empresas</h1>
          </div>
        </div>

        {loading ? (
          <div className="empresas-stats-skeleton">
            <div className="stats-card-skeleton"><span className="skeleton-line skeleton-stat-label" /><span className="skeleton-line skeleton-stat-valor" /></div>
          </div>
        ) : (
          <div className="empresas-stats">
            <div className="stats-card-empresa">
              <div className="stats-header-empresa">
                <h4>Total empresas</h4>
                <Building2 size={22} />
              </div>
              <h2>{empresas.length}</h2>
              <p>Registradas en la base de datos</p>
            </div>
          </div>
        )}

        <div className="empresas-actions">
          <BotonGenerico className="btn-nueva-empresa" onClick={() => navigate("/superadmin/agregar_empresa")}>
            <CirclePlus size={20} />
            <span>Nueva empresa</span>
          </BotonGenerico>
        </div>

        {loading ? (
          <div className="empresas-grid">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <p className="empresas-feedback-error">{error}</p>
        ) : empresas.length === 0 ? (
          <p className="empresas-feedback">No hay empresas registradas.</p>
        ) : (
          <div className="empresas-grid">
            {empresas.map((emp) => (
              <div key={emp.id} className="empresa-card">
                {editingId === emp.id ? (
                  <>
                    <div className="empresa-card-edit">
                      <input
                        type="text"
                        value={editNombre}
                        onChange={(e) => setEditNombre(e.target.value)}
                        className="edit-input"
                        placeholder="Nombre"
                      />
                      <textarea
                        value={editDescripcion}
                        onChange={(e) => setEditDescripcion(e.target.value)}
                        className="edit-textarea"
                        placeholder="Descripción"
                        rows={2}
                      />
                    </div>
                    <div className="empresa-card-edit-actions">
                      <button className="edit-btn save" onClick={handleSaveEdit}><Check size={18} /></button>
                      <button className="edit-btn cancel" onClick={() => setEditingId(null)}><X size={18} /></button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="empresa-card-header">
                      <div className="empresa-card-icon">
                        <Building2 size={22} />
                      </div>
                      <div className="empresa-card-info">
                        <h3>{emp.nombre}</h3>
                        <p>{emp.descripcion || "Sin descripción"}</p>
                      </div>
                    </div>
                    <div className="empresa-card-actions">
                      <button className="empresa-action-btn edit" onClick={() => handleEdit(emp)} aria-label="Editar">
                        <Pencil size={16} />
                      </button>
                      <button className="empresa-action-btn delete" onClick={() => handleDelete(emp.id, emp.nombre)} aria-label="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      <FooterSuperadmin />
    </div>
  );
}

export default GestionEmpresas;
