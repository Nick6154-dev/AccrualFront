import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Navigation from "./Navigation";
import Alert from "react-bootstrap/Alert";
const periodo = localStorage.getItem("periodo");

const token = sessionStorage.getItem("token");
const variableTipoActividad = "https://accrual.up.railway.app/type";
const variableFacultad = "https://accrual.up.railway.app/faculty/byIdUniversity";
const variableCarrera ="https://accrual.up.railway.app/career/byIdFaculty";
const variableSubTipo = "https://accrual.up.railway.app/subtype/byIdType";

function FormularioNuevaActividad({actividad}) {
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
  const [valorEnlaceVerificacion, setValorEnlaceVerificacion] = useState("");
  const [valorDetalleActividadDocente, setvalorDetalleActividadDocente] =
    useState("");
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

  const enlaceVerificacionLocal = valorEnlaceVerificacion;
  localStorage.setItem("enlaceVerificacion", enlaceVerificacionLocal);


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
      localStorage.setItem("universidad", "Universidad Central del Ecuador");
    }
    if (valueSelectInstitucion === "1") {
      selectInstitucion.setAttribute(
        "onChange",
        cambiarEstadoModal6(!estadoModal6)
      );
    }
  }
  return (
    <div>
      <Navigation />
      <div className="container py-3  text-center ">
      <div className="d-flex flex-column justify-content-center align-items-center py-5 ">
          <Alert variant="primary" className=" col-sm-5 text-center">
            Usted se encuentra en el periodo: <h3>{periodo}</h3>
          </Alert>
        </div>
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
              <label className="p-2 col-form-label" htmlFor="starDate">
                Fecha de Inicio
              </label>
              <div className="p-2 col-sm-3">
                <input
                  type="date"
                  required={true}
                  id="starDate"
                  name="starDate"
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
                <Modal.Title> Actividad Innovacion</Modal.Title>
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
    </div>
  );
}

export default FormularioNuevaActividad;
