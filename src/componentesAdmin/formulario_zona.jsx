import { useState } from 'react';
import "./formulario_zona.css";

function FormularioZona({
    formData,
    onChange,
    sedes = []
}) {

    const [isOpenSede, setIsOpenSede] = useState(false);

    const getDisplayName = (item) => item?.nombre || item?.name || item?.descripcion || item?.tipo || '';

    return (
        <div className="formulario-zona">
            <div className="header-formulario-zona">
                <h3>Informacion General</h3>
                <p>
                    Define la identidad y ubicacion del nuevo garage.
                </p>
            </div>

            <div className="bloque-formulario-zona">
                <div className="input-group">
                    <input
                        type="text"
                        placeholder=" "
                        value={formData.nombre || ''}
                        onChange={(e) => onChange('nombre', e.target.value)}
                    />
                    <label>Nombre del garage</label>
                </div>

                <div className="fila-inputs">
                    <div className="input-group">
                        <input
                            type="number"
                            placeholder=" "
                            value={formData.piso ?? ''}
                            onChange={(e) => onChange('piso', e.target.value === '' ? '' : e.target.value)}
                        />
                        <label>Nivel / Planta</label>
                    </div>
                </div>

                <div className={`input-group menu-dropdown-item ${isOpenSede ? 'dropdown-open' : ''} ${formData.id_sede ? 'has-selected-value' : ''}`}>
                    <div
                        className="dropdown-trigger-clean"
                        onClick={() => setIsOpenSede(!isOpenSede)}
                    >
                        <span className="selected-display-text">
                            {formData.id_sede && sedes.length > 0
                                ? getDisplayName(sedes.find(s => Number(s.id) === Number(formData.id_sede)))
                                : ''
                            }
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
                    <label>Sede</label>
                </div>

                <div className="input-group">
                    <input
                        type="text"
                        placeholder=" "
                        value={formData.ubicacion || ''}
                        onChange={(e) => onChange('ubicacion', e.target.value)}
                    />
                    <label>Ubicacion</label>
                </div>

                <div className="fila-inputs fila-horarios">
                    <div className="input-group input-group-time">
                        <input
                            type="time"
                            placeholder=" "
                            value={formData.hora_apertura || ''}
                            onChange={(e) => onChange('hora_apertura', e.target.value)}
                        />
                        <label>Hora de apertura</label>
                    </div>

                    <div className="input-group input-group-time">
                        <input
                            type="time"
                            placeholder=" "
                            value={formData.hora_cierre || ''}
                            onChange={(e) => onChange('hora_cierre', e.target.value)}
                        />
                        <label>Hora de cierre</label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FormularioZona;
