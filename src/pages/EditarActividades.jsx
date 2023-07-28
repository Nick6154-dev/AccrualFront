import { obtenerActividades } from "../api/actividades";
import { Form, useLoaderData } from "react-router-dom";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import Navigation from "../components/Navigation";

const variableEdit = "https://accrualback.up.railway.app/activityPlanAccrual";

const variableTipoActividad = "https://accrualback.up.railway.app/type";
const variableFacultad = "https://accrualback.up.railway.app/faculty/byIdUniversity";
const variableCarrera = "https://accrualback.up.railway.app/career/byIdFaculty";
const variableSubTipo = "https://accrualback.up.railway.app/subtype/byIdType";


const token = sessionStorage.getItem("token");

export async function loader({ params }) {

  const actividades = await obtenerActividades(params.actividadId);

  if (Object.values(actividades).length === 0) {
    throw new Response("", {
      status: 404,
      statusText: "No hay resultados",
    });
  }

  return actividades;
}

function EditarActividades() {

  const params = useParams();

  const actividad = useLoaderData();

  //Obtenemos el Token con estado
  const token = sessionStorage.getItem("token");
  const idPeriodo = localStorage.getItem("idPeriodoActual");
  const idPersona = sessionStorage.getItem("idPersona");
  const modoPeriodoActual = localStorage.getItem("modoPeriodoActual");

  const [estadoModal1, cambiarEstadoModal1] = useState(false);
  const [estadoModal2, cambiarEstadoModal2] = useState(false);
  const [estadoModal3, cambiarEstadoModal3] = useState(false);
  const [estadoModal4, cambiarEstadoModal4] = useState(false);
  const [estadoModal5, cambiarEstadoModal5] = useState(false);
  const [estadoModal6, cambiarEstadoModal6] = useState(false);
  const [valorSelectModal, setValorSelectModal] = useState(actividad?.subtype.idActivitySubtype || "");
  const [valorSelectUniversidad, setvalorSelectUniversidad] = useState("");
  const [valorSelectFacultad, setvalorSelectFacultad] = useState(1);
  const [valorSelectCarrera, setvalorSelectCarrera] = useState("");
  const [data, setData] = useState([]);
  const [dataFacultades, setDataFacultades] = useState([]);
  const [subActividades, setSubActividades] = useState([]);
  const [tipoActividad, setTipoActividad] = useState([]);
  const [selectedOption, setselectedOption] = useState("");
  const [valorActividades, setValorActividades] = useState(actividad?.type.idActivityType || 1);
  const [valorOtraInstitucion, setvalorOtraInstitucion] = useState("");

  const [valorEnlaceVerificacion, setValorEnlaceVerificacion] = useState("");
 
  //Transformar fechas
  const formatStartDate = (startDateArray) => {
    // startDateArray es un arreglo con la fecha [año, mes, día]
    const [year, month, day] = startDateArray;
    // Agregar ceros a la izquierda si es necesario para tener dos dígitos
    const formattedMonth = String(month).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    // Retornar la fecha formateada en el formato "YYYY-MM-DD"
    return `${year}-${formattedMonth}-${formattedDay}`;
  };

//Fecha Inicio
  const valorDefectoFechaInicial = formatStartDate(actividad.activity.startDate);
  const [valorFechaInicio, setValorFechaInicio] = useState(valorDefectoFechaInicial);
  function cambioFechaInicio(event) {
    setValorFechaInicio(event.target.value);
  }

//Fecha finalizacion
  const valorDefectoFechaFinalizacion = formatStartDate(actividad.activity.endDate);
  const [valorFechaFinalizacion, setValorFechaFinalizacion] = useState(valorDefectoFechaFinalizacion);
    function cambioFechaFinalizacion(event) {
    setValorFechaFinalizacion(event.target.value);
  }

  const handleChangeSelectTipoActividad = (event) => {
    setValorActividades(event.target.value);
    cambiarModal(); // Aquí puedes llamar a la función cambiarModal si es necesario
  };


  function handleChange(event) {
    setValorSelectModal(event.target.value);

    setselectedOption(event.target.value);
  }
  function handleChange2(event) {
    setvalorOtraInstitucion(event.target.value);
  }

  const valorDefectoDescripcion = actividad.activity.description;
  const [valorDetalleActividadDocente, setvalorDetalleActividadDocente] =
    useState( valorDefectoDescripcion || '');
  function handleChange3(event) {
    setvalorDetalleActividadDocente(event.target.value);
  }
  function handleChangeDetalleFormulario(event) {
    setValorDetalleFormulario(event.target.value);
  }
  function handleChange4(event) {
    setValorEnlaceVerificacion(event.target.value);
  }

  function handleChange5(event) {
    setvalorSelectUniversidad(event.target.value);
    setvalorSelectFacultad(event.target.value);
    setvalorSelectCarrera(event.target.value);
  }

  let idActividad = valorActividades;
  localStorage.setItem("idActividad", idActividad);
  useEffect(() => {
    const peticion = async () => {
      let idActividad = localStorage.getItem("idActividad");
      let idFacultad = localStorage.getItem("idFacultad");
      try {
        const response = await fetch(`${variableFacultad}/1`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data1 = await response.json();
        setDataFacultades(data1);

        const response3 = await fetch(`${variableCarrera}/${idFacultad}`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data3 = await response3.json();
        setData(data3);
        setselectedOption(data3[0].value);

        const response2 = await fetch(`${variableSubTipo}/${idActividad}`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data2 = await response2.json();

        setSubActividades(data2);

        const response7 = await fetch(`${variableTipoActividad}`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data7 = await response7.json();
        setTipoActividad(data7);
      } catch (error) {
        console.log(error);
      }
    };
    peticion();
    const intervalId = setInterval(peticion, 1000);
    return () => clearInterval(intervalId);
  }, []);

  let idFacultad = valorSelectFacultad;
  localStorage.setItem("idFacultad", idFacultad);


  function cambiarModal() {
    const valueSelect = document.getElementById("select").value;

    const select = document.getElementById("select");
    if (valueSelect === "1") {
      select.setAttribute("onChange", cambiarEstadoModal1(!estadoModal1));
    }
    if (valueSelect === "2") {
      select.setAttribute("onChange", cambiarEstadoModal2(!estadoModal2));
    }
    if (valueSelect === "3") {
      select.setAttribute("onChange", cambiarEstadoModal3(!estadoModal3));
    }
    if (valueSelect === "4") {
      select.setAttribute("onChange", cambiarEstadoModal4(!estadoModal4));
    }
  }
  function cambiarModalInstitucion() {
    const valueSelectInstitucion = document.getElementById(
      "select-tipoInstitucion"
    ).value;
    const selectInstitucion = document.getElementById("select-tipoInstitucion");

    if (valueSelectInstitucion === "0") {
      selectInstitucion.setAttribute(
        "onChange",
        cambiarEstadoModal5(!estadoModal5)
      );
      setvalorOtraInstitucion("");
      setValorEnlaceVerificacion("");
    }
    if (valueSelectInstitucion === "1") {
      selectInstitucion.setAttribute(
        "onChange",
        cambiarEstadoModal6(!estadoModal6)
      );
      setvalorSelectFacultad(1);
      setvalorSelectUniversidad("");
      setvalorSelectCarrera("");
      localStorage.removeItem("universidad");
    }
  }

  const valorDefectoEnlace = actividad.activity.evidences;
  const [valorEnlaceEvidencia, setValorEnlaceEvidencia] = useState(valorDefectoEnlace);
  function cambioEnlaceEvidencia(event) {
    setValorEnlaceEvidencia(event.target.value);
  }

  //Crear un objeto de datos
  const datos = {
    "descriptionActivity": valorDetalleActividadDocente,
    "startDate": valorFechaInicio,
    "endDate": valorFechaFinalizacion,
    "evidences": valorEnlaceEvidencia,
    "idActivityType": valorActividades
  }


  datos.idActivitySubtype = valorSelectModal;
  datos.idPeriod = idPeriodo;
  datos.idPerson = idPersona;

  if (valorDetalleActividadDocente !== "") {
    datos.descriptionSubtype = valorDetalleActividadDocente;
  }

  if (valorOtraInstitucion === "") {
    datos.idCareer = valorSelectCarrera;
    datos.idFaculty = valorSelectFacultad;
    datos.idUniversity = 1;
    datos.institutionName = "Universidad Central del Ecuador";
  }
  if (modoPeriodoActual === "1") {
    if (valorSelectCarrera === "") {
      datos.otherInstitutionName = valorOtraInstitucion;
      datos.verificationLink = valorEnlaceVerificacion;
      datos.institutionName = valorOtraInstitucion;

    } else if (valorEnlaceVerificacion == "" && valorOtraInstitucion === "") {
      datos.idCareer = valorSelectCarrera;
      datos.idFaculty = valorSelectFacultad;
      datos.idUniversity = 1;
      datos.institutionName = "Universidad Central del Ecuador";
    }
  } else if (modoPeriodoActual === "2") {
    if (valorSelectCarrera === "") {
      datos.otherInstitutionName = valorOtraInstitucion;
      datos.institutionName = valorOtraInstitucion;

    }
  }
  const handleSubmit = async () => {

    //Actualizar Actividad
    try {
      const respuesta = await fetch(`${variableEdit}/${params.actividadId}`, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datos),

      });
      const respuestaActualizar = await respuesta.json();
      const error = Object.values(respuestaActualizar);
      if (respuesta.ok) {
        await Swal.fire({
          title: "Actualizado",
          text: "La actividad se ha actualizado, si requiere enviarlo, diríjase a 'Ver' ",
          icon: "success",

          confirmButtonColor: "#3085d6",

        });
        window.location.href = "/#/mostrarActividades";
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
        text: "Ocurrió un error al guardar el formulario",
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
      {modoPeriodoActual === "1" ? (
        <Form onSubmit={handleSubmit} >
          <div className="container py-3  text-center ">
            <div className="card-header">
              <h3>Ingreso de datos de la Actividad (Etapa Completa)</h3>
            </div>

            <div className="card-body">
              <div>
                <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                  <label className="p-2 col-form-label" htmlFor="tipoActividad">
                    Elija el tipo de actividad
                  </label>
                  <div className="p-2 col-sm-3">
                    <select
                      onChange={handleChangeSelectTipoActividad}
                      id="select"
                      className="form-control"
                      required={true}
                      name="idActivityType"
                      value={valorActividades}
                    >
                      <option className="text-center">*** Seleccione ***</option>
                      {tipoActividad.map((object) => (
                        <option
                          key={object.idActivityType}
                          value={object.idActivityType}

                        >
                          {object.nameActivityType}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                  <label className="p-2 col-form-label" htmlFor="startDate">
                    Fecha de Inicio
                  </label>
                  <div className="p-2 col-sm-3">
                    <input
                      type="date"
                      required={true}
                      id="startDate"
                      value={valorFechaInicio}
                      onChange={cambioFechaInicio}
                      className="form-control"
                      defaultValue={valorDefectoFechaInicial}
                    />
                  </div>
                </div>

                <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                  <label className="p-2 col-form-label" htmlFor="endDate">
                    Fecha de Finalización
                  </label>
                  <div className="p-2 col-sm-3">
                    <input
                      type="date"
                      required={true}
                      id="endDate"
                      value={valorFechaFinalizacion}
                      onChange={cambioFechaFinalizacion}
                      className="form-control"
                      defaultValue={valorDefectoFechaFinalizacion}
                    />
                  </div>
                </div>

                <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                  <label
                    className="p-2 col-form-label"
                    htmlFor="descriptionActivity"
                  >
                    Detalle
                  </label>
                  <div className="p-2 col-sm-3">
                    <input
                      type="text"
                      required={true}
                      id="descriptionActivity"
                      value={valorDetalleActividadDocente}
                      onChange={handleChange3}
                      className="form-control"
                      defaultValue={valorDefectoDescripcion}
                    />
                  </div>
                </div>

                <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                  <label className="p-2 col-form-label" htmlFor="evidences">
                    Enlace de la evidencia
                  </label>
                  <div className="p-2 col-sm-3">
                    <input
                      type="url"
                      required={true}
                      id="evidences"
                      value={valorEnlaceEvidencia}
                      onChange={cambioEnlaceEvidencia}
                      className="form-control"
                      defaultValue={valorDefectoEnlace}
                    />
                  </div>
                </div>

                <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                  <label className="p-2 col-form-label" htmlFor="tipoInstitucion">
                    Elija la institución donde va a realizar la actividad
                  </label>
                  <div className="p-2 col-sm-3">
                    <select
                      id="select-tipoInstitucion"
                      required={true}
                      onChange={() => {
                        cambiarModalInstitucion();
                      }}
                      className="form-control"
                    >
                      <option className="text-center"> ** Seleccione **</option>
                      <option className="opcion" value="0">
                        Universidad
                      </option>
                      <option className="opcion" value="1">
                        Otra Institucion
                      </option>
                    </select>
                  </div>
                </div>

                <Modal
                  show={estadoModal1}
                  onHide={() => cambiarEstadoModal1(false)}
                  backdrop="static"
                  keyboard={false}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Estructuras I + D</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                      <label
                        className="p-2 col-form-label"
                        htmlFor="tipoInstitucion"
                      >
                        Selecciona una opción
                      </label>
                      <div className="p-2 col-sm-6">
                        <select
                          id="select-actividadID"
                          value={valorSelectModal}
                          onChange={handleChange}
                          className="form-control"
                        >
                          <option className="text-center">
                            {" "}
                            ** Seleccione **{" "}
                          </option>
                          {subActividades.map((object) => (
                            <option
                              key={object.idActivitySubtype}
                              value={object.idActivitySubtype}
                            >
                              {object.nameActivitySubtype}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="primary"
                      onClick={() => cambiarEstadoModal1(false)}
                    >
                      Aceptar
                    </Button>
                  </Modal.Footer>
                </Modal>

                <Modal
                  show={estadoModal3}
                  onHide={() => cambiarEstadoModal3(false)}
                  backdrop="static"
                  keyboard={false}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Actividad Investigadora</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                      <label
                        className="p-2 col-form-label"
                        htmlFor="tipoInstitucion"
                      >
                        Selecciona una opción
                      </label>
                      <div className="p-2 col-sm-6">
                        <select
                          id="select-actividad-investigadora"
                          value={valorSelectModal}
                          onChange={handleChange}
                          className="form-control"
                        >
                          <option> ** Seleccione ** </option>
                          {subActividades.map((object) => (
                            <option
                              key={object.idActivitySubtype}
                              value={object.idActivitySubtype}
                            >
                              {object.nameActivitySubtype}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="primary"
                      onClick={() => cambiarEstadoModal3(false)}
                    >
                      Aceptar
                    </Button>
                  </Modal.Footer>
                </Modal>

                <Modal
                  show={estadoModal2}
                  onHide={() => cambiarEstadoModal2(false)}
                  backdrop="static"
                  keyboard={false}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Actividad Docente</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                      <label
                        className="p-2 col-form-label"
                        htmlFor="select-actividad-docente"
                      >
                        Selecciona una opción
                      </label>
                      <div className="p-2 col-sm-6">
                        <select
                          id="select-actividad-docente"
                          value={valorSelectModal}
                          onChange={handleChange}
                          className="form-control"
                        >
                          <option> ** Seleccione ** </option>
                          {subActividades.map((object) => (
                            <option
                              key={object.idActivitySubtype}
                              value={object.idActivitySubtype}
                            >
                              {object.nameActivitySubtype}
                            </option>
                          ))}
                        </select>
                        <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                          <label
                            className="p-2 col-form-label"
                            htmlFor="valorDetalleActividadDocente"
                          >
                            Detalle de la actividad
                          </label>
                          <div className="p-2 col-sm-12">
                            <input
                              id="valorDetalleActividadDocente"
                              className="form-control"
                              type="text"
                              value={valorDetalleActividadDocente}
                              onChange={handleChange3}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="primary"
                      onClick={() => cambiarEstadoModal2(false)}
                    >
                      Aceptar
                    </Button>
                  </Modal.Footer>
                </Modal>

                <Modal
                  show={estadoModal4}
                  onHide={() => cambiarEstadoModal4(false)}
                  backdrop="static"
                  keyboard={false}
                >
                  <Modal.Header closeButton>
                    <Modal.Title> Actividad Innovación</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                      <label
                        className="p-2 col-form-label"
                        htmlFor="select-actividad-docente"
                      >
                        Selecciona una opción
                      </label>
                      <div className="p-2 col-sm-6">
                        <select
                          id="select-actividad-innovacion"
                          value={valorSelectModal}
                          onChange={handleChange}
                          className="form-control"
                          cursor="pointer"
                        >
                          <option> ** Seleccione ** </option>
                          {subActividades.map((object) => (
                            <option
                              key={object.idActivitySubtype}
                              value={object.idActivitySubtype}
                            >
                              {object.nameActivitySubtype}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="primary"
                      onClick={() => cambiarEstadoModal4(false)}
                    >
                      Aceptar
                    </Button>
                  </Modal.Footer>
                </Modal>

                <Modal
                  show={estadoModal5}
                  onHide={() => cambiarEstadoModal5(false)}
                  backdrop="static"
                  keyboard={false}
                >
                  <Modal.Header closeButton>
                    <Modal.Title> Institución de la Actividad</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                      <label
                        className="p-2 col-form-label"
                        htmlFor="select-actividad-docente"
                      >
                        Selecciona una opción
                      </label>
                      <div className="p-2 col-sm-8">
                        <select
                          id="select-universidad"
                          value={valorSelectUniversidad}
                          onChange={handleChange5}
                          className="form-control"
                        >
                          <option disabled> ** Seleccione ** </option>
                          <option className="text-center" value="1">
                            Universidad Central del Ecuador
                          </option>
                        </select>
                        <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                          <label
                            className="p-2 col-form-label"
                            htmlFor="select-facultad"
                          >
                            Selecciona la Facultad
                          </label>
                          <div className="p-2 col-sm-12">
                            <select
                              id="select-facultad"
                              className="form-control"
                              value={valorSelectFacultad}
                              onChange={(e) =>
                                setvalorSelectFacultad(e.target.value)
                              }
                            >
                              <option> ** Seleccione ** </option>
                              {dataFacultades.map((object) => (
                                <option
                                  key={object.idFaculty}
                                  value={object.idFaculty}
                                >
                                  {object.facultyName}
                                </option>
                              ))}
                            </select>
                            <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                              <label
                                className="p-2 col-form-label"
                                htmlFor="select-carrera"
                              >
                                Selecciona la Carrera
                              </label>
                              <div className="p-2 col-sm-12">
                                <select
                                  id="select-carrera"
                                  className="form-control"
                                  value={valorSelectCarrera}
                                  onChange={(e) =>
                                    setvalorSelectCarrera(e.target.value)
                                  }
                                >
                                  <option> ** Seleccione ** </option>
                                  {data.map((object) => (
                                    <option
                                      key={object.idCareer}
                                      value={object.idCareer}
                                    >
                                      {object.careerName}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="primary"
                      onClick={() => cambiarEstadoModal5(false)}
                    >
                      Aceptar
                    </Button>
                  </Modal.Footer>
                </Modal>

                <Modal
                  show={estadoModal6}
                  onHide={() => cambiarEstadoModal6(false)}
                  backdrop="static"
                  keyboard={false}
                >
                  <Modal.Header closeButton>
                    <Modal.Title> Otra Institución</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                      <label
                        className="p-2 col-form-label"
                        htmlFor="nombreOtraInstitucion"
                      >
                        Nombre de la Institución
                      </label>
                      <div className="p-2 col-sm-6">
                        <input
                          id="nombreOtraInstitucion"
                          className="form-control"
                          type="text"
                          value={valorOtraInstitucion}
                          onChange={handleChange2}
                        />
                      </div>
                    </div>
                    <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                      <label
                        className="p-2 col-form-label"
                        htmlFor="enlaceVerificacion"
                      >
                        Enlace de verificación
                      </label>
                      <div className="p-2 col-sm-6">
                        <input
                          id="enlaceVerificacion"
                          className="form-control"
                          type="url"
                          value={valorEnlaceVerificacion}
                          onChange={handleChange4}
                        />
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="primary"
                      onClick={() => cambiarEstadoModal6(false)}
                    >
                      Aceptar
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>
          <div className="text-center py-3">
            <input
              className="btn btn-primary my-2 "
              type="submit"
              value="Registrar"

            />
          </div>
        </Form>
      ) :
        <Form onSubmit={handleSubmit} >
          <div className="text-center py-3">

            <div className="card-header">
              <h3>Editar Datos</h3>
            </div>

            <div className="card-body">
              <div>
                <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                  <label className="p-2 col-form-label" htmlFor="tipoActividad">
                    Elija el tipo de actividad
                  </label>
                  <div className="p-2 col-sm-3">
                  <select
                      onChange={handleChangeSelectTipoActividad}
                      id="select"
                      className="form-control"
                      required={true}
                      name="idActivityType"
                      value={valorActividades}
                    >
                      <option className="text-center">*** Seleccione ***</option>
                      {tipoActividad.map((object) => (
                        <option
                          key={object.idActivityType}
                          value={object.idActivityType}

                        >
                          {object.nameActivityType}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                  <label className="p-2 col-form-label" htmlFor="startDate">
                    Fecha de Inicio
                  </label>
                  <div className="p-2 col-sm-3">
                  <input
                      type="date"
                      required={true}
                      id="startDate"
                      value={valorFechaInicio}
                      onChange={cambioFechaInicio}
                      className="form-control"
                      defaultValue={valorDefectoFechaInicial}
                    />
                  </div>
                </div>

                <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                  <label className="p-2 col-form-label" htmlFor="endDate">
                    Fecha de Finalización
                  </label>
                  <div className="p-2 col-sm-3">
                  <input
                      type="date"
                      required={true}
                      id="endDate"
                      value={valorFechaFinalizacion}
                      onChange={cambioFechaFinalizacion}
                      className="form-control"
                      defaultValue={valorDefectoFechaFinalizacion}
                    />
                  </div>
                </div>

                <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                  <label
                    className="p-2 col-form-label"
                    htmlFor="descriptionActivity"
                  >
                    Detalle
                  </label>
                  <div className="p-2 col-sm-3">
                  <input
                      type="text"
                      required={true}
                      id="descriptionActivity"
                      value={valorDetalleActividadDocente}
                      onChange={handleChange3}
                      className="form-control"
                      defaultValue={valorDefectoDescripcion}
                    />
                  </div>
                </div>

                <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                  <label className="p-2 col-form-label" htmlFor="tipoInstitucion">
                    Elija la institución donde va a realizar la actividad
                  </label>
                  <div className="p-2 col-sm-3">
                    <select
                      id="select-tipoInstitucion"
                      required={true}
                      onChange={() => {
                        cambiarModalInstitucion();
                      }}
                      className="form-control"
                    >
                      <option className="text-center"> ** Seleccione **</option>
                      <option className="opcion" value="0">
                        Universidad
                      </option>
                      <option className="opcion" value="1">
                        Otra Institucion
                      </option>
                    </select>
                  </div>
                </div>

                <Modal
                  show={estadoModal1}
                  onHide={() => cambiarEstadoModal1(false)}
                  backdrop="static"
                  keyboard={false}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Estructuras I + D</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                      <label
                        className="p-2 col-form-label"
                        htmlFor="tipoInstitucion"
                      >
                        Selecciona una opción
                      </label>
                      <div className="p-2 col-sm-6">
                        <select
                          id="select-actividadID"
                          value={valorSelectModal}
                          onChange={handleChange}
                          className="form-control"
                        >
                          <option className="text-center">
                            {" "}
                            ** Seleccione **{" "}
                          </option>
                          {subActividades.map((object) => (
                            <option
                              key={object.idActivitySubtype}
                              value={object.idActivitySubtype}
                            >
                              {object.nameActivitySubtype}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="primary"
                      onClick={() => cambiarEstadoModal1(false)}
                    >
                      Aceptar
                    </Button>
                  </Modal.Footer>
                </Modal>

                <Modal
                  show={estadoModal3}
                  onHide={() => cambiarEstadoModal3(false)}
                  backdrop="static"
                  keyboard={false}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Actividad Investigadora</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                      <label
                        className="p-2 col-form-label"
                        htmlFor="tipoInstitucion"
                      >
                        Selecciona una opción
                      </label>
                      <div className="p-2 col-sm-6">
                        <select
                          id="select-actividad-investigadora"
                          value={valorSelectModal}
                          onChange={handleChange}
                          className="form-control"
                        >
                          <option> ** Seleccione ** </option>
                          {subActividades.map((object) => (
                            <option
                              key={object.idActivitySubtype}
                              value={object.idActivitySubtype}
                            >
                              {object.nameActivitySubtype}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="primary"
                      onClick={() => cambiarEstadoModal3(false)}
                    >
                      Aceptar
                    </Button>
                  </Modal.Footer>
                </Modal>

                <Modal
                  show={estadoModal2}
                  onHide={() => cambiarEstadoModal2(false)}
                  backdrop="static"
                  keyboard={false}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Actividad Docente</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                      <label
                        className="p-2 col-form-label"
                        htmlFor="select-actividad-docente"
                      >
                        Selecciona una opción
                      </label>
                      <div className="p-2 col-sm-6">
                        <select
                          id="select-actividad-docente"
                          value={valorSelectModal}
                          onChange={handleChange}
                          className="form-control"
                        >
                          <option> ** Seleccione ** </option>
                          {subActividades.map((object) => (
                            <option
                              key={object.idActivitySubtype}
                              value={object.idActivitySubtype}
                            >
                              {object.nameActivitySubtype}
                            </option>
                          ))}
                        </select>
                        <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                          <label
                            className="p-2 col-form-label"
                            htmlFor="valorDetalleActividadDocente"
                          >
                            Detalle de la actividad
                          </label>
                          <div className="p-2 col-sm-12">
                            <input
                              id="valorDetalleActividadDocente"
                              className="form-control"
                              type="text"
                              value={valorDetalleActividadDocente}
                              onChange={handleChange3}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="primary"
                      onClick={() => cambiarEstadoModal2(false)}
                    >
                      Aceptar
                    </Button>
                  </Modal.Footer>
                </Modal>

                <Modal
                  show={estadoModal4}
                  onHide={() => cambiarEstadoModal4(false)}
                  backdrop="static"
                  keyboard={false}
                >
                  <Modal.Header closeButton>
                    <Modal.Title> Actividad Innovación</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                      <label
                        className="p-2 col-form-label"
                        htmlFor="select-actividad-docente"
                      >
                        Selecciona una opción
                      </label>
                      <div className="p-2 col-sm-6">
                        <select
                          id="select-actividad-innovacion"
                          value={valorSelectModal}
                          onChange={handleChange}
                          className="form-control"
                          cursor="pointer"
                        >
                          <option> ** Seleccione ** </option>
                          {subActividades.map((object) => (
                            <option
                              key={object.idActivitySubtype}
                              value={object.idActivitySubtype}
                            >
                              {object.nameActivitySubtype}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="primary"
                      onClick={() => cambiarEstadoModal4(false)}
                    >
                      Aceptar
                    </Button>
                  </Modal.Footer>
                </Modal>

                <Modal
                  show={estadoModal5}
                  onHide={() => cambiarEstadoModal5(false)}
                  backdrop="static"
                  keyboard={false}
                >
                  <Modal.Header closeButton>
                    <Modal.Title> Institución de la Actividad</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                      <label
                        className="p-2 col-form-label"
                        htmlFor="select-actividad-docente"
                      >
                        Selecciona una opción
                      </label>
                      <div className="p-2 col-sm-8">
                        <select
                          id="select-universidad"
                          value={valorSelectUniversidad}
                          onChange={handleChange5}
                          className="form-control"
                        >
                          <option disabled> ** Seleccione ** </option>
                          <option className="text-center" value="1">
                            Universidad Central del Ecuador
                          </option>
                        </select>
                        <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                          <label
                            className="p-2 col-form-label"
                            htmlFor="select-facultad"
                          >
                            Selecciona la Facultad
                          </label>
                          <div className="p-2 col-sm-12">
                            <select
                              id="select-facultad"
                              className="form-control"
                              value={valorSelectFacultad}
                              onChange={(e) =>
                                setvalorSelectFacultad(e.target.value)
                              }
                            >
                              <option> ** Seleccione ** </option>
                              {dataFacultades.map((object) => (
                                <option
                                  key={object.idFaculty}
                                  value={object.idFaculty}
                                >
                                  {object.facultyName}
                                </option>
                              ))}
                            </select>
                            <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                              <label
                                className="p-2 col-form-label"
                                htmlFor="select-carrera"
                              >
                                Selecciona la Carrera
                              </label>
                              <div className="p-2 col-sm-12">
                                <select
                                  id="select-carrera"
                                  className="form-control"
                                  value={valorSelectCarrera}
                                  onChange={(e) =>
                                    setvalorSelectCarrera(e.target.value)
                                  }
                                >
                                  <option> ** Seleccione ** </option>
                                  {data.map((object) => (
                                    <option
                                      key={object.idCareer}
                                      value={object.idCareer}
                                    >
                                      {object.careerName}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="primary"
                      onClick={() => cambiarEstadoModal5(false)}
                    >
                      Aceptar
                    </Button>
                  </Modal.Footer>
                </Modal>

                <Modal
                  show={estadoModal6}
                  onHide={() => cambiarEstadoModal6(false)}
                  backdrop="static"
                  keyboard={false}
                >
                  <Modal.Header closeButton>
                    <Modal.Title> Otra Institución</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                      <label
                        className="p-2 col-form-label"
                        htmlFor="nombreOtraInstitucion"
                      >
                        Nombre de la Institución
                      </label>
                      <div className="p-2 col-sm-6">
                        <input
                          id="nombreOtraInstitucion"
                          className="form-control"
                          type="text"
                          placeholder="Otra institución"
                          value={valorOtraInstitucion}
                          onChange={handleChange2}
                        />
                      </div>
                    </div>

                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="primary"
                      onClick={() => cambiarEstadoModal6(false)}
                    >
                      Aceptar
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>

            <input
              className="btn btn-primary my-2 "
              type="submit"
              value="Registrar"

            />
          </div>
        </Form>
      }
    </div>
  );
}

export default EditarActividades;