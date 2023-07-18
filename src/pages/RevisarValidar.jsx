import MUIDataTable from 'mui-datatables';
import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import AddTaskIcon from '@mui/icons-material/AddTask';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";
import Checkbox from '@mui/material/Checkbox';

const variableObtenerDocentes = "https://accrualback.up.railway.app/validator/findAllDocentPersonPlans";
const variableAprobarPlanes = "https://accrualback.up.railway.app/validator/approveAllPlans";
const variableExcel = "https://accrualback.up.railway.app/validator/generateExcelDocentsInPlan";
const variableExcelDocentes = "https://accrualback.up.railway.app/validator/generateExcelSelectDocentsActivitiesPlan";

function RevisarValidar() {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const navigate = useNavigate();

    //Obtener los valores de la consula de los docentes
    const [dataDocentes, setDataDocentes] = useState([]);

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

    // Aprobar todos los planes
    async function handleAprobarPlanes() {

        try {
            const respuesta = await fetch(`${variableAprobarPlanes}`, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },

            });

            if (respuesta.ok) {
                await Swal.fire({
                    title: "Realizado",
                    text: "Todos los planes se han aprobado con éxito",
                    icon: "success",

                    confirmButtonColor: "#3085d6",

                });
                window.location.reload();
            } else {
                await Swal.fire({
                    title: "Error",
                    text: "No se ha podido aprobar todos los planes",
                    icon: "error",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "OK",
                });
            }
        } catch (error) {
            console.error(error);
            await Swal.fire({
                title: "Error",
                text: "Ocurrió un error al aprobar los planes",
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
            name: "selection",
            options: {
                customHeadRender: () => {
                    const handleSelectAllClick = () => {
                        if (selectedRows.length === dataDocentes.length) {
                            setSelectedRows([]);
                        } else {
                            setSelectedRows(dataDocentes.map((docente) => docente.person.idPerson));
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
        },
        {
            name: "Acción",
            options: {
                customHeadRender: (columnMeta) => {
                    return (
                        <th className="header-datatable">{columnMeta.label}</th>
                    );
                },
                customBodyRender: (value, tableMeta, updateValue) => {
                    const rowIndex = tableMeta.rowIndex;
                    const docente = dataDocentes[rowIndex];
                    const handleVerPeriodos = () => {
                        sessionStorage.setItem("nombreDocente", docente.person.name);
                        sessionStorage.setItem("apellidoDocente", docente.person.lastname);
                        sessionStorage.setItem("cedula", docente.person.identification);
                        navigate(`/periodos/${docente.person.idPerson}/ver`);
                    };

                    return (
                        <Button variant="link" onClick={handleVerPeriodos}>
                            Ver Periodos
                        </Button>
                    );
                },
            },
        },
    ];

    // Transformar los datos para que coincidan con las columnas del DataTable
    const transformedData = dataDocentes.map((docente, index) => {
        return [
            "",
            index + 1, // Columna #
            docente.person.identification, // Columna Cédula
            docente.person.name, // Columna Nombres
            docente.person.lastname, // Columna Apellidos
            docente.docent.faculty, // Columna Facultad
            "",
        ];
    });


    //Checkbox de seleccionar todos
    const [selectedRows, setSelectedRows] = useState([]);

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const allRows = Array.from({ length: dataDocentes.length }, (_, index) => index);
            setSelectedRows(allRows);
        } else {
            setSelectedRows([]);
        }
    };


    async function downloadDocentes() {
        fetch(`${variableExcel}`, {
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
                link.setAttribute('download', 'ActivitiesPlan.xlsx');
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

    console.log(selectedRows);
    async function downloadExcelDocentesSeleccionados() {
        if (selectedRows.length === 0) {
            Swal.fire({
                title: 'Error',
                text: 'Debe seleccionar docentes para generar el Excel',
                icon: 'error',
            });
        } else {
            fetch(`${variableExcelDocentes}`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(selectedRows),
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
                    link.setAttribute('download', 'RegistroDocentes.xlsx');
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
    }



    const options = {
        responsive: "standard",
        selectableRows: "none",
        pagination: true,
        customToolbar: () => {
            return (
                <div>
                    <IconButton title="Aprobar todos los planes" onClick={handleShow}>
                        <AddTaskIcon />
                    </IconButton>
                    <IconButton title="Descargar docentes que constan con un plan" onClick={downloadDocentes}>
                        <SimCardDownloadIcon />
                    </IconButton>
                    <IconButton title="Descargar Excel de Docentes Seleccionados" onClick={downloadExcelDocentesSeleccionados}>
                        <DownloadForOfflineIcon />
                    </IconButton>
                </div>
            );
        },
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
                text: "",
                delete: "",
            },
        },
    };

    const titleStyles = {
        color: '#0076bd', // Cambia el color del título a azul
        fontSize: '1.5em', // Cambia el tamaño de fuente del título

    };

    return (
        <div>
            <Navigation />
            <div className="d-flex flex-column justify-content-center align-items-center py-4 ">
                <h3>Revisar / Validar</h3>
            </div>
            <MUIDataTable
                title={<h3 style={titleStyles}>Listado de docentes con plan registrado en el periodo</h3>}
                data={transformedData}
                columns={columns}
                options={options}
            />

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmación</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <div className="form-group m-2">
                        <p>Ten en cuenta que al aceptar, todos los planes serán aprobados</p>
                        <p>Presiona aceptar para continuar.</p>

                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
                    <Button variant="primary" onClick={handleAprobarPlanes} >Aceptar</Button>
                </Modal.Footer>

            </Modal>
        </div>
    )
}

export default RevisarValidar
