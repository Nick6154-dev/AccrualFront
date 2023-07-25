import Navigation from "../components/Navigation";
import { useState, useEffect } from "react";
import { Form } from "react-router-dom";
import Swal from "sweetalert2";

function NuevoDocente() {

    const variableFacultad = "https://accrualback.up.railway.app/faculty/withoutToken";
    const variableNuevoDocente = "https://accrualback.up.railway.app/register/ByAnotherOne";

    //Obtener datos generales del docente
    const [valorSelectFacultad, setvalorSelectFacultad] = useState(0);
    const [valorCedula, setValorCedula] = useState("");
    const [valorNombres, setValorNombres] = useState("");
    const [valorApellidos, seValorApellidos] = useState("");
    const [valorCorreo, setValorCorreo] = useState("");
    const [valorModalidad, setValorModalidad] = useState("");
    const [valorCategoria, setValorCategoria] = useState("");

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
        }
    }

    //Obtenemos el Token con estado
    const [token, setToken] = useState(sessionStorage.getItem("token"));
    useEffect(() => {
        const handleStorageChange = () => {
            setToken(sessionStorage.getItem("token"));
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

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
            const respuesta = await fetch(`${variableNuevoDocente}`, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(datosSubmit),
            });
            const data1 = await respuesta.json();
            const error = Object.values(data1);
            console.log(typeof error[0]);
            if (error[0] === "Nuevo docente registrado con exito") {
                await Swal.fire({
                    title: "Enviado",
                    text: "Los datos se han registrado exitosamente ",
                    icon: "success",

                    confirmButtonColor: "#3085d6",

                });
                window.location.href = "/#/index";
            } else {
                await Swal.fire({
                    title: "Error",
                    text: error,
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
            <Navigation />
            <div className="container py-3  text-center ">
                <div className="d-flex flex-column justify-content-center align-items-center py-4 ">
                    <h3>Nuevo Docente</h3>
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
                                            <option> ** Seleccione ** </option>
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
                                    <label className="py-4 my-1 text-muted label-form" htmlFor="modalidad">Modalidad de devengamiento:</label>
                                    <select
                                        id="modalidad"
                                        required={true}
                                        onChange={handleChange6}
                                        value={valorModalidad}
                                        className="form-control">
                                        <option className="text-center"> ** Seleccione **</option>
                                        <option value="Tiempo de devengamiento">Tiempo de devengamiento</option>
                                        <option value="Medio tiempo (combinado)">Medio tiempo (combinado)</option>
                                    </select>

                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group p-3 m-2">
                                        <label className="py-3 text-muted label-form" htmlFor="categoria">Categoría del Docente:</label>
                                        <select
                                            id="categoria"
                                            required={true}
                                            onChange={handleChange7}
                                            value={valorCategoria}
                                            className="form-control">
                                            <option className="text-center"> ** Seleccione **</option>
                                            <option value="Auxiliar 1">Auxiliar 1</option>
                                            <option value="Auxiliar 2">Auxiliar 2</option>
                                            <option value="Agregado 1">Agregado 1</option>
                                            <option value="Agregado 2">Agregado 2</option>
                                            <option value="Agregado 3">Agregado 3</option>
                                            <option value="Principal">Principal</option>
                                        </select>
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

export default NuevoDocente;
