import { useState, useEffect } from "react";
import { Form } from "react-router-dom";
import Swal from "sweetalert2";
function SolicitudRegistroDevengamiento() {

    const variableFacultad = "https://accrual-back-0d9df6337af0.herokuapp.com/faculty/withoutToken";
    const variableRegistro = "https://accrual-back-0d9df6337af0.herokuapp.com/register/ByHimself"

    //Obtener datos generales del docente
    const [valorSelectFacultad, setvalorSelectFacultad] = useState(1);
    const [valorCedula, setValorCedula] = useState("");
    const [valorNombres, setValorNombres] = useState("");
    const [valorApellidos, seValorApellidos] = useState("");
    const [valorCorreo, setValorCorreo] = useState("");
    const [valorModalidad, setValorModalidad] = useState("");
    const [valorCategoria, setValorCategoria] = useState("");

    //Obtener datos de devengamiento
    const [valorEnlaceTesis, setValorEnlaceTesis] = useState("");
    const [valorFechaLectura, setValorFechaLectura] = useState("");
    const [valorFechaReintegro, setValorFechaReintegro] = useState("");
    const [valorTiempoDevengamiento, setValorTiempoDevengamiento] = useState("");
    const [valorEnlaceContrato, setValorEnlaceContrato] = useState("");

    //Obtener datos de redes
    const [valorRedi, setValorRedi] = useState("");
    const [valorInvestigadores, setValorInvestigadores] = useState("");
    const [valorOrci, setValorOrci] = useState("");

    //Obtener los valores de la consula de las facultades
    const [dataFacultades, setDataFacultades] = useState([]);

    //funciones para obtener lo que el usuario escribe
    function handleChange(event) {
        setvalorSelectFacultad(event.target.value);
    }

    function handleChange2(event) {
        setValorCedula(event.target.value);
    }
    function handleChange3(event) {
        setValorNombres(event.target.value);
    }
    function handleChange4(event) {
        seValorApellidos(event.target.value);
    }
    function handleChange5(event) {
        setValorCorreo(event.target.value);
    }
    function handleChange6(event) {
        setValorModalidad(event.target.value);
    }
    function handleChange7(event) {
        setValorCategoria(event.target.value);
    }
    function handleChange8(event) {
        setValorEnlaceTesis(event.target.value);
    }
    function handleChange9(event) {
        setValorFechaLectura(event.target.value);
    }
    function handleChange10(event) {
        setValorFechaReintegro(event.target.value);
    }
    function handleChange11(event) {
        setValorTiempoDevengamiento(event.target.value);
    }
    function handleChange12(event) {
        setValorEnlaceContrato(event.target.value);
    }
    function handleChange13(event) {
        setValorRedi(event.target.value);
    }
    function handleChange14(event) {
        setValorInvestigadores(event.target.value);
    }
    function handleChange15(event) {
        setValorOrci(event.target.value);
    }

    //Creacion del objeto para enviarlo
    const datosSubmit = {
        person: {
            idPerson: null,
            name: valorNombres,
            lastname: valorApellidos,
            email: valorCorreo,
            identification: valorCedula
        },
        docent: {
            idDocent: null,
            faculty: valorSelectFacultad,
            modality: valorModalidad,
            category: valorCategoria,
            idPerson: null
        },
        accrualData: {
            idAccrualData: null,
            thesisLink: valorEnlaceTesis,
            readingThesisDate: valorFechaLectura,
            refundDate: valorFechaReintegro,
            contractAddendumLink: valorEnlaceContrato,
            settlement: false,
            observations: "Hola",
            accrualTime: valorTiempoDevengamiento,
            docent: null
        },
        network: {
            idNetworks: null,
            orcidCode: valorOrci,
            ceida: valorRedi,
            rniSenesyt: valorInvestigadores,
            docent: null,
            socialNetworks: null
        }
    }

    //Consulta a facultades sin token
    useEffect(() => {
        const peticion = async () => {

            try {
                const response = await fetch(`${variableFacultad}`, {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json"

                    },
                });
                const data1 = await response.json();
                setDataFacultades(data1);


            } catch (error) {
                console.log(error);
            }
        };
        peticion();

    }, []);

    async function handleSubmit() {
        //Enviar registro
        try {
            const respuesta = await fetch(`${variableRegistro}`, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datosSubmit),
            });

            if (respuesta.ok) {
                await Swal.fire({
                    title: "Enviado",
                    text: "Los datos se han registrado exitosamente ",
                    icon: "success",

                    confirmButtonColor: "#3085d6",

                });
                window.location.href = "/";
            } else {
                await Swal.fire({
                    title: "Error",
                    text: "Ocurrió un error al enviar el formulario",
                    icon: "error",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "OK",
                });
            }
        } catch (error) {
            console.error(error);
            await Swal.fire({
                title: "Error",
                text: "Ocurrió un error al guardar el formulario",
                icon: "error",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
            });
        }
        return null;
    }

    return (
        <div>
            <div className="container py-3  text-center ">
                <div className="d-flex flex-column justify-content-center align-items-center py-4 ">
                    <h3>Datos requeridos para la solicitud</h3>
                </div>
                <div className="card-body">
                    <div>
                        <Form onSubmit={handleSubmit}>
                            <div className="card-header text-start">
                                <h3>Datos Generales</h3>
                            </div>
                            <div className="row">
                                <div className="col-md-4 ">
                                    <div className="form-group p-4 m-2">
                                        <label className="py-3 text-muted label-form" htmlFor="cedula">Cédula:</label>
                                        <input type="text" required className="form-control" id="cedula" placeholder="Ingrese su cédula"
                                            value={valorCedula}
                                            onChange={handleChange2} />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group p-4 m-2">
                                        <label className="py-3 text-muted label-form" htmlFor="nombres">Nombres:</label>
                                        <input type="text" required className="form-control" id="nombres" placeholder="Ingrese sus nombres"
                                            value={valorNombres}
                                            onChange={handleChange3} />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group p-4 m-2">
                                        <label className="py-3 text-muted label-form" htmlFor="apellidos">Apellidos:</label>
                                        <input type="text" required className="form-control" id="apellidos" placeholder="Ingrese sus apellidos"
                                            value={valorApellidos}
                                            onChange={handleChange4} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group p-3 m-2">
                                        <label className="py-3 text-muted label-form" htmlFor="correo">Correo Institucional:</label>
                                        <input type="email" required className="form-control" id="correo" placeholder="Ingrese su correo institucional"
                                            value={valorCorreo}
                                            onChange={handleChange5} />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group p-3 m-2">
                                        <label className="py-3 text-muted label-form" htmlFor="facultad">Facultad:</label>
                                        <select
                                            id="select-facultad"
                                            className="form-control"
                                            value={valorSelectFacultad}
                                            onChange={(e) =>
                                                setvalorSelectFacultad(e.target.value)
                                            }
                                            required={valorSelectFacultad === ""}
                                        >
                                            <option disabled value=""> ** Seleccione ** </option>
                                            {dataFacultades.map((object) => (
                                                <option
                                                    key={object.idFaculty}
                                                    value={object.idFaculty}
                                                >
                                                    {object.facultyName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group p-3 m-2">
                                        <label className="py-3 text-muted label-form" htmlFor="modalidad">Modalidad de devengamiento:</label>
                                        <input type="text" required className="form-control" id="modalidad" placeholder="Ingrese la modalidad de devengamiento"
                                            value={valorModalidad}
                                            onChange={handleChange6} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group p-3 m-2">
                                        <label className="py-3 text-muted label-form" htmlFor="categoria">Categoría del Docente:</label>
                                        <input type="text" required className="form-control" id="categoria" placeholder="Ingrese la categoría del docente"
                                            value={valorCategoria}
                                            onChange={handleChange7} />
                                    </div>
                                </div>
                            </div>

                            <div className="card-header text-start py-3">
                                <h3>Devengamiento</h3>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group p-3 m-2">
                                        <label className="py-3 text-muted label-form" htmlFor="enlaceTesis">Enlace de Tesis: </label>
                                        <input type="text" required className="form-control" id="enlaceTesis" placeholder="Ingrese su enlace"
                                            value={valorEnlaceTesis}
                                            onChange={handleChange8} />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group p-3 m-2">
                                        <label className="py-3 text-muted label-form" htmlFor="fechaLecturaTesis">Fecha de lectura de la tesis:</label>
                                        <input type="date" required className="form-control" id="fechaLecturaTesis" placeholder="Ingrese la fecha"
                                            value={valorFechaLectura}
                                            onChange={handleChange9} />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group p-3 m-2">
                                        <label className="py-3 text-muted label-form" htmlFor="fechaReintegro">Fecha de reintegro:</label>
                                        <input type="date" required className="form-control" id="fechaReintegro" placeholder="Ingrese la fecha:"
                                            value={valorFechaReintegro}
                                            onChange={handleChange10} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group p-1 m-1">
                                            <label className="py-3 text-muted label-form" htmlFor="tiempoDevengamiento">Tiempo de devengamiento (meses): </label>
                                            <input type="number" required className="form-control" id="tiempoDevengamiento" placeholder="Ingrese el tiempo"
                                                value={valorTiempoDevengamiento}
                                                onChange={handleChange11} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group p-1 m-1">
                                            <label className="py-3 text-muted label-form" htmlFor="enlaceContrato">Enlace de contrato o adenda: </label>
                                            <input type="text" required className="form-control" id="enlaceContrato" placeholder="Ingrese su enlace"
                                                value={valorEnlaceContrato}
                                                onChange={handleChange12} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-header text-start py-3 my-2">
                                <h3>Redes</h3>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group p-4 m-1">
                                        <label className="py-3 text-muted label-form" htmlFor="rediCedia">REDI/CEDIA </label>
                                        <select className="form-control" id="rediCedia" value={valorRedi}
                                            onChange={(e) =>
                                                setValorRedi(e.target.value)
                                            } required={valorRedi === ""} >
                                            <option disabled value="">** Seleccione **</option>
                                            <option value="0">No</option>
                                            <option value="1">Sí</option>
                                        </select>

                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group ">
                                        <label className="py-3 text-muted label-form" htmlFor="investigadoresNacionales">Sistema de Investigadores Nacionales de Senescyt</label>
                                        <select className="form-control" id="investigadoresNacionales" value={valorInvestigadores}
                                            onChange={(e) => setValorInvestigadores(e.target.value)}
                                            required={valorInvestigadores === ""}
                                        >
                                            <option disabled value="">** Seleccione **</option>
                                            <option value="0">No</option>
                                            <option value="1">Sí</option>
                                        </select>

                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group p-3 m-2">
                                        <label className="py-3 text-muted label-form" htmlFor="codigoOrcid">Código ORCI</label>
                                        <input type="text" required className="form-control" id="codigoOrcid" placeholder="https://orcid.org/1111-2222-3333-4444"
                                            value={valorOrci}
                                            onChange={handleChange15} />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary" >Enviar</button>
                        </Form>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default SolicitudRegistroDevengamiento;
