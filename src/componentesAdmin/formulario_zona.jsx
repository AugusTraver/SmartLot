import { useState, useRef } from 'react';
import "./formulario_zona.css";
import { DIAS_SEMANA } from "../helpers/diasSemana";

function FormularioZona({
    formData,
    onChange,
    sedes = []
}) {

  const toggleDia = (diaApi) => {
    const current = formData.dias || [];
    const index = current.indexOf(diaApi);
    let nuevos;
    if (index >= 0) {
      nuevos = current.filter(d => d !== diaApi);
    } else {
      nuevos = [...current, diaApi];
    }
    onChange('dias', nuevos);
  };

    const [isOpenSede, setIsOpenSede] = useState(false);
    const [es24Horas, setEs24Horas] = useState(false);
    const aperturaRef = useRef(null);
    const cierreRef = useRef(null);

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
                    autoComplete="off"
                    required
                />
                    <label>Nombre del garage</label>
                </div>
               <section className='inputsNivelYSede'>
                     <div className="fila-inputs">
                    <div className="inputNivelPlanta input-group">
                        <input
                            type="number"
                            placeholder=" "
                            value={formData.piso ?? ''}
                            onChange={(e) => onChange('piso', e.target.value === '' ? '' : e.target.value)}
                            autoComplete="off"
                            required
                        />
                        <label>Nivel / Planta</label>
                    </div>
                </div>

                <div className= {`inputSede input-group menu-dropdown-item ${isOpenSede ? 'dropdown-open' : ''} ${formData.id_sede ? 'has-selected-value' : ''}`}>
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

               </section>
              
                <div className="input-group">
                    <input
                        type="text"
                        placeholder=" "
                        value={formData.ubicacion || ''}
                        onChange={(e) => onChange('ubicacion', e.target.value)}
                        autoComplete="off"
                        required
                    />
                    <label>Ubicacion</label>
                </div>

                <div className="fila-inputs fila-horarios" style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <div className="input-group input-group-time" style={{ flex: '1 1 140px' }}>
                        <input
                            ref={aperturaRef}
                            type="time"
                            placeholder=" "
                            value={formData.hora_apertura || ''}
                            onChange={(e) => {
                                onChange('hora_apertura', e.target.value);
                                if (es24Horas) setEs24Horas(false);
                            }}
                            disabled={es24Horas}
                            autoComplete="off"
                            required={!es24Horas}
                        />
                        <label>Hora de apertura</label>
                    </div>

                    <div className="input-group input-group-time" style={{ flex: '1 1 140px' }}>
                        <input
                            ref={cierreRef}
                            type="time"
                            placeholder=" "
                            value={formData.hora_cierre || ''}
                            onChange={(e) => {
                                onChange('hora_cierre', e.target.value);
                                if (es24Horas) setEs24Horas(false);
                            }}
                            disabled={es24Horas}
                            autoComplete="off"
                            required={!es24Horas}
                        />
                        <label>Hora de cierre</label>
                    </div>

                    <label
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            color: '#475569',
                            cursor: 'pointer',
                            userSelect: 'none',
                            paddingBottom: '12px',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={es24Horas}
                            onChange={(e) => {
                                const marcado = e.target.checked;
                                setEs24Horas(marcado);
                                if (marcado) {
                                    onChange('hora_apertura', '00:00');
                                    onChange('hora_cierre', '23:59');
                                } else {
                                    onChange('hora_apertura', '');
                                    onChange('hora_cierre', '');
                                }
                            }}
                            style={{
                                width: '16px',
                                height: '16px',
                                accentColor: '#2563eb',
                                cursor: 'pointer',
                            }}
                        />
                        Abierto 24 horas
                    </label>
                </div>

                <div className="dias-semana-section">
                  <label className="dias-semana-label">Días operativos</label>
                  <div className="dias-semana-grid">
                    {DIAS_SEMANA.map((dia) => {
                      const seleccionado = (formData.dias || []).includes(dia.api);
                      return (
                        <label key={dia.api} className={`dia-chip ${seleccionado ? 'dia-seleccionado' : ''}`}>
                          <input
                            type="checkbox"
                            checked={seleccionado}
                            onChange={() => toggleDia(dia.api)}
                          />
                          <span>{dia.display}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
            </div>
        </div>
    );
}

export default FormularioZona;
