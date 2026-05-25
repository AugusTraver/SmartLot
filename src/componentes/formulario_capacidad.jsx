import "./formulario_capacidad.css";

function FormularioCapacidad({
    formData,
    onChange
}) {

    return (

        <div className="formulario-capacidad">

            <div className="header-formulario-capacidad">

                <h3>Capacidad del Garage</h3>

                <p>
                    Configura la distribución
                    de plazas disponibles.
                </p>

            </div>


            <div className="bloque-formulario-capacidad">

                <div className="input-group">



                    <input
                        type="number"
                        placeholder="Ej. 50"
                        value={formData.capacidad}
                        onChange={(e) => onChange('capacidad', e.target.value)}
                    />
                    <label>Capacidad total</label>
                </div>


                <div className="fila-capacidad">

                    <div className="input-group">



                        <input
                            type="number"
                            placeholder="Ej. 20"
                            value={formData.capacidad_reservas}
                            onChange={(e) => onChange('capacidad_reservas', e.target.value)}
                        />
                        <label>Reservas</label>
                    </div>


                    <div className="input-group">



                        <input
                            type="number"
                            placeholder="Ej. 30"
                            value={formData.capacidad_para_no_reservas}
                            onChange={(e) => onChange('capacidad_para_no_reservas', e.target.value)}
                        />
                        <label>No Reservas</label>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default FormularioCapacidad;