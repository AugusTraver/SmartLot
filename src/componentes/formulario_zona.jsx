import "./formulario_zona.css";

function ForumularioZona({
    nombreZona,
    nivel,
    etiqueta,
    ubicacion
}) {

    return (

        <div className="formulario-zona">

            <div className="header-formulario-zona">

                <h3>Información General</h3>

                <p>
                    Define la identidad y ubicación
                    del nuevo garage
                </p>

            </div>


            <div className="bloque-formulario">

                <div className="grupo-input">

                    <label>Nombre del garage</label>

                    <input
                        type="text"
                        placeholder={nombreZona}
                    />

                </div>


                <div className="fila-inputs">

                    <div className="grupo-input">

                        <label>Nivel / Planta</label>

                        <input
                            type="text"
                            placeholder={nivel}
                        />

                    </div>


                    <div className="grupo-input">

                        <label>Etiqueta</label>

                        <input
                            type="text"
                            placeholder={etiqueta}
                        />

                    </div>

                </div>


                <div className="grupo-input">

                    <label>Ubicación</label>

                    <textarea
                        rows="4"
                        placeholder={ubicacion}
                    />

                </div>

            </div>

        </div>
    );
}

export default ForumularioZona;