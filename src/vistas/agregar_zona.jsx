import "./agregar_zona.css";
import Header from "../componentes/header_admin";
import { ArrowLeft, Star, CarFront, Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AgregarZona() {

    const navigate = useNavigate();

    return (

        <div className="agregar-zona">

            <Header />

            <div className="contenido-agregar-zona">

                {/* TOP */}

                <div className="top-agregar-zona">

                    <button
                        className="boton-back"
                        onClick={() => navigate("/gestion_garages ")}
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div>
                        <p>Configuración</p>
                        <h1>Edición de garage</h1>

                        <span>
                            Define los parámetros operativos y la capacidad del garage seleccionado.
                        </span>
                    </div>

                </div>

                {/* FORM */}

                <form className="formulario-agregar-zona">

                    {/* INFO GENERAL */}

                    <div className="bloque-formulario">

                        <h3>Información General</h3>

                        <label>Nombre del Garage</label>

                        <input
                            type="text"
                            placeholder="Garage B, Exterior Norte"
                        />

                        <label>Nivel / Planta</label>

                        <select>
                            <option>Piso 2</option>
                            <option>Piso 1</option>
                            <option>Subsuelo</option>
                        </select>

                        <label>Ubicación</label>

                        <textarea
                            rows="4"
                            placeholder="Ubicación del garage"
                        ></textarea>

                    </div>

                    {/* ESTADO */}

                    <div className="bloque-formulario">

                        <h3>Estado Operativo</h3>

                        <div className="estado-container">

                            <button
                                type="button"
                                className="estado-btn activo"
                            >
                                Activo
                            </button>

                            <button
                                type="button"
                                className="estado-btn"
                            >
                                Mantenimiento
                            </button>

                            <button
                                type="button"
                                className="estado-btn"
                            >
                                Desconectado
                            </button>

                        </div>

                    </div>

                    {/* PLAZAS */}

                    <div className="bloque-formulario">

                        <h3>Gestión de Plazas</h3>

                        <div className="plaza-card">

                            <div className="plaza-top">

                                <div className="plaza-icon">
                                    <Star size={18} />
                                </div>

                                <span className="plaza-tag">
                                    VIP
                                </span>

                            </div>

                            <h4>Plazas VIP</h4>

                            <p>Ubicaciones preferenciales.</p>

                            <div className="contador">

                                <button type="button">
                                    <Minus size={16} />
                                </button>

                                <span>12</span>

                                <button type="button">
                                    <Plus size={16} />
                                </button>

                            </div>

                        </div>

                        <div className="plaza-card">

                            <div className="plaza-top">

                                <div className="plaza-icon">
                                    <CarFront size={18} />
                                </div>

                                <span className="plaza-tag">
                                    ESTÁNDAR
                                </span>

                            </div>

                            <h4>Estándar</h4>

                            <p>Plazas de uso general.</p>

                            <div className="contador">

                                <button type="button">
                                    <Minus size={16} />
                                </button>

                                <span>45</span>

                                <button type="button">
                                    <Plus size={16} />
                                </button>

                            </div>

                        </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="acciones-formulario">

                        <button
                            type="button"
                            className="btn-cancelar"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="btn-guardar"
                        >
                            Guardar Cambios
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default AgregarZona;