import Table from "react-bootstrap/Table";
import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Form } from "react-router-dom";
import Navigation from "./Navigation";
import { useNavigate, redirect } from "react-router-dom";
import { eliminarActividad } from "../api/actividades";
import MUIDataTable from 'mui-datatables';
import Swal from "sweetalert2";


const variableObtenerActividades =
  "https://accrualback.up.railway.app/activityPlanAccrual/byPlan";

const variableNoEditable =
  "https://accrualback.up.railway.app/plan/updatePlanNotEditable";

export async function action({ params }) {
  await eliminarActividad(params.actividadId);

  return redirect("/#/mostrarActividades");
}

function MostrarActividades() {
  const period = localStorage.getItem("periodosAbiertos");

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

  //Obtenemos el idPersona con estado
  const [idPersona, setIdPersona] = useState(sessionStorage.getItem("idPersona"));
  useEffect(() => {
    const handleStorageChange = () => {
      setIdPersona(sessionStorage.getItem("idPersona"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  //Obtenemos el idPlan con estado
  const [idPlan, setIdPlan] = useState(sessionStorage.getItem("idPlan"));
  useEffect(() => {
    const handleStorageChange = () => {
      setIdPlan(sessionStorage.getItem("idPlan"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const idPeriodo= localStorage.getItem("idPeriodo");

  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [dataActividad, setDataActividad] = useState([]);

  // Consultas para datos de la actividad de devengamiento
  const useLoaderData1 = () => {
    const loader1 = async () => {
      try {
        const response1 = await fetch(
          `${variableObtenerActividades}/${idPersona},${idPeriodo}`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const dataActividades = await response1.json();
        setDataActividad(dataActividades);
      } catch (error) {
        console.log(error);
      }
    };
    useEffect(() => {
      loader1();
    }, []);
    return dataActividad;
  };

  // Obtener datos del editar actividad
  const datosActividadPlan = useLoaderData1();

  //Enviar actividades
  async function handleEnviar() {
    try {
      const respuesta = await fetch(
        `${variableNoEditable}/${idPersona},${period}`,
        {
          method: "PATCH",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify("Se va"),
        }
      );
      if (respuesta.ok) {
        await Swal.fire({
          title: "Enviado",
          text: "Actividades enviadas, recuerde ya no puede agregar ni editar más actividades",
          icon: "success",

          confirmButtonColor: "#3085d6",
        });
        window.location.href = "/#/mostrarActividades";
      } else {
        await Swal.fire({
          title: "Error",
          text: "Ocurrió un error al enviar el formulario",
          icon: "error",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.log(error);
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
      name: "Tipo de Actividad",
      options: {
        customHeadRender: (columnMeta) => {
          return (
            <th className="header-datatable">{columnMeta.label}</th>
          );
        },
      },
    },
    {
      name: "Fecha de inicio",
      options: {
        customHeadRender: (columnMeta) => {
          return (
            <th className="header-datatable">{columnMeta.label}</th>
          );
        },
      },
    },
    {
      name: "Fecha de finalización",
      options: {
        customHeadRender: (columnMeta) => {
          return (
            <th className="header-datatable">{columnMeta.label}</th>
          );
        },
      },
    },
    {
      name: "Detalle de la actividad",
      options: {
        setCellProps: () => ({
          style: {
            maxWidth: "380px",
            whiteSpace: "normal",
            wordWrap: "break-word",
          }
        }),
        customHeadRender: (columnMeta) => {
          return (
            <th className="header-datatable">{columnMeta.label}</th>
          );
        },
      },
    },
    {
      name: "Enlace de evidencia",
      options: {
        setCellProps: () => ({
          style: {
            maxWidth: "280px",
            whiteSpace: "normal",
            wordWrap: "break-word",
          }
        }),
        customHeadRender: (columnMeta) => {
          return (
            <th className="header-datatable">{columnMeta.label}</th>
          );
        },
      },
    },
    {
      name: "Lugar de la actividad",
      options: {
        customHeadRender: (columnMeta) => {
          return (
            <th className="header-datatable">{columnMeta.label}</th>
          );
        },
      },
    },
    {
      name: " ",
      options: {
        customHeadRender: (columnMeta) => {
          return (
            <th className="header-datatable">{columnMeta.label}</th>
          );
        },
        customBodyRender: (value, tableMeta, updateValue) => {
          const rowIndex = tableMeta.rowIndex;
          const actividad = datosActividadPlan[rowIndex];
          const idActividad = actividad.activityPlan.activity.idActivity;
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

              await eliminarActividad(idActividad, token);
            }
          };
          return (
            <div>
              <div class="d-grid gap-2 d-sm-block">
                <Button variant="primary" className=" mx-1 btn-block" onClick={() =>
                  navigate(
                    `/actividades/${idActividad}/editar`
                  )
                } >
                  Editar
                </Button>
                <Button variant="danger" className="mx-1 btn-block my-2" onClick={handleEliminar}>
                  Eliminar
                </Button>
              </div>
            </div>
          );
        },
      },
    }
  ];
 console.log(datosActividadPlan);
  //Datos para el dataTable
  const transformedData = datosActividadPlan.map((actividades, index) => {
    return [
      index + 1, // Columna #
      actividades.activityPlan.type.nameActivityType,
      actividades.activityPlan.activity.startDate[0] + "/" + actividades.activityPlan.activity.startDate[1] + "/"
      + actividades.activityPlan.activity.startDate[2],
      actividades.activityPlan.activity.endDate[0] + "/" + actividades.activityPlan.activity.endDate[1] + "/"
      + actividades.activityPlan.activity.endDate[2],
      actividades.activityPlan.activity.description,
      actividades.activityPlan.activity.evidences,
      actividades.institutionPlan.institution.institutionName
    ];
  });

  const options = {
  
    responsive: "standard",
    selectableRows: "none",
    pagination: true,
    sort: false,
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


  return (
    <div>
      <Navigation />
      <div className="p-3 m-3">
        <h3 className="p-2">Actividades del periodo {period}</h3>
        <MUIDataTable
          data={transformedData}
          columns={columns}
          options={options}
        />
        <div>
          <div className="text-center py-2">
            <Button variant="primary" onClick={handleShow}>
              Enviar
            </Button>
          </div>

          <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Revisión</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Al momento de confirmar el envío, las actividades ingresadas serán
              enviadas a revisión. Tenga en cuenta que cuando se envían las
              actividades ya no podrá agregar más ni editarlas.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleEnviar}>
                Confirmar
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default MostrarActividades;
