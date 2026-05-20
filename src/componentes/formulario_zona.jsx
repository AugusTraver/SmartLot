import "./formulario_zona.css";

function FormularioZona({
    formData,
    onChange
}) {
    return (
        <div className="formulario-zona">
            <div className="header-formulario-zona">
                <h3>Información General</h3>
                <p>
                    Define la identidad y ubicación
                    del nuevo garage.
                </p>
            </div>

            <div className="bloque-formulario-zona">
                <div className="grupo-input">
                    <label>Nombre del garage</label>
                    <input
                        type="text"
                        placeholder="Ej. Garage Central"
                        value={formData.nombre}
                        onChange={(e) => onChange('nombre', e.target.value)}
                    />
                </div>

                <div className="fila-inputs">
                    <div className="grupo-input">
                        <label>Nivel / Planta</label>
                        <input
                            type="number"
                            placeholder="Ej. Planta 1"
                            value={formData.piso}
                            onChange={(e) => onChange('piso', e.target.value)}
                        />
                    </div>
                </div>

                <div className="grupo-input">
                    <label>Ubicación</label>
                    <textarea
                        rows="4"
                        placeholder="Ej. Calle Falsa 123, Ciudad"
                        value={formData.ubicacion}
                        onChange={(e) => onChange('ubicacion', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}

export default FormularioZona;
