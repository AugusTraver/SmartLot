import { Contact } from 'lucide-react';
import "./formularios.css";
import { useState } from 'react';

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

    const [isOpenSede, setIsOpenSede] = useState(false);
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
                <div className={`input-group menu-dropdown-item ${isOpenSede ? 'dropdown-open' : ''} ${formData.id_sede ? 'has-selected-value' : ''}`}>

                  
                    <div
                        className="dropdown-trigger-clean"
                        onClick={() => !isSedeDisabled && setIsOpenSede(!isOpenSede)}
                        style={isSedeDisabled ? { opacity: 0.5, cursor: 'not-allowed', backgroundColor: '#f5f5f5' } : {}}
                    >
                       
                        <span className="selected-display-text">
                            {formData.id_sede
                                ? getDisplayName(sedes.find(s => s.id === formData.id_sede))
                                : ''}
                        </span>

                       
                        <svg className="chevron-arrow-svg" viewBox="0 0 24 24">
                            <path d="M7 10l5 5 5-5H7z" fill="currentColor" />
                        </svg>
                    </div>

                   
                    <ul className="submenu-custom-list">
                        {sedes.map((sede) => (
                            <li
                                key={sede.id}
                                className="submenu-custom-option"
                                onClick={() => {
                                    onChange('id_sede', Number(sede.id));
                                    setIsOpenSede(false); 
                                }}
                            >
                                <span className="submenu-custom-link">
                                    {getDisplayName(sede)}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <label>{labels.sede}</label>
                </div>
            )}
        </section>
    )
}
export default FormularioInfoPersonal;
