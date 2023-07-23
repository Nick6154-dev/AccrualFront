import Navigation from "../components/Navigation";
import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import MUIDataTable from 'mui-datatables';
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";
import Switch from "react-switch";
import { useNavigate } from "react-router-dom";
import Checkbox from '@mui/material/Checkbox';
import { obtenerPeriodosAPI } from "../api/periodos";

const variableNuevoPeriodo = "https://accrualback.up.railway.app/period/save";
const variableCerrarPeriodo = "https://accrualback.up.railway.app/period/switchActivePeriod";
const variableEliminarPeriodo = "https://accrualback.up.railway.app/period/deletePeriodById";
const variableCambiarModo = "https://accrualback.up.railway.app/period/switchStatePeriods";
const variableObtenerDocentes = "https://accrualback.up.railway.app/person/findAllWithSettlementNotApproved";

function AbrirCerrarPeriodos() {

    const [dataPeriodo, setDataPeriodo] = useState([]);
    const [idPeriodo, setIdPeriodo] = useState("");
    const [dataDocentes, setDataDocentes] = useState([]);
    
    const [idPeriodoModo, setIdPeriodoModo] = useState();
    const navigate = useNavigate();

    //Variables del modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);


    //Variables del modal
    const [show3, setShow3] = useState(false);
    const handleClose3 = () => setShow3(false);

    const [show4, setShow4] = useState(false);
    const handleClose4 = () => setShow4(false);

    const [show2, setShow2] = useState(false);
    const handleClose2 = () => setShow2(false);

    // Variables datosModal
    const [nuevoPeriodo, setNuevoPeriodo] = useState('');

    const handleInputChange = (event) => {
        setNuevoPeriodo(event.target.value);

    }

    //Validar un solo periodo
    const [existePeriodoActivo, setExistePeriodoActivo] = useState(false);
    const [estadosPeriodos, setEstadosPeriodos] = useState([]);
    const [modoPeriodo, setModoPeriodo] = useState([]);
    const [valorSelectModal, setValorSelectModal] = useState();
    const [selectedRows, setSelectedRows] = useState([]);

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

    function handleChangeSelect() {
        const valorObtenidoSelect = document.getElementById("select-modo").value
        setValorSelectModal(parseInt(valorObtenidoSelect))
        if (valorObtenidoSelect == 1) {
            setShow4(true);
            handleClose3(false);

        } else if (valorObtenidoSelect == 2 || valorObtenidoSelect == 3) {
            setSelectedRows([])
        }
    }


    const obtenerPeriodos = async () => {
        const data1 = await obtenerPeriodosAPI(token);

        // Ordenar los periodos activos primero
        data1.sort((a, b) => {
            if (a.period.active && !b.period.active) {
                return -1; // a está activo, b está inactivo
            } else if (!a.period.active && b.period.active) {
                return 1; // a está inactivo, b está activo
            } else {
                return 0; // ambos están activos o inactivos, no se cambia el orden
            }
        });

        setDataPeriodo(data1);

        // Actualiza los estados de los periodos individuales
        const estados = data1.map((periodo) => ({
            idPeriodo: periodo.period.idPeriod,
            active: periodo.period.active,
        }));
        setEstadosPeriodos(estados);

        const existeActivo = data1.some((periodo) => periodo.period.active === true);
        setExistePeriodoActivo(existeActivo);

        const periodosActivos = data1
            .filter((period) => period.period.active)
            .map((period) => period.period.valuePeriod)
            .join(", ");
        localStorage.setItem("periodosAbiertos", periodosActivos);

    };

    //Consulta de los periodos
    useEffect(() => {
        obtenerPeriodos();
    }, []);

    const handleShow = () => {
        setShow(true);
    };

    const handleShow3 = () => {
        setShow3(true);
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
                    if (a.period.active && !b.period.active) {
                        return -1; // a está activo, b está inactivo
                    } else if (!a.period.active && b.period.active) {
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

    const datosCambiarModo = {
        "periods": idPeriodoModo,
        "state": valorSelectModal,
        "people": selectedRows
    }

console.log(datosCambiarModo);
    // Cambiar el modo del periodo
    async function handleModo() {

        try {
            const respuesta = await fetch(`${variableCambiarModo}`, {
                method: "PATCH",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(datosCambiarModo)
            });
            const respuestaModo = await respuesta.json();
            let error = Object.values(respuestaModo)

            if (respuesta.ok) {

                obtenerPeriodos();
                handleClose3(false);
                handleClose4(false);
                setValorSelectModal();
                setSelectedRows([]);
                await Swal.fire({
                    title: "Actualizado",
                    text: "La etapa del sistema se ha cambiado exitosamente",
                    icon: "success",

                    confirmButtonColor: "#3085d6",

                });
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
                text: error,
                icon: "error",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
            });
        }
        return null;
    }

    const handleShow2 = (periodo) => {
        const estadoPeriodo = periodo.period.active;
        const idPeriodo = periodo.period.idPeriod;

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
            name: "MODO ACTUAL",
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
                    const idPeriodo = periodo.period.idPeriod;
                    setIdPeriodo(idPeriodo);
                    return (
                        <div>
                            <Switch
                                onChange={() => handleShow2(periodo, idPeriodo)}
                                checked={
                                    estadosPeriodos.find(
                                        (estado) => estado.idPeriodo === periodo.period.idPeriod
                                    )?.active || false
                                }

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
            name: "",
            options: {
                customHeadRender: (columnMeta) => {
                    return <th className="header-datatable">{columnMeta.label}</th>;
                },
                customBodyRender: (value, tableMeta, updateValue) => {
                    const rowIndex = tableMeta.rowIndex;
                    const periodo = dataPeriodo[rowIndex];

                    const handleCambiarModo = () => {
                        const idPeriodo = periodo.period.idPeriod;

                        setIdPeriodoModo(idPeriodo);
                        
                        handleShow3();
                    }
                    return (
                        <div>
                            <Button variant="success" onClick={handleCambiarModo}>
                                Cambiar Modo</Button>
                        </div>
                    );
                },
            },
        },
        {
            name: "",
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
                                const respuesta = await fetch(`${variableEliminarPeriodo}/${periodo.period.idPeriod}`, {
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
    console.log(idPeriodoModo);
    const transformedData = dataPeriodo.map((periodo, index) => {
        const estadoEtapa = {
            0: 'No Existe una etapa registrada',
            1: 'Etapa completa (Registro/Validación)',
            2: 'Etapa de Registro',
            3: 'Etapa de validación'
        };

        return [
            index + 1, // Columna #
            periodo.period.valuePeriod,
            periodo.period.active !== false ? 'Abierto' : 'Cerrado', // Transforma el valor a "Abierto" o "Cerrado"
            estadoEtapa[periodo.period.state]
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

    // Tabla de docentes
    //Consulta a docentes que han llenado los planes
    useEffect(() => {
        const peticion = async () => {
            try {
                const response = await fetch(`${variableObtenerDocentes}`, {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,

                    },
                });
                const data1 = await response.json();
                setDataDocentes(data1);


            } catch (error) {
                console.log(error);
            }
        };
        peticion();

    }, []);
    // Definimos las columnas
    const columnsDocentes = [
        {
            name: "selection",
            options: {
                customHeadRender: () => {
                    const handleSelectAllClick = () => {
                        if (selectedRows.length === dataDocentes.length) {
                            setSelectedRows([]);
                        } else {
                            setSelectedRows(dataDocentes.map((docente) => docente.idPerson));
                        }
                    };

                    const isChecked = selectedRows.length === dataDocentes.length;

                    return (
                        <th className="header-datatable">
                            <Checkbox
                                checked={isChecked}
                                onChange={handleSelectAllClick}
                                color="primary"
                            />
                        </th>
                    );
                },
                customBodyRender: (value, tableMeta) => {
                    const rowIndex = tableMeta.rowIndex;
                    const docente = dataDocentes[rowIndex];
                    const isSelected = selectedRows.includes(docente.person.idPerson);

                    const handleSelectClick = () => {
                        const selected = [...selectedRows];
                        if (isSelected) {
                            const index = selected.indexOf(docente.person.idPerson);
                            selected.splice(index, 1);
                        } else {
                            selected.push(docente.person.idPerson);
                        }
                        setSelectedRows(selected);
                    };

                    return (
                        <Checkbox
                            checked={isSelected}
                            onChange={handleSelectClick}
                            color="primary"
                        />
                    );
                },
            },
        },
        {
            name: "Cédula",
            options: {
                customHeadRender: (columnMeta) => {
                    return (
                        <th className="header-datatable">{columnMeta.label}</th>
                    );
                },
            },
        },
        {
            name: "Nombres",
            options: {
                customHeadRender: (columnMeta) => {
                    return (
                        <th className="header-datatable">{columnMeta.label}</th>
                    );
                },
            },
        },
        {
            name: "Apellidos",
            options: {
                customHeadRender: (columnMeta) => {
                    return (
                        <th className="header-datatable">{columnMeta.label}</th>
                    );
                },
            },
        },
        {
            name: "Facultad",
            options: {
                customHeadRender: (columnMeta) => {
                    return (
                        <th className="header-datatable">{columnMeta.label}</th>
                    );
                },
            },
        }
    ];

    // Transformar los datos para que coincidan con las columnas del DataTable
    const transformedData2 = dataDocentes.map((docente, index) => {
        return [
            "",
            docente.person.identification, // Columna Cédula
            docente.person.name, // Columna Nombres
            docente.person.lastname, // Columna Apellidos
            docente.faculty, // Columna Facultad
            "",
        ];
    });


    //Checkbox de seleccionar todos
    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const allRows = Array.from({ length: dataDocentes.length }, (_, index) => index);
            setSelectedRows(allRows);
        } else {
            setSelectedRows([]);
        }
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

                <Modal show={show3} onHide={handleClose3}>
                    <Modal.Header closeButton>
                        <Modal.Title>Cambiar Modo</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className="form-group m-2">
                            <label htmlFor="nuevoPeriodo">Seleccione una etapa para el sistema</label>
                            <div className="p-2">
                                <select
                                    id="select-modo"
                                    value={valorSelectModal}
                                    onChange={handleChangeSelect}
                                    className="form-control">
                                    <option> ** Seleccione ** </option>
                                    <option value={2}> Etapa Registro</option>
                                    <option value={3}> Etapa Validación</option>
                                    <option value={1}> Etapa Completa (Registro/Validación)</option>
                                </select>
                            </div>
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose3}>Cerrar</Button>
                        <Button variant="primary" onClick={handleModo}>Cambiar modo</Button>
                    </Modal.Footer>
                </Modal>


                <Modal show={show4} onHide={handleClose4} size={"xl"}>
                    <Modal.Header closeButton>
                        <Modal.Title>Docentes</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className="form-group m-2">
                            <MUIDataTable
                                title={<h4>Seleccionar Docentes</h4>}
                                data={transformedData2}
                                columns={columnsDocentes}
                                options={options}
                            />
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose4}>Cerrar</Button>
                        <Button variant="primary" onClick={handleModo}>Establer Etapa Completa</Button>
                    </Modal.Footer>
                </Modal>

            </div>
        </div>
    );
}

export default AbrirCerrarPeriodos;