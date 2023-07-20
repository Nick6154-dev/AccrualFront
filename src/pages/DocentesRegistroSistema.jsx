import Navigation from "../components/Navigation"
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Swal from "sweetalert2";
import MUIDataTable from 'mui-datatables';
import { IconButton } from '@mui/material';
import { aprobarDocente } from "../api/solicitudRegistroDocente";
import { denegarDocente } from "../api/solicitudRegistroDocente";
import { aprobarTodos } from "../api/solicitudRegistroDocente";
import AddTaskIcon from '@mui/icons-material/AddTask';

const variableObtenerDocentesRegistro = "https://accrualback.up.railway.app/register/listDocentsWithOutUser";

function DocentesRegistroSistema() {

  //Obtener los valores de la consula de los docentes
  const [dataDocentes, setDataDocentes] = useState([]);
  const token = sessionStorage.getItem("token");

  //Consulta a docentes que han enviado una solicitud
  useEffect(() => {
    const peticion = async () => {
      try {
        const response = await fetch(`${variableObtenerDocentesRegistro}`, {
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

  console.log(dataDocentes);

  //Aprobar todos los docentes
  const handleAprobarTodos = async () => {
    const result = await Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción aprobará a todos los docentes',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aprobar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {

      await aprobarTodos(token);
    }
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
      name: "Correo",
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
          const idDocente = docente.idPerson;

          const handleAprobar = async () => {
            const result = await Swal.fire({
              title: '¿Está seguro?',
              text: 'Esta acción aprobará al docente',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Aprobar',
              cancelButtonText: 'Cancelar',
            });

            if (result.isConfirmed) {

              await aprobarDocente( idDocente, token);
            }
          };
          const handleDenegar = async () => {
            const result = await Swal.fire({
              title: '¿Está seguro?',
              text: 'Esta acción denegará al docente de forma permanente',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Denegar',
              cancelButtonText: 'Cancelar',
            });

            if (result.isConfirmed) {

              await denegarDocente( idDocente, token);
            }
          };
        
          return (
            <div>
              <Button variant="success" className=" mx-1 btn-block" onClick={handleAprobar}>
                Aprobar
              </Button>
              <Button variant="danger" className="mx-1 btn-block my-2" onClick={handleDenegar}>
                Denegar
              </Button>
            </div>
          );
        },
      },
    },
  ];

  // Transformar los datos para que coincidan con las columnas del DataTable
  const transformedData = dataDocentes.map((docente, index) => {
    return [

      index + 1, // Columna #
      docente.identification, // Columna Cédula
      docente.name, // Columna Nombres
      docente.lastname, // Columna Apellidos
      docente.email, // Columna Email
      ,
    ];
  });

  const options = {
    responsive: "standard",
    selectableRows: "none",
    pagination: true,
    customToolbar: () => {
      return (
        <div>
          <IconButton title="Aprobar todos los Docentes" onClick={handleAprobarTodos} >
            <AddTaskIcon />
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
      < Navigation />
      <div className="d-flex flex-column justify-content-center align-items-center py-4 ">
        <h3>Solicitud de Registro al Sistema</h3>
      </div>
      <MUIDataTable
        title={<h3 style={titleStyles}>Docentes que han enviado una solicitud de Registro al Sistema</h3>}
        data={transformedData}
        columns={columns}
        options={options}
      />
    </div>
  )
}

export default DocentesRegistroSistema
