import MUIDataTable from 'mui-datatables';
import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { Alert } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';

const variableObtenerPeriodos = "https://accrualback.up.railway.app/validator/findPlansByPerson";
const variableValidador = "https://accrualback.up.railway.app/validator/updateStateObservationsPlan";
const variableExcel = "https://accrualback.up.railway.app/validator/generateExcel"

function VerPeriodos() {

    //Obtener los valores de la consula de los periodos
    const [dataPeriodos, setDataPeriodos] = useState([]);
    const [idPlanObtenido, setIdPlanObtenido] = useState("");

    //Variables del modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    //Variables del modal
    const [show2, setShow2] = useState(false);
    const handleClose2 = () => setShow2(false);

    // Obtener el parametro del url
    const params = useParams();
    const idPersona = params.idPersona;

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



    //Obtenemos el Cedula con estado
    const [cedula, setCedula] = useState(sessionStorage.getItem("cedula"));
    useEffect(() => {
        const handleStorageChange = () => {
            setCedula(sessionStorage.getItem("cedula"));
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    //Obtenemos el Nombres con estado
    const [nombres, setNombres] = useState(sessionStorage.getItem("nombreDocente"));
    useEffect(() => {
        const handleStorageChange = () => {
            setNombres(sessionStorage.getItem("nombreDocente"));
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    //Obtenemos el Apellidos con estado
    const [apellidos, setApellidos] = useState(sessionStorage.getItem("apellidoDocente"));
    useEffect(() => {
        const handleStorageChange = () => {
            setApellidos(sessionStorage.getItem("apellidoDocente"));
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);


    //Consulta a docentes que han llenado los planes
    useEffect(() => {
        const peticion = async () => {

            try {
                const response = await fetch(`${variableObtenerPeriodos}/${idPersona}`, {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data1 = await response.json();


                setDataPeriodos([data1]);
            } catch (error) {
                console.log(error);
            }
        };
        peticion();

    }, []);


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
            name: "Periodo",
            options: {
                customHeadRender: (columnMeta) => {
                    return (
                        <th className="header-datatable">{columnMeta.label}</th>
                    );
                },
            },
        },
        {
            name: "Estado",
            options: {
                customHeadRender: (columnMeta) => {
                    return (
                        <th className="header-datatable">{columnMeta.label}</th>
                    );
                },
            },
        },
        {
            name: "Opción",
            options: {
                customHeadRender: (columnMeta) => {
                    return (
                        <th className="header-datatable">{columnMeta.label}</th>
                    );
                },
                customBodyRender: (value, tableMeta, updateValue) => {
                    const rowIndex = tableMeta.rowIndex;

                    const plan = dataPeriodos[0].plans[rowIndex];

                    const handleShow2 = () => {
                        const idPlanOpcion = plan.idPlan;
                        setIdPlanObtenido(idPlanOpcion);
                        setShow2(true);
                    };
                    return (
                        <Button variant="link" onClick={handleShow2}>
                            Ver Actividades
                        </Button>
                    );
                },
            },
        },

        {
            name: "Validación",
            options: {
                customHeadRender: (columnMeta) => {
                    return (
                        <th className="header-datatable">{columnMeta.label}</th>
                    );
                },

                customBodyRender: (value, tableMeta, updateValue) => {
                    const rowIndex = tableMeta.rowIndex;
                    const plan = dataPeriodos[0].plans[rowIndex];


                    const handleShow = () => {
                        const idPlan = plan.idPlan;

                        setIdPlanObtenido(idPlan);
                        setShow(true);
                    };

                    const isDisabled = plan.state === 1; // Verificar si el estado es igual a 1

                    return (
                        <Button variant="primary" onClick={handleShow} disabled={isDisabled}>
                            Validar
                        </Button>
                    );
                },
            },
        }
    ];


    const transformedData = dataPeriodos.flatMap((periodo, index) => {
        return periodo.plans.map((plan, planIndex) => {
            let stateText = "";
            switch (plan.state) {
                case 0:
                    stateText = "En revisión";
                    break;
                case 1:
                    stateText = "Aprobado";
                    break;
                case 2:
                    stateText = "Denegado";
                    break;
                default:
                    stateText = "";
                    break;
            }
            return [
                planIndex + 1, // Columna #
                plan.period.valuePeriod, // Columna Periodo
                <span>{stateText}</span>
            ];
        });
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
        fontSize: '1.7em', // Cambia el tamaño de fuente del título

    };

    //Variables para el modal
    const [selectedValue, setSelectedValue] = useState('');
    const [textareaValue, setTextareaValue] = useState('');

    const handleRadioChange = (event) => {
        setSelectedValue(event.target.value);
        if (event.target.value === '1') {
            setTextareaValue('Aprobado Planificación');
        }
        if (event.target.value === '3') {
            setTextareaValue('Aprobado Evidencias');
        }
    };

    const handleTextareaChange = (event) => {
        setTextareaValue(event.target.value);
    };

    //Descargar el Excel
    async function handleExcel() {
        fetch(`${variableExcel}/${idPersona},${idPlanObtenido}`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al generar el archivo Excel');
                }
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${nombres} ${" "}${apellidos}.xlsx`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                Swal.close();
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Ha ocurrido un error al generar el archivo Excel.',
                    icon: 'error',
                });
            });
    }

    const dataNotificar = {
        idPlan: idPlanObtenido,
        starDate: null,
        numberPlan: null,
        idDocent: null,
        editable: null,
        state: selectedValue,
        period: null,
        observations: textareaValue
    }

    async function handleNotificar() {
        // enviar Validacion
        try {
            const respuesta = await fetch(`${variableValidador}`, {
                method: "PATCH",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(dataNotificar),
            });

            if (respuesta.ok) {
                await Swal.fire({
                    title: "Notificado",
                    text: "La validación se ha guardado exitosamente ",
                    icon: "success",

                    confirmButtonColor: "#3085d6",

                });
                window.location.href = "/#/revisarValidar";
            } else {
                await Swal.fire({
                    title: "Error",
                    text: "Ocurrió un error al enviar la validación",
                    icon: "error",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "OK",
                });
            }
        } catch (error) {
            console.error(error);
            await Swal.fire({
                title: "Error",
                text: "Ocurrió un error al guardar la validación",
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
            <div className="d-flex flex-column justify-content-center align-items-left px-4 py-3 ">
                <h3>Revisar / Validar</h3>
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center  ">
                <Alert variant="primary" className=" col-sm-6 text-left">

                    <h4 className='text-center'>Docente en revisión:</h4>
                    <p> <strong >CÉDULA: </strong>  {cedula}</p>
                    <p> <strong>NOMBRES:</strong> {nombres} {apellidos}</p>

                </Alert>
            </div>
            <MUIDataTable
                title={<h3 style={titleStyles}>Listado de Docentes</h3>}
                data={transformedData}
                columns={columns}
                options={options}

            />
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Validación de las actividades</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="exampleRadios" id="radio1" value="1"
                            checked={selectedValue === '1'}
                            onChange={handleRadioChange}
                        />
                        <label className="form-check-label" htmlFor="radio1">
                            Aprobar Planificación
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="exampleRadios" id="radio2" value="2"
                            checked={selectedValue === '2'}
                            onChange={handleRadioChange} />
                        <label className="form-check-label" htmlFor="radio2">
                            Denegar Planificación
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="exampleRadios" id="radio3" value="3"
                            checked={selectedValue === '3'}
                            onChange={handleRadioChange} />
                        <label className="form-check-label" htmlFor="radio3">
                            Aprobar Evidencias
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="exampleRadios" id="radio4" value="4"
                            checked={selectedValue === '4'}
                            onChange={handleRadioChange} />
                        <label className="form-check-label" htmlFor="radio4">
                            Denegar Evidencias
                        </label>
                    </div>
                    <div className="form-group m-2">
                        <label htmlFor="observaciones ">Observaciones: </label>
                        <textarea required className="form-control" id="observaciones" rows="3"
                            value={textareaValue}
                            onChange={handleTextareaChange}
                        ></textarea>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
                    <Button variant="primary" onClick={handleNotificar}>Notificar al docente</Button>
                </Modal.Footer>

            </Modal>

            <Modal show={show2} onHide={handleClose2}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmación</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <div className="form-group m-2">
                        <p>Se va a descargar una hoja Excel con las actividades.</p>
                        <p>Presiona aceptar para ver las actividades.</p>

                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose2}>Cerrar</Button>
                    <Button variant="primary" onClick={handleExcel}>Aceptar</Button>
                </Modal.Footer>

            </Modal>

        </div>
    )
}


export default VerPeriodos
