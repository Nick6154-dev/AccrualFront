import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Navigation from "./Navigation";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";

const variableObtenerPeriodo = "https://accrualback.up.railway.app/period/findAllByIdPerson";
const variableTipoActividad = "https://accrualback.up.railway.app/type";
const variableFacultad = "https://accrualback.up.railway.app/faculty/byIdUniversity";
const variableCarrera = "https://accrualback.up.railway.app/career/byIdFaculty";
const variableSubTipo = "https://accrualback.up.railway.app/subtype/byIdType";


function FormularioNuevaActividad({ actividad }) {

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

  const periodosCompletos = localStorage.getItem("periodosCompletos");

  //Validando el select
  const [opcionPeriodos, setOpcionPeriodos] = useState();
  const periodos = JSON.parse(periodosCompletos);
  const [selectedState, setSelectedState] = useState();

  const opcionesPeriodos = periodos.map((periodo) => ({
    value: periodo.idPeriod,
    label: periodo.valuePeriod,
    state: periodo.state,
  }));

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navegar hacia atrás en el historial
  };

  const periodosAbiertos = localStorage.getItem("periodosAbiertos");
  const editar = localStorage.getItem("editar");
  const modoPeriodoString = localStorage.getItem("modoPeriodo")
  const modoPeriodo = modoPeriodoString.split(',').map(item => Number(item.trim()));

  let mensajePeriodo = "";
  if (modoPeriodo[0] == 2) {
    mensajePeriodo = "Etapa de Registro"
  }

  // Función que se ejecuta cuando cambia la opción seleccionada
  const seleccionPeriodo = (event) => {
    setOpcionPeriodos(event.target.value);
    // Obtener el valor del State de la opción seleccionada
    const selectedStateValue = event.target.options[event.target.selectedIndex].dataset.state;
    setSelectedState(selectedStateValue);
  };

  useEffect(() => {
    if (periodos.length === 1) {
      setSelectedState(modoPeriodo[0].toString())
    }
  }, []);
  
  //Validacion de IDperiodos seleccionados
  const idPeriodosString = localStorage.getItem("idPeriodo");
  let idPeriodos = idPeriodosString.split(',').map(item => Number(item.trim()));

  if (idPeriodos.length > 1) {
    localStorage.setItem("idPeriodoSeleccionado", opcionPeriodos)
    localStorage.setItem("modoPeriodo", selectedState)
  }

  const [estadoModal1, cambiarEstadoModal1] = useState(false);
  const [estadoModal2, cambiarEstadoModal2] = useState(false);
  const [estadoModal3, cambiarEstadoModal3] = useState(false);
  const [estadoModal4, cambiarEstadoModal4] = useState(false);
  const [estadoModal5, cambiarEstadoModal5] = useState(false);
  const [estadoModal6, cambiarEstadoModal6] = useState(false);
  const [valorSelectModal, setValorSelectModal] = useState("");
  const [valorSelectUniversidad, setvalorSelectUniversidad] = useState("");
  const [valorSelectFacultad, setvalorSelectFacultad] = useState(1);
  const [valorSelectCarrera, setvalorSelectCarrera] = useState("");
  const [data, setData] = useState([]);
  const [dataFacultades, setDataFacultades] = useState([]);

  const [subActividades, setSubActividades] = useState([]);
  const [tipoActividad, setTipoActividad] = useState([]);
  const [selectedOption, setselectedOption] = useState("");
  const [valorActividades, setValorActividades] = useState(1);
  const [valorOtraInstitucion, setvalorOtraInstitucion] = useState("");
  const [valorDetalleActividadDocente, setvalorDetalleActividadDocente] =
    useState("");


  const [valorEnlaceVerificacion, setValorEnlaceVerificacion] = useState("");

  function handleChange(event) {
    setValorSelectModal(event.target.value);

    setselectedOption(event.target.value);
  }

  function handleChange2(event) {
    setvalorOtraInstitucion(event.target.value);
  }

  function handleChange3(event) {
    setvalorDetalleActividadDocente(event.target.value);
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

  const enlaceVerificacionLocal = valorEnlaceVerificacion;
  localStorage.setItem("enlaceVerificacion", enlaceVerificacionLocal);

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

  const datoSeleccionado = valorSelectModal;
  localStorage.setItem("datoSeleccionado", datoSeleccionado);

  const idCarreraSeleccionada = valorSelectCarrera;
  localStorage.setItem("idCarrera", idCarreraSeleccionada);

  const detalleDocente = valorDetalleActividadDocente;
  localStorage.setItem("detalleDocente", detalleDocente);

  const nombreOtraInstitucion = valorOtraInstitucion;
  localStorage.setItem("nombreOtraInstitucion", nombreOtraInstitucion);


  function cambiarModal() {
    const valueSelect = document.getElementById("select").value;
    setValorActividades(valueSelect);
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
      localStorage.setItem("universidad", "Universidad Central del Ecuador");
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
  return (
    <div>
      <Navigation />
   
      {periodos.length === 1 && modoPeriodo[0] === 2 ? (

        <div className="container py-3  text-center ">
          <Alert>
            <h4>{mensajePeriodo}</h4>
            <br></br>
            <p>Periodo a Ingreso de datos:  </p>
            <h4>{periodosAbiertos}</h4>
          </Alert>
          <div className="card-header">
            <h3>Ingreso de datos de la Actividad</h3>
          </div>

          <div className="card-body">
            <div>
              <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                <label className="p-2 col-form-label" htmlFor="tipoActividad">
                  Elija el tipo de actividad
                </label>
                <div className="p-2 col-sm-3">
                  <select
                    onChange={() => {
                      cambiarModal();
                    }}
                    id="select"
                    className="form-control"
                    required={true}
                    name="idActivityType"

                  >
                    <option className="text-center">*** Seleccione ***</option>
                    {tipoActividad.map((object) => (
                      <option
                        key={object.idActivityType}
                        value={object.idActivityType}
                        defaultValue={actividad?.type.idActivityType}
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
                    name="startDate"
                    className="form-control"
                    defaultValue={actividad?.activity.startDate}
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
                    name="endDate"
                    className="form-control"
                    defaultValue={actividad?.activity.endDate}
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
                    name="descriptionActivity"
                    className="form-control"
                    defaultValue={actividad?.activity.description}
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
        </div >

      )  
      : periodos.length == 1 && modoPeriodo[0] === 1 ? (
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
                    onChange={() => {
                      cambiarModal();
                    }}
                    id="select"
                    className="form-control"
                    required={true}
                    name="idActivityType"

                  >
                    <option className="text-center">*** Seleccione ***</option>
                    {tipoActividad.map((object) => (
                      <option
                        key={object.idActivityType}
                        value={object.idActivityType}
                        defaultValue={actividad?.type.idActivityType}
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
                    name="startDate"
                    className="form-control"
                    defaultValue={actividad?.activity.startDate}
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
                    name="endDate"
                    className="form-control"
                    defaultValue={actividad?.activity.endDate}
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
                    name="descriptionActivity"
                    className="form-control"
                    defaultValue={actividad?.activity.description}
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
                    name="evidences"
                    className="form-control"
                    defaultValue={actividad?.activity.evidences}
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

      ) : periodos.length === 1 && selectedState === "3" ? (
        <div className="p-2 ">
          <div className="alert alert-info text-center" role="alert">
            <h5>La etapa es de validación</h5>
          </div>
        </div>
      ) : periodos.length > 1 ? (
          <div className="d-flex flex-column justify-content-center align-items-center py-5">
            <div className="card-header">
              <h3>Elija el periodo a ingresar</h3>
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


            {selectedState === "1" && (
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
                          onChange={() => {
                            cambiarModal();
                          }}
                          id="select"
                          className="form-control"
                          required={true}
                          name="idActivityType"

                        >
                          <option className="text-center">*** Seleccione ***</option>
                          {tipoActividad.map((object) => (
                            <option
                              key={object.idActivityType}
                              value={object.idActivityType}
                              defaultValue={actividad?.type.idActivityType}
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
                          name="startDate"
                          className="form-control"
                          defaultValue={actividad?.activity.startDate}
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
                          name="endDate"
                          className="form-control"
                          defaultValue={actividad?.activity.endDate}
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
                          name="descriptionActivity"
                          className="form-control"
                          defaultValue={actividad?.activity.description}
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
                          name="evidences"
                          className="form-control"
                          defaultValue={actividad?.activity.evidences}
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

            )}

            {selectedState === "2" && (
              <div className="container py-3  text-center ">

                <div className="card-header">
                  <h3>Ingreso de datos de la Actividad</h3>
                </div>

                <div className="card-body">
                  <div>
                    <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                      <label className="p-2 col-form-label" htmlFor="tipoActividad">
                        Elija el tipo de actividad
                      </label>
                      <div className="p-2 col-sm-3">
                        <select
                          onChange={() => {
                            cambiarModal();
                          }}
                          id="select"
                          className="form-control"
                          required={true}
                          name="idActivityType"

                        >
                          <option className="text-center">*** Seleccione ***</option>
                          {tipoActividad.map((object) => (
                            <option
                              key={object.idActivityType}
                              value={object.idActivityType}
                              defaultValue={actividad?.type.idActivityType}
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
                          name="startDate"
                          className="form-control"
                          defaultValue={actividad?.activity.startDate}
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
                          name="endDate"
                          className="form-control"
                          defaultValue={actividad?.activity.endDate}
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
                          name="descriptionActivity"
                          className="form-control"
                          defaultValue={actividad?.activity.description}
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
              </div >
            )}
            {selectedState === "3" && (
              <div className="p-2 col-sm-3">
                <div className="alert alert-info" role="alert">
                  La etapa es de validación
                </div>
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

export default FormularioNuevaActividad;
