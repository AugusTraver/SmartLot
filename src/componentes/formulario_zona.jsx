import "./formulario_zona.css";

function ForumularioZona({ nombreZona, nivel, etiqueta, ubicacion }) {
    return (
        <div className="formulario-zona">
            <div className="header-formulario-zona">
                <h3>Información General</h3>
                <p>Define la identidad y ubicación del nuevo garage</p>
            </div>
            <div className="bloque-formulario">
                <div className="grupo-input">
                    <input type="text" placeholder={nombreZona} />
                    <input type="text" placeholder={nivel} />
                    <input type="text" placeholder={etiqueta} />
                    <textarea rows="4" placeholder={ubicacion}></textarea>
                </div>
            </div>
        </div>
    );
}

export default ForumularioZona;