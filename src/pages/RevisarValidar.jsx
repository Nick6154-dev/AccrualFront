import MUIDataTable from 'mui-datatables';
import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';


const variableObtenerDocentes = "https://accrual.up.railway.app/validator/findAllDocentPersonPlans";

function RevisarValidar() {

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


    // Definimos las columnas
    const columns = [
        { name: "#" },
        { name: "Cédula" },
        { name: "Nombres" },
        { name: "Apellidos" },
        { name: "Facultad" },
        {
            name: "Acción",
            options: {
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
            index + 1, // Columna #
            docente.person.identification, // Columna Cédula
            docente.person.name, // Columna Nombres
            docente.person.lastname, // Columna Apellidos
            docente.docent.faculty, // Columna Facultad
            "",
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
        </div>
    )
}

export default RevisarValidar
