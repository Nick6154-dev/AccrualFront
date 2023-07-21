import MUIDataTable from 'mui-datatables';
import { useState, useEffect } from 'react';
import Navigation from './Navigation';
import Checkbox from '@mui/material/Checkbox';
import { Button } from 'react-bootstrap';

const variableObtenerDocentes = "https://accrualback.up.railway.app/validator/findAllDocentPersonPlans";

function CambiarModo() {

    //Obtener los valores de la consula de los docentes
    const [dataDocentes, setDataDocentes] = useState([]);

    const token = sessionStorage.getItem("token");

    
    const [show4, setShow4] = useState(false);
    const handleClose4 = () => setShow4(false);


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
                downloadCsv: "",
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
           
           <Modal show={show4} onHide={handleClose4} fullscreen={"xxl-down"}>
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
                            <div className='p-3 text-center'>
                                <Button variant="primary">Cambiar Modo</Button>
                            </div>
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose4}>Cerrar</Button>
                        <Button variant="primary" >Establer Etapa Completa</Button>
                    </Modal.Footer>
                </Modal>
        </div>
    )
}

export default CambiarModo
