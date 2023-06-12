import Navigation from "../components/Navigation";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import MUIDataTable from 'mui-datatables';
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";


const variableObtenerPeriodos = "https://accrual.up.railway.app/period";
const variableNuevoPeriodo = "https://accrual.up.railway.app/period/save";
const variableCerrarPeriodo = "https://accrual.up.railway.app/period/switchActivePeriod";
const variableEliminarPeriodo = "https://accrual.up.railway.app/period/deletePeriodById";

function AbrirCerrarPeriodos() {

    const [dataPeriodo, setDataPeriodo] = useState([]);
    const [idPeriodo, setIdPeriodo] = useState("");

    //Variables del modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const [show2, setShow2] = useState(false);
    const handleClose2 = () => setShow2(false);

    // Variables datosModal
    const [nuevoPeriodo, setNuevoPeriodo] = useState('');

    const handleInputChange = (event) => {
        setNuevoPeriodo(event.target.value);
    };

    //Validar un solo periodo
    const [existePeriodoActivo, setExistePeriodoActivo] = useState(false);
    const [existePeriodoCerrado, setExistePeriodoCerrado] = useState(false);

    const [ periodoActivo, setPeriodoActivo] = useState("");

    //Validar que se ingrese el periodo
    const [errorFormato, setErrorFormato] = useState(false);

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

    //Consulta de los periodos
    useEffect(() => {
        const peticion = async () => {

            try {
                const response = await fetch(`${variableObtenerPeriodos}`, {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data1 = await response.json();
                setDataPeriodo(data1);
                const existeActivo = data1.some(periodo => periodo.active === true);
                setExistePeriodoActivo(existeActivo);

                const periodosActivos = data1.filter(period => period.active)// Filtrar los períodos activos
                    .map(period => period.valuePeriod).join(", "); // Obtener los valores de los períodos activos
                localStorage.setItem("periodosAbiertos", periodosActivos );
            } catch (error) {
                console.log(error);
            }
        };
        peticion();

    }, []);

    const handleShow = () => {
        setShow(true);
    };

    const datosNuevoPeriodo = {
        idPeriod: null,
        valuePeriod: nuevoPeriodo,
        active: null
    }

    //Agregar nuevo periodo
    async function handleNuevoPeriodo() {

        //Validando que el periodo tenga el formato indicado
        const formatoValido = /^\d{4}-\d{4}$/.test(nuevoPeriodo);

        if (existePeriodoActivo) {
            await Swal.fire({
                title: "Error",
                text: "No se puede agregar un nuevo periodo mientras hay un periodo activo",
                icon: "error",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
            });
            return;
        }

        if (!formatoValido) {
            await Swal.fire({
                title: "Error",
                text: "El formato del nuevo periodo debe ser 'xxxx-xxxx'",
                icon: "error",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
            });
            return;
        }
        // Verificar si el nuevo período es igual a datosPeriodo.valuePeriod
        const esIgual = dataPeriodo.some(periodo => periodo.valuePeriod === nuevoPeriodo);

        if (esIgual) {
            await Swal.fire({
                title: "Error",
                text: "El nuevo periodo debe ser diferente al periodo existente",
                icon: "error",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
            });
            return;
        }

        try {
            const respuesta = await fetch(`${variableNuevoPeriodo}`, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(datosNuevoPeriodo),
            });

            if (respuesta.ok) {
                await Swal.fire({
                    title: "Agregado",
                    text: "El nuevo periodo se ha agregado",
                    icon: "success",

                    confirmButtonColor: "#3085d6",

                });
                window.location.reload();
            } else {
                await Swal.fire({
                    title: "Error",
                    text: "Llene los campos",
                    icon: "error",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "OK",
                });
            }
        } catch (error) {
            console.error(error);
            await Swal.fire({
                title: "Error",
                text: "Ocurrió un error al guardar el periodo",
                icon: "error",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
            });
        }
        return null;
    }

    // Abrir/Cerrar el periodo
    async function handleCerrar() {
        if (existePeriodoActivo && !existePeriodoCerrado) {
            await Swal.fire({
                title: "Error",
                text: "Ya existe un periodo abierto",
                icon: "error",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
            });
            return;
        }
        try {
            const respuesta = await fetch(`${variableCerrarPeriodo}/${idPeriodo}`, {
                method: "PATCH",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },

            });

            if (respuesta.ok) {
                await Swal.fire({
                    title: "Realizado",
                    text: "El estado del periodo se ha modificado",
                    icon: "success",

                    confirmButtonColor: "#3085d6",

                });
                window.location.reload();
            } else {
                await Swal.fire({
                    title: "Error",
                    text: "No se ha podido modificar el estado del periodo",
                    icon: "error",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "OK",
                });
            }
        } catch (error) {
            console.error(error);
            await Swal.fire({
                title: "Error",
                text: "Ocurrió un error al cambiar el estado del periodo",
                icon: "error",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
            });
        }
        return null;
    }

    // Definimos las columnas
    const columns = [
        {
            name: "#",
            options: {
                customHeadRender: (columnMeta) => {
                    return (
                        <th className="header-datatable">{columnMeta.label}</th>
                    );
                },
            },
        },
        {
            name: "PERIODO",
            options: {
                customHeadRender: (columnMeta) => {
                    return (
                        <th className="header-datatable">{columnMeta.label}</th>
                    );
                },
            },
        },
        {
            name: "ESTADO",
            options: {
                customHeadRender: (columnMeta) => {
                    return (
                        <th className="header-datatable">{columnMeta.label}</th>
                    );
                },
            },
        },
        {
            name: "OPCIÓN",
            options: {
                customHeadRender: (columnMeta) => {
                    return (
                        <th className="header-datatable">{columnMeta.label}</th>
                    );
                },
                customBodyRender: (value, tableMeta, updateValue) => {
                    const rowIndex = tableMeta.rowIndex;
                    const periodo = dataPeriodo[rowIndex];

                    const handleShow2 = () => {
                        const idPeriodo = periodo.idPeriod;
                        setIdPeriodo(idPeriodo);
                        const estadoPeriodoActual = periodo.active;
                        setExistePeriodoCerrado(estadoPeriodoActual);
                        setShow2(true);
                    };

                    const isPeriodActive = periodo.active !== false;

                    return (
                        <div>
                            <div class="d-grid gap-2 d-sm-block">
                                <Button variant="danger" className=" mx-1 btn-block" onClick={handleShow2} disabled={!isPeriodActive}>
                                    Cerrar Periodo
                                </Button>
                                <Button variant="success" className="mx-2 btn-block" disabled={isPeriodActive} onClick={handleShow2}>
                                    Abrir Periodo
                                </Button>
                            </div>
                        </div>
                    );
                },
            },
        },
        {
            name: "ACCIÓN",
            options: {
                customHeadRender: (columnMeta) => {
                    return (
                        <th className="header-datatable">{columnMeta.label}</th>
                    );
                },
                customBodyRender: (value, tableMeta, updateValue) => {
                    const rowIndex = tableMeta.rowIndex;
                    const periodo = dataPeriodo[rowIndex];
                    const handleEliminar = async () => {
                        const result = await Swal.fire({
                            title: '¿Está seguro?',
                            text: 'Esta acción eliminará el período de forma permanente',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Sí, eliminar',
                            cancelButtonText: 'Cancelar',
                        });

                        if (result.isConfirmed) {
                            try {
                                const respuesta = await fetch(`${variableEliminarPeriodo}/${periodo.idPeriod}`, {
                                    method: "DELETE",
                                    mode: "cors",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${token}`,
                                    },
                                });

                                if (respuesta.ok) {
                                    await Swal.fire({
                                        title: "Eliminado",
                                        text: "El periodo se ha eliminado",
                                        icon: "success",
                                        confirmButtonColor: "#3085d6",
                                    });
                                    window.location.reload();
                                } else {
                                    await Swal.fire({
                                        title: "Error",
                                        text: "El periodo ya contiene planes, no se puede eliminar",
                                        icon: "error",
                                        confirmButtonColor: "#3085d6",
                                        confirmButtonText: "OK",
                                    });
                                }
                            } catch (error) {
                                console.error(error);
                                await Swal.fire({
                                    title: "Error",
                                    text: "Ocurrió un error al eliminar el periodo",
                                    icon: "error",
                                    confirmButtonColor: "#3085d6",
                                    confirmButtonText: "OK",
                                });
                            }
                        }
                    };
                    return (
                        <Button variant="warning" onClick={handleEliminar} >
                            Eliminar Periodo
                        </Button>

                    );
                },
            },
        }
    ];

    const transformedData = dataPeriodo.map((periodo, index) => {
        return [
            index + 1, // Columna #
            periodo.valuePeriod,
            periodo.active !== false ? 'Abierto' : 'Cerrado', // Transforma el valor a "Abierto" o "Cerrado"
        ];
    });

    const options = {
        responsive: "standard",
        selectableRows: "none",
        pagination: true,
        sort: false,
        textLabels: {

            pagination: {
                next: "Siguiente",
                previous: "Anterior",
                rowsPerPage: "Filas por página:",
                displayRows: "de",
            },
            toolbar: {
                search: "Buscar",
                downloadCsv: "Descargar CSV",
                print: "Imprimir",
                viewColumns: "Ver columnas",
                filterTable: "Filtrar tabla",
            },
            filter: {
                all: "Todos",
                title: "FILTROS",
                reset: "REINICIAR",
            },
            viewColumns: {
                title: "Mostrar columnas",
                titleAria: "Mostrar/ocultar columnas de la tabla",
            },
            selectedRows: {
                text: "fila(s) seleccionada(s)",
                delete: "Eliminar",
                deleteAria: "Eliminar filas seleccionadas",
            },

        },
    };


    const titleStyles = {
        color: '#0076bd', // Cambia el color del título a azul
        fontSize: '1.4em', // Cambia el tamaño de fuente del título
    };

    return (
        <div>
            <Navigation />
            <div className="d-flex flex-column justify-content-center align-items-center px-4 py-3 ">
                <h3>Abrir / Cerrar Periodos</h3>
            </div>

            <MUIDataTable
                title={<h4 style={titleStyles}>Periodos Agregados</h4>}
                data={transformedData}
                columns={columns}
                options={options}

            />
            <div className="py-3 mx-4">
                <Button variant="primary" onClick={handleShow}>Agregar Nuevo Periodo</Button>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Periodo</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className={`form-group m-2 ${errorFormato ? 'has-error' : ''}`}>
                        <label htmlFor="nuevoPeriodo">Ingresar el nuevo periodo</label>
                        <input
                            type="text"
                            required
                            className="form-control my-3"
                            id="nuevoPeriodo"
                            placeholder="2022-2023"
                            value={nuevoPeriodo}
                            onChange={event => setNuevoPeriodo(event.target.value)}
                        />

                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
                    <Button variant="primary" onClick={handleNuevoPeriodo}>Agregar Periodo</Button>
                </Modal.Footer>
            </Modal>


            <Modal show={show2} onHide={handleClose2}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmación</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <div className="form-group m-2">
                        <p>Abrir/Cerrar periodos</p>
                        <p>Recuerda que al cerrar el periodo, este no se podrá utilizar para los planes, por lo que tendrás que abrirlo para usarlo.</p>
                        <p>Presiona aceptar para continuar.</p>

                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose2}>Cerrar</Button>
                    <Button variant="primary" onClick={handleCerrar} >Aceptar</Button>
                </Modal.Footer>

            </Modal>


        </div>
    )
}

export default AbrirCerrarPeriodos;
