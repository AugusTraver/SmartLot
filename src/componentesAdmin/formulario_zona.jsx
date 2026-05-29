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
                <h3>Información General</h3>
                <p>
                    Define la identidad y ubicación del nuevo garage.
                </p>
            </div>

            <div className="bloque-formulario-zona">
                <div className="input-group">
                    {/* Quitamos los placeholders con texto para que la etiqueta baje al medio como la contraseña */}
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
                        {/* Renderizado limpio: si no hay sede, el span queda vacío para que el label se centre */}
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
                    <label>Ubicación</label>
                </div>
            </div>
        </div>
    );
}

export default FormularioZona;