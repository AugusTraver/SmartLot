import "./formulario_capacidad.css";

function FormularioCapacidad({
    capacidad,
    capacidadReservas,
    capacidadNoReservas
}) {

    return (

        <div className="formulario-capacidad">

            <h3>Capacidad del Garage</h3>

            <div className="bloque-formulario">

                <input
                    type="text"
                    placeholder={capacidad}
                />

                <input
                    type="text"
                    placeholder={capacidadReservas}
                />

                <input
                    type="text"
                    placeholder={capacidadNoReservas}
                />

            </div>

        </div>
    );
}

export default FormularioCapacidad;