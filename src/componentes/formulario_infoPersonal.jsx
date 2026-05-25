import { Contact } from 'lucide-react';
import "./formularios.css";

function FormularioInfoPersonal({
    infoPersonalTitulo,
    labels,
    formData,
    onChange,
    sedes = [],
    roles = [],
    isSedeDisabled = false,
    hideSede = false
}) {
    const getDisplayName = (item) => item?.nombre || item?.name || item?.descripcion || item?.tipo || '';

    // Hardcoded roles: empleado (id 2) and garagista (id 3)
    const fixedRoles = [
        { id: 2, nombre: 'empleado' },
        { id: 3, nombre: 'garagista' }
    ];

    return (
        <section className="formulario-container">
            <div className="form-header">
                <Contact className="form-icon" size={24} />
                <h2>{infoPersonalTitulo}</h2>
            </div>

            <div className="input-group">
                {/* El input va primero para usar el selector '+' o '~' en CSS */}
                <input
                    type="text"
                    placeholder=" "
                    value={formData.nombre}
                    onChange={(e) => onChange('nombre', e.target.value)}
                />
                <label>{labels.nombre}</label>
            </div>

            <div className="input-group">
                <input type="text"
                    placeholder=" "
                    value={formData.apellido}
                    onChange={(e) => onChange('apellido', e.target.value)}
                />
                <label>{labels.apellido}</label>
            </div>

            <div className="input-group">
                <input type="email"
                    placeholder=" "
                    value={formData.email}
                    onChange={(e) => onChange('email', e.target.value)}
                />
                <label>{labels.email}</label>
            </div>

            <div className="input-group">
                <input
                    type="tel"
                    placeholder=" "
                    value={formData.telefono}
                    onChange={(e) => onChange('telefono', e.target.value)}
                />
                <label>{labels.telefono}</label>
            </div>

            <div className="input-group">
                <input
                    type="password"
                    placeholder=" "
                    value={formData.contraseña}
                    onChange={(e) => onChange('contraseña', e.target.value)}
                />
                <label>{labels.contraseña}</label>
            </div>

                {!hideSede && (
                    <div className="input-group">
                        <select
                            value={formData.id_sede}
                            onChange={(e) => {
                                const value = e.target.value === '' ? '' : Number(e.target.value);
                                onChange('id_sede', value);
                            }}
                            disabled={isSedeDisabled}required
                            
                        >
                        <option value="" disabled hidden></option>
                            {sedes.map((sede) => (
                                <option key={sede.id} value={sede.id}>
                                    {getDisplayName(sede)}
                                </option>
                            ))}
                        </select>

                        <label>{labels.sede}</label>    
                    </div>
                )}
        </section>
    )
}
export default FormularioInfoPersonal;
