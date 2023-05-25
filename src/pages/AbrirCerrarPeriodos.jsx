import Navigation from "../components/Navigation";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import MUIDataTable from 'mui-datatables';
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";


const variableObtenerPeriodos = "https://accrual.up.railway.app/period";
const variableNuevoPeriodo = "https://accrual.up.railway.app/period/save";
const variableCerrarPeriodo = "https://accrual.up.railway.app/period/switchActivePeriod";
function AbrirCerrarPeriodos() {

    const [dataPeriodo, setDataPeriodo] = useState([]);
    const [idPeriodo, setIdPeriodo] = useState("");

    //Variables del modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    //Variables del modal
    const [show2, setShow2] = useState(false);
    const handleClose2 = () => setShow2(false);


    // Variables datosModal
    const [nuevoPeriodo, setNuevoPeriodo] = useState('');

    const handleInputChange = (event) => {
        setNuevoPeriodo(event.target.value);
    };

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

    //Cerrar el periodo
    async function handleCerrar() {
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
                    title: "Cerrado",
                    text: "El periodo se ha cerrado",
                    icon: "success",

                    confirmButtonColor: "#3085d6",

                });
                window.location.reload();
            } else {
                await Swal.fire({
                    title: "Error",
                    text: "No se ha podido cerrar el periodo",
                    icon: "error",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "OK",
                });
            }
        } catch (error) {
            console.error(error);
            await Swal.fire({
                title: "Error",
                text: "Ocurrió un error al cerrar el periodo",
                icon: "error",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
            });
        }
        return null;
    }

    // Definimos las columnas
    const columns = [
        { name: "#" },
        { name: "Periodo" },
        { name: "Estado" },
        {
            name: "Opción",
            options: {
                customBodyRender: (value, tableMeta, updateValue) => {
                    const rowIndex = tableMeta.rowIndex;
                    const periodo = dataPeriodo[rowIndex];

                    const handleShow2 = () => {
                        const idPeriodo = periodo.idPeriod;
                        setIdPeriodo(idPeriodo);
                        setShow2(true);
                    };

                    const isPeriodActive = periodo.active !== false;

                    return (
                        <Button variant="danger" onClick={handleShow2} disabled={!isPeriodActive}>
                            Cerrar Periodo
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
        textLabels: {
            body: {
                noMatch: "No se encontraron registros",
                toolTip: "Ordenar",
                columnHeaderTooltip: column => `Ordenar por ${column.label}`
            },
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
                    <div className="form-group m-2">
                        <label htmlFor="nuevoPeriodo ">Ingresar el nuevo periodo </label>
                        <input type="text" required className="form-control  my-3" id="nuevoPeriodo" placeholder="2022-2023"
                            value={nuevoPeriodo}
                            onChange={handleInputChange}
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
                        <p>Cuando se cierra un periodo, este ya no podrá constar en el plan de devengamiento.</p>
                        <p>Presiona aceptar para cerrar el periodo.</p>

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
