// src/vistasAdmin/perfil_admin.jsx (Líneas de renderizado final)
return (
  /* 🚀 Encapsulamos con una clase raíz única para aislar el CSS */
  <div className="admin-scope-root"> 
    <div className="Perfil-contenedor">
      <Header />
      <div className="perfilUsuario-Contenedor" ref={mainScopeRef}>
        <main className="perfilUsuario-contenido">
          
          <div className="top-navigation-bar">
            <div className="animate-back-admin">
              <button
                className="boton-back-admin"
                onClick={() => navigate("/admin_dashboard")}
                aria-label="Volver al panel"
                type="button"
              >
                <ArrowLeft size={20} />
              </button>
            </div>
            
            <header className="textosTitulosPerfilAdmin">
              <h1>Mi Perfil</h1>
              <div className="admin-role-badge">
                <Shield size={13} />
                <span>Administrador de Sede</span>
              </div>
            </header>
          </div>

          <div className="admin-bento-grid-wrapper">
            <div className="admin-bento-card-view info-personal-wrapper-card">
              <FormularioInfoPersonal 
                nombre={personalData.nombre}
                apellido={personalData.apellido}
                email={personalData.email}
                telefono={personalData.telefono}
              />
            </div>

            <div className="admin-bento-card-view security-system-status-card">
              <div className="security-card-header">
                <div className="security-badge-icon">
                  <ShieldAlert size={20} />
                </div>
                <h3>Estado de Credenciales</h3>
              </div>

              <div className="security-status-indicators">
                <div className="indicator-row">
                  <span className="indicator-pulse-dot"></span>
                  <div className="indicator-text-block">
                    <p className="ind-label">Nivel de Acceso</p>
                    <p className="ind-val text-brand-blue-accent">Privilegios Críticos Activos</p>
                  </div>
                </div>

                <div className="indicator-row">
                  <div className="indicator-text-block">
                    <p className="ind-label">Consola de Control</p>
                    <p className="ind-val">Gestión de Garages & Empleados</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="action-buttons-group-admin">
            <button 
              type="button" 
              className="btn-secondary-action-admin" 
              onClick={handleCerrarSesion}
            >
              <LogOut size={18} />
              <span>Cerrar Sesión</span>
            </button>
          </div>

        </main>
      </div>
      <Footer />
    </div>
  </div>
);