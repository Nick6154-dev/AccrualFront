import Navigation from "../components/Navigation";
import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import MUIDataTable from 'mui-datatables';
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";
import Switch from "react-switch";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

const variableObtenerPeriodos = "https://accrualback.up.railway.app/period";
const variableNuevoPeriodo = "https://accrualback.up.railway.app/period/save";
const variableCerrarPeriodo = "https://accrualback.up.railway.app/period/switchActivePeriod";
const variableEliminarPeriodo = "https://accrualback.up.railway.app/period/deletePeriodById";
const variableCambiarModo = "https://accrualback.up.railway.app/period/switchStatePeriod";
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
    const [estadosPeriodos, setEstadosPeriodos] = useState([]);
    const [modoPeriodo, setModoPeriodo] = useState([]);

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

    const obtenerPeriodos = async () => {
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

            // Ordenar los periodos activos primero
            data1.sort((a, b) => {
                if (a.active && !b.active) {
                    return -1; // a está activo, b está inactivo
                } else if (!a.active && b.active) {
                    return 1; // a está inactivo, b está activo
                } else {
                    return 0; // ambos están activos o inactivos, no se cambia el orden
                }
            });

            setDataPeriodo(data1);

            // Actualiza los estados de los periodos individuales
            const estados = data1.map((periodo) => ({
                idPeriodo: periodo.idPeriod,
                active: periodo.active,
            }));
            setEstadosPeriodos(estados);

            // Actualiza los estados de los periodos individuales
            const modo = data1.map((periodo) => ({
                idPeriodo: periodo.idPeriod,
                state: periodo.state,
            }));
            setModoPeriodo(modo)

            const existeActivo = data1.some((periodo) => periodo.active === true);
            setExistePeriodoActivo(existeActivo);

            const periodosActivos = data1
                .filter((period) => period.active)
                .map((period) => period.valuePeriod)
                .join(", ");
            localStorage.setItem("periodosAbiertos", periodosActivos);
        } catch (error) {
            console.log(error);
        }
    };

    //Consulta de los periodos
    useEffect(() => {
        obtenerPeriodos();
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
    async function handleCerrar(idPeriodo) {

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
                obtenerPeriodos();
                // Reordenar los periodos activos primero
                dataPeriodo.sort((a, b) => {
                    if (a.active && !b.active) {
                        return -1; // a está activo, b está inactivo
                    } else if (!a.active && b.active) {
                        return 1; // a está inactivo, b está activo
                    } else {
                        return 0; // ambos están activos o inactivos, no se cambia el orden
                    }
                });
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

    // Cambiar el modo del periodo
    async function handleModo(idPeriodo) {

        try {
            const respuesta = await fetch(`${variableCambiarModo}/${idPeriodo}`, {
                method: "PATCH",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (respuesta.ok) {
                obtenerPeriodos();
            } else {
                await Swal.fire({
                    title: "Error",
                    text: "No se ha podido Cambiar de modo al periodo",
                    icon: "error",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "OK",
                });
            }
        } catch (error) {
            console.error(error);
            await Swal.fire({
                title: "Error",
                text: "Ocurrió un error al cambiar el modo del periodo",
                icon: "error",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
            });
        }
        return null;
    }


    const handleShow2 = (periodo) => {
        const estadoPeriodo = periodo.active;
        const idPeriodo = periodo.idPeriod;

        setEstadosPeriodos((estados) =>
            estados.map((estado) =>
                estado.idPeriodo === idPeriodo
                    ? { ...estado, active: !estadoPeriodo }
                    : estado
            )
        );
        handleCerrar(idPeriodo);
    };


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
            name: "ABRIR/CERRAR",
            options: {
                customHeadRender: (columnMeta) => {
                    return <th className="header-datatable">{columnMeta.label}</th>;
                },
                customBodyRender: (value, tableMeta, updateValue) => {
                    const rowIndex = tableMeta.rowIndex;
                    const periodo = dataPeriodo[rowIndex];
                    const idPeriodo = periodo.idPeriod;
                    setIdPeriodo(idPeriodo);
                    return (
                        <div>
                            <Switch
                                onChange={() => handleShow2(periodo, idPeriodo)}
                                checked={
                                    estadosPeriodos.find(
                                        (estado) => estado.idPeriodo === periodo.idPeriod
                                    )?.active || false
                                }
                                disabled={existePeriodoActivo && !periodo.active}

                                //Estilos 
                                offColor="#E20D23"
                                onColor="#0AB624"
                                offHandleColor="#FFFFFF"
                                onHandleColor="#FFFFFF"

                                className="react-switch"
                            />
                        </div>
                    );
                },
            },
        },
        {
            name: "CAMBIAR MODO",
            options: {
                customHeadRender: (columnMeta) => {
                    return <th className="header-datatable">{columnMeta.label}</th>;
                },
                customBodyRender: (value, tableMeta, updateValue) => {
                    const rowIndex = tableMeta.rowIndex;
                    const periodo = dataPeriodo[rowIndex];

                    const idPeriodo = periodo.idPeriod;
                    setIdPeriodo(idPeriodo);
                    return (
                        <div>
                            <Button variant="success">Modo Registro</Button>
                            <Button variant="primary" className="m-2">Modo Evidencias</Button>
                            <Button variant="danger">Modo Doble</Button>

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
                        <Button variant="warning" onClick={handleEliminar}>
                            Eliminar Periodo
                        </Button>
                    );
                },
            },
        },
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
                <Button variant="primary" onClick={handleShow}>
                    Agregar Nuevo Periodo
                </Button>
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

            </div>
        </div>
    );
}

export default AbrirCerrarPeriodos;