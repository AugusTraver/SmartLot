import "./formulario_capacidad.css";

function FormularioCapacidad({

    capacidad,
    capacidadReservas,
    capacidadNoReservas

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

                <div className="grupo-input-capacidad">

                    <label>Capacidad total</label>

                    <input
                        type="number"
                        placeholder={capacidad}
                    />

                </div>


                <div className="fila-capacidad">

                    <div className="grupo-input-capacidad">

                        <label>Reservas</label>

                        <input
                            type="number"
                            placeholder={capacidadReservas}
                        />

                    </div>


                    <div className="grupo-input-capacidad">

                        <label>No Reservas</label>

                        <input
                            type="number"
                            placeholder={capacidadNoReservas}
                        />

                    </div>

                </div>

            </div>

        </div>
    );
}

export default FormularioCapacidad;