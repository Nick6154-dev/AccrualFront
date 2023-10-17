import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Form } from "react-router-dom";
import Navigation from "./Navigation";
import { useNavigate, redirect } from "react-router-dom";
import { eliminarActividad } from "../api/actividades";
import { obtenerActividadesAPI } from "../api/mostrarActividades";
import MUIDataTable from 'mui-datatables';
import Swal from "sweetalert2";



const variableNoEditable = "https://accrualback.up.railway.app/plan/updatePlanNotEditable";

const variableEnviarEvidencias = "https://accrualback.up.railway.app/activityPlanAccrual/validateActivity";

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



  const handleGoBack = () => {
    navigate(-1); // Navegar hacia atrás en el historial
  };

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

  const idPeriodo = localStorage.getItem("idPeriodo");

  const periodosCompletos = localStorage.getItem("periodosCompletos");

  const [datosActividadPlan, setDatosActividadPlan] = useState([]);

  const [opcionPeriodos, setOpcionPeriodos] = useState();
  const periodos = JSON.parse(periodosCompletos)
  const [selectedState, setSelectedState] = useState();
  const modoPeriodoString = localStorage.getItem("modoPeriodo")
  const modoPeriodo = modoPeriodoString.split(',').map(item => Number(item.trim()));

  useEffect(() => {
    if (periodos.length === 1) {
      setSelectedState(modoPeriodo[0].toString())
    }

  }, []);

  //Select
  const opcionesPeriodos = periodos.map((periodo) => ({
    value: periodo.idPeriod,
    label: periodo.valuePeriod,
    state: periodo.state,
  }
  ));

  const seleccionPeriodo = (event) => {
    setOpcionPeriodos(event.target.value);

    const selectedStateValue = event.target.options[event.target.selectedIndex].dataset.state;
    setSelectedState(selectedStateValue);

  };

  //Enviar el periodo Actual al LocalStorage
  localStorage.setItem("idPeriodoActual", opcionPeriodos);
  //Enviar el modo del periodo actual al localStorage
  localStorage.setItem("modoPeriodoActual", selectedState);
  // Modal1 
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //Modal 2
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  const [dataActividad, setDataActividad] = useState([]);
  const [existeOtraInstitucion, setExisteOtraInstitucion] = useState("");
  const [idActividadPlan, setIdActividadPlan] = useState();

  //Para enlaces de evidencias
  const [valorEnlaceEvidencia, setValorEnlaceEvidencia] = useState("");
  const [valorEnlaceVerificacion, setValorEnlaceVerificacion] = useState("");


  //Validar Editar

  function handleChange(event) {
    setValorEnlaceEvidencia(event.target.value);
  }

  function handleChange2(event) {
    setValorEnlaceVerificacion(event.target.value);

  }

  useEffect(() => {
    if (periodos.length === 1) {
      const respuesta = obtenerActividadesAPI(token, idPersona, idPeriodo);
      respuesta.then(respuesta => {
        const resultado = respuesta; // Aquí obtienes el PromiseResult
        setDatosActividadPlan(resultado);
        const error = Object.values(resultado);
      }).catch(error => {
        console.error('Error al obtener el resultado de la promesa:', error);
      });
    }

  }, []);


  useEffect(() => {
    if (opcionPeriodos) {
      const respuestaPromise = obtenerActividadesAPI(token, idPersona, opcionPeriodos);
      respuestaPromise.then(respuesta => {
        const resultado = respuesta;
        setDatosActividadPlan(resultado);
        const error = Object.values(resultado);
      }).catch(error => {
        console.error('Error al obtener el resultado de la promesa:', error);
      });
    }
  }, [opcionPeriodos]);

  useEffect(() => {
    if (periodos.length === 1) {
      setOpcionPeriodos(idPeriodo);
    }

  }, []);

  //Enviar actividades
  async function handleEnviar() {
    try {
      const respuesta = await fetch(
        `${variableNoEditable}/${idPersona},${opcionPeriodos}`,
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
        setShow(false)
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

  //creando objeto para enviar
  const datosEvidencias = {
    "evidences": valorEnlaceEvidencia,
    "verificationLink": valorEnlaceVerificacion
  }
  //Enviar Evidencias

  const handleEnviarEvidencias = async (event) => {
    event.preventDefault();
    try {
      const respuesta = await fetch(
        `${variableEnviarEvidencias}/${idActividadPlan}`,
        {
          method: "PATCH",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(datosEvidencias),
        }
      );
      if (respuesta.ok) {
        setValorEnlaceEvidencia("");
        setValorEnlaceVerificacion("");
        setShow2(false)
        await Swal.fire({
          title: "Enviado",
          text: "Evidencias enviadas",
          icon: "success",
          confirmButtonColor: "#3085d6",

        });

        // Actualizar la tabla en tiempo real
        obtenerActividadesAPI(token, idPersona, opcionPeriodos)
          .then((respuesta) => {
            const resultado = respuesta;
            setDatosActividadPlan(resultado);
          })
          .catch((error) => {
            console.error("Error al obtener el resultado de la promesa:", error);
          });

      } else {
        Swal.fire({
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
              <div className="d-grid gap-2 d-sm-block">
                <Button variant="primary" className=" mx-1 btn-block" onClick={() => {

                  navigate(`/actividades/${idActividad}/editar`);
                }}>
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
  if (selectedState === "3") {
    columns.pop();
    // Agregar la columna "Agregar Evidencias" al arreglo columns
    columns.push({
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


          const handleAgregarEvidencias = () => {
            const institutionName = actividad.institutionPlan.institution.institutionName;
            setExisteOtraInstitucion(institutionName);

            setIdActividadPlan(actividad.activityPlan.activity.idActivity);
            handleShow2(institutionName);
          };
          return (
            <div>
              <Button variant="success" className="mx-1 btn-block my-2" onClick={handleAgregarEvidencias}>
                Agregar Evidencias
              </Button>
            </div>
          );
        },
      },
    });
  }

  console.log(datosActividadPlan);
  const transformedData = (Array.isArray(datosActividadPlan) && idPeriodo !== null)
    ? datosActividadPlan.map((actividades, index) => {
      const nameActivityType = actividades.activityPlan.type.nameActivityType || ''; // Validar nameActivityType
      const startDate = actividades.activityPlan.activity.startDate || [];
      const endDate = actividades.activityPlan.activity.endDate || [];
      const description = actividades.activityPlan.activity.description || '';
      const evidences = actividades.activityPlan.activity.evidences || '';
      const institutionName = actividades.institutionPlan.institution.institutionName || '';

      return [
        index + 1, // Columna #
        nameActivityType,
        (startDate[0] && startDate[1] && startDate[2]) ? startDate[0] + "/" + startDate[1] + "/" + startDate[2] : 'No existen datos', // Validar fecha de inicio
        (endDate[0] && endDate[1] && endDate[2]) ? endDate[0] + "/" + endDate[1] + "/" + endDate[2] : 'No existen datos', // Validar fecha de fin
        description,
        evidences,
        institutionName
      ];
    })
    : [];
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
      {periodos.length === 1 ? (
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

            <Modal show={show2} onHide={handleClose2}>
              <Modal.Header closeButton>
                <Modal.Title>Evidencias</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <div>
                  <form onSubmit={handleEnviarEvidencias}>
                    <div className="form-group  d-flex flex-column justify-content-center align-items-center py-1">
                      <label
                        className="p-1 col-form-label"
                        htmlFor="evidencies"
                      >
                        Enlace de evidencia de la actividad realizada:
                      </label>
                      <div className="p-1 col-sm-7">
                        <input
                          type="url"
                          required={true}
                          id="evidencies"
                          name="evidencies"
                          className="form-control"
                          placeholder="http://google.com"
                          onChange={handleChange}
                          value={valorEnlaceEvidencia}
                        />
                      </div>
                    </div>
                    {existeOtraInstitucion !== "Universidad Central del Ecuador" ? (

                      <div className="form-group  d-flex flex-column justify-content-center align-items-center py-3">
                        <label
                          className="p-1 col-form-label"
                          htmlFor="verificationLink"
                        >
                          Enlace de verificación
                        </label>
                        <div className="col-sm-7">
                          <input
                            type="url"
                            required={true}
                            id="verificationLink"
                            name="verificationLink"
                            className="form-control"
                            placeholder="http://google.com"
                            onChange={handleChange2}
                            value={valorEnlaceVerificacion}
                          />
                        </div>
                      </div>
                    ) : ("")}
                    <div className="text-center py-3">
                      <Button type="submit" variant="primary" >Enviar Evidencias</Button>
                    </div>
                  </form>
                </div>

              </Modal.Body>

            </Modal>
          </div>
        </div>
      ) : periodos.length > 1 ? (
        <div>
          <div className="d-flex flex-column justify-content-center align-items-center py-2">
            <div className="card-header">
              <h3>Elija el periodo a Visualizar</h3>
            </div>
            <div className="p-2 col-sm-3">
              <select value={opcionPeriodos} onChange={seleccionPeriodo} className="form-control">
                <option className="text-center" value="">***Seleccione***</option>
                {opcionesPeriodos.map((opcion) => (
                  <option className="text-center" key={opcion.value} value={opcion.value} data-state={opcion.state}>
                    {opcion.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {opcionPeriodos && (
            <div className="p-2">
              <h3 className="p-2">Actividades del periodo</h3>
              <MUIDataTable
                data={transformedData}
                columns={columns}
                options={options}
              />
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

              <Modal show={show2} onHide={handleClose2}>
                <Modal.Header closeButton>
                  <Modal.Title>Evidencias</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div>
                    <form onSubmit={handleEnviarEvidencias}>
                      <div className="form-group  d-flex flex-column justify-content-center align-items-center py-1">
                        <label
                          className="p-1 col-form-label"
                          htmlFor="evidencies"
                        >
                          Enlace de evidencia de la actividad realizada:
                        </label>
                        <div className="p-1 col-sm-7">
                          <input
                            type="url"
                            required={true}
                            id="evidencies"
                            name="evidencies"
                            className="form-control"
                            placeholder="http://google.com"
                            onChange={handleChange}
                            value={valorEnlaceEvidencia}
                          />
                        </div>
                      </div>
                      {existeOtraInstitucion !== "Universidad Central del Ecuador" ? (

                        <div className="form-group  d-flex flex-column justify-content-center align-items-center py-3">
                          <label
                            className="p-1 col-form-label"
                            htmlFor="verificationLink"
                          >
                            Enlace de verificación
                          </label>
                          <div className="col-sm-7">
                            <input
                              type="url"
                              required={true}
                              id="verificationLink"
                              name="verificationLink"
                              className="form-control"
                              placeholder="http://google.com"
                              onChange={handleChange2}
                              value={valorEnlaceVerificacion}
                            />
                          </div>
                        </div>
                      ) : ("")}
                      <div className="text-center py-3">
                        <Button type="submit" variant="primary" >Enviar Evidencias</Button>
                      </div>
                    </form>
                  </div>

                </Modal.Body>

              </Modal>
            </div>
          )}
        </div>
      ) :
        <div>
          <div className="alert alert-danger m-4 text-center" role="alert">
            <h4> No existe un periodo activo</h4>
          </div>
          <div className="text-center">
            <button className="btn btn-primary" onClick={handleGoBack}>
              Volver atrás
            </button>
          </div>
        </div>
      }

    </div >
  );
}

export default MostrarActividades;