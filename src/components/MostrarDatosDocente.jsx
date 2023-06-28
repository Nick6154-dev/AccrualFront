import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Navigation from "./Navigation";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import MUIDataTable from 'mui-datatables';

function MostrarDatosDocente() {

  //Obtenemos el Token con estado
  const token = sessionStorage.getItem("token");

  const variable = "https://accrual.up.railway.app/person";
  const variableDatosDocente = "https://accrual.up.railway.app/docent/byIdPerson";
  const variableDatosDevengamiento = "https://accrual.up.railway.app/accrualData/ByIdPerson";
  const variableActualizarDevengamiento = "https://accrual.up.railway.app/accrualData";
  const variableRedes = "https://accrual.up.railway.app/network/byIdPerson";
  const variableActualizarRedes = "https://accrual.up.railway.app/network";
  const variableObservaciones = "https://accrual.up.railway.app/accrualData/observation"


  const [idAccrualData, setIdAccrualData] = useState("");
  const [idNetwork, setIdNetwork] = useState("");
  const [docente, setDocente] = useState({});
  const [observaciones, setObservaciones] = useState("");

  const [dataGenerales, setDataGenerales] = useState([]);
  const [dataGenerales2, setDataGenerales2] = useState([]);
  const [dataDevengamiento, setDataDevengamiento] = useState([]);

  //Obtener el idPersona con estado
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


  //Obtener datos generales
  const useLoaderData = () => {
    const [data, setData] = useState({});
    const loader = async () => {
      try {
        const response1 = await fetch(`${variable}/${idPersona}`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data1 = await response1.json();
        setDataGenerales([data1]);

      } catch (error) {
        console.log(error);
      }
    };
    useEffect(() => {
      loader();

    }, []);

    return data;
  };

  //Obtener datosGenerales2 del Docente
  const useLoaderData2 = () => {
    const [data2, setData2] = useState({});
    const loader2 = async () => {
      try {
        const response2 = await fetch(`${variableDatosDocente}/${idPersona}`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const dataDocente = await response2.json();
        setDataGenerales2([dataDocente]);

      } catch (error) {
        console.log(error);
      }
    };
    useEffect(() => {
      loader2();
    }, []);
    return data2;
  };

  const [data3, setData3] = useState([]);
  //Obtener datos de Devengamiento del Docente
  const useLoaderData3 = () => {
    const loader3 = async () => {
      try {
        const response3 = await fetch(
          `${variableDatosDevengamiento}/${idPersona}`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const dataDevengamiento = await response3.json();
        setDataDevengamiento([dataDevengamiento]);
        setIdAccrualData(dataDevengamiento.idAccrualData);
        setDocente(dataDevengamiento.docent);

        //Set a las variables de editar Datos Devengamiento
        setEnlaceTesis(dataDevengamiento.thesisLink);
        setFechaLectura(dataDevengamiento.fechaLecturaTesis);
        setFechaReintegro(dataDevengamiento.fechaReintegroTesis);
        setTiempoDevengamiento(dataDevengamiento.accrualTime);
        setEnlaceAdendaContrato(dataDevengamiento.contractAddendumLink);

        const fechaLecturaTesisAnio = dataDevengamiento.readingThesisDate[0];
        const fechaLecturaTesisMes = dataDevengamiento.readingThesisDate[1];
        const fechaLecturaTesisDia = dataDevengamiento.readingThesisDate[2];

        const fechaLecturaTesis =
          fechaLecturaTesisDia +
          "/" +
          fechaLecturaTesisMes +
          "/" +
          fechaLecturaTesisAnio;

        const fechaReintegroTesisAnio = dataDevengamiento.refundDate[0];
        const fechaReintegroTesisMes = dataDevengamiento.refundDate[1];
        const fechaReintegroTesisDia = dataDevengamiento.refundDate[2];
        const fechaReintegroTesis =
          fechaReintegroTesisAnio +
          "/" +
          fechaReintegroTesisMes +
          "/" +
          fechaReintegroTesisDia;

        setData3([
          { ...dataDevengamiento, fechaLecturaTesis, fechaReintegroTesis },
        ]);
      } catch (error) {
        console.log(error);
      }
    };
    useEffect(() => {
      loader3();
    }, []);

    return data3;
  };


  //Obtener datos de redes de los Docentes

  const [data4, setData4] = useState([]);
  const useLoaderData4 = () => {
    const loader4 = async () => {
      try {
        const response4 = await fetch(`${variableRedes}/${idPersona}`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const dataRedes = await response4.json();
        const idNetwork = dataRedes.idNetworks;
        setIdNetwork(dataRedes.idNetworks);


        //Set a las variables de editar Redes
        setRediCedia(dataRedes.cedia);
        setSenescyt(dataRedes.rniSenesyt);
        setOrcid(dataRedes.orcidCode);


        setData4([{ ...dataRedes }]);
      } catch (error) {
        console.log(error);
      }
    };
    useEffect(() => {
      loader4();
    }, []);

    return data4;
  };

  //Actualizar datos
  async function handleSubmit() {
    try {
      const respuestaActualizar = await fetch(
        `${variableActualizarDevengamiento}/${idAccrualData}`,
        {
          method: "PUT",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            thesisLink: enlaceTesis,
            readingThesisDate: fechaLectura,
            refundDate: fechaReintegro,
            contractAddendumLink: enlaceAdendaContrato,
            settlement: "false",
            observations: "null",
            accrualTime: tiempoDevengamiento,
            docent: docente,
          }),
        }
      );
      await respuestaActualizar.json();
      if (respuestaActualizar.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  }

  //Enviar Observaciones
  async function handleSubmitObservaciones() {
    try {
      const respuestaActualizar = await fetch(
        `${variableObservaciones}/${idAccrualData}`,
        {
          method: "PATCH",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(
            observaciones),
        }
      );
      await respuestaActualizar.json();
      if (respuestaActualizar.ok) {

        await Swal.fire({
          title: "Enviado",
          text: "La observación ha sido enviada correctamente",
          icon: "success",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "OK",
        });
        handleClose();
      } else {
        await Swal.fire({
          title: "Error",
          text: "Ocurrió un error al enviar la observación",
          icon: "error",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.log(error);
      await Swal.fire({
        title: "Error",
        text: "Ocurrió un error al enviar la observación",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    }
  }

  //Actualizar datos de redes
  async function handleSubmitRedes() {
    try {
      const respuestaActualizar = await fetch(
        `${variableActualizarRedes}/${idNetwork}`,
        {
          method: "PUT",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            cedia: rediCedia,
            docent: docente,
            orcidCode: orcid,
            rniSenesyt: senescyt,
            socialNetworks: [],
          }),
        }
      );
      await respuestaActualizar.json();
      if (respuestaActualizar.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  }


  const datos = useLoaderData();
  const datosDocente = useLoaderData2();
  const datosDevengamiento = useLoaderData3();
  const datosRedes = useLoaderData4();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showEditDev, setShowEditDev] = useState(false);
  const handleCloseEditDev = () => setShowEditDev(false);
  const handleShowEditDev = () => setShowEditDev(true);

  const [showEditRed, setShowEditRed] = useState(false);
  const handleCloseEditRed = () => setShowEditRed(false);
  const handleShowEditRed = () => setShowEditRed(true);

  // Obtener datos del editar Datos Devengamiento
  const [enlaceTesis, setEnlaceTesis] = useState("");
  const [fechaLectura, setFechaLectura] = useState("");
  const [fechaReintegro, setFechaReintegro] = useState("");
  const [tiempoDevengamiento, setTiempoDevengamiento] = useState("");
  const [enlaceAdendaContrato, setEnlaceAdendaContrato] = useState("");

  //Obtener datos redes
  const [rediCedia, setRediCedia] = useState("");
  const [senescyt, setSenescyt] = useState("");
  const [orcid, setOrcid] = useState("");

  function handleChangeEnlaceTesis(event) {
    setEnlaceTesis(event.target.value);
  }
  function handleChangeFechaLectura(event) {
    setFechaLectura(event.target.value);
  }

  function handleChangeFechaReintegro(event) {
    setFechaReintegro(event.target.value);
  }

  function handleChangeTiempoDevengamiento(event) {
    setTiempoDevengamiento(event.target.value);
  }

  function handleChangeEnlaceAdendaContrato(event) {
    setEnlaceAdendaContrato(event.target.value);
  }
  function handleChangeRediCedia(event) {
    setRediCedia(event.target.value);
  }

  function handleChangeSenescyt(event) {
    setSenescyt(event.target.value);
  }

  function handleChangeRediOrcid(event) {
    setOrcid(event.target.value);
  }

  function handleChangeObservaciones(event) {
    setObservaciones(event.target.value);
  }

  // Definimos las columnas para Datos Generales
  const columnasDatosGenerales = [
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
      name: "Correo Institucional",
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
      name: "Modalidad del Devengamiento",
      options: {
        customHeadRender: (columnMeta) => {
          return (
            <th className="header-datatable">{columnMeta.label}</th>
          );
        },
      },
    },
    {
      name: "Categoría del Docente",
      options: {
        customHeadRender: (columnMeta) => {
          return (
            <th className="header-datatable">{columnMeta.label}</th>
          );
        },
      },
    },

  ];

  // Definimos las columnas para Datos Devengamiento
  const columnasDatosDevengamiento = [
    {
      name: "Enlace de Tesis",
      options: {
        customHeadRender: (columnMeta) => {
          return (
            <th className="header-datatable">{columnMeta.label}</th>
          );
        },
      },
    },
    {
      name: "Fecha de lectura de la tesis",
      options: {
        setCellProps: () => ({ style: { paddingLeft: '40px', paddingRight: '40px' } }),
        customHeadRender: (columnMeta) => {
          return (
            <th className="header-datatable">{columnMeta.label}</th>
          );
        },
      },
    },
    {
      name: "Fecha de reintegro",
      options: {
        customHeadRender: (columnMeta) => {
          return (
            <th className="header-datatable">{columnMeta.label}</th>
          );
        },
      },
    },
    {
      name: "Tiempo de devengamiento",
      options: {
        customHeadRender: (columnMeta) => {
          return (
            <th className="header-datatable">{columnMeta.label}</th>
          );
        },
      },
    },
    {
      name: "Enlace de Contrato o Adenda",
      options: {
        customHeadRender: (columnMeta) => {
          return (
            <th className="header-datatable">{columnMeta.label}</th>
          );
        },
      },
    },
    {
      name: "",
      options: {
        customHeadRender: (columnMeta) => {
          return (
            <th className="header-datatable">{columnMeta.label}</th>
          );
        },
        customBodyRender: () => {
          return (
            <Button variant="primary" onClick={handleShowEditDev}>
              Editar
            </Button>
          );
        },
      },
    },

  ];


  // Definimos las columnas para Datos Redes
  const columnasDatosRedes = [
    {
      name: "REDI/CEDIA",
      options: {
        customHeadRender: (columnMeta) => {
          return (
            <th className="header-datatable">{columnMeta.label}</th>
          );
        },
      },
    },
    {
      name: "Sistema de Investigadores nacionales de Senescyt",
      options: {
        setCellProps: () => ({ style: { paddingLeft: '40px', paddingRight: '40px' } }),
        customHeadRender: (columnMeta) => {
          return (
            <th className="header-datatable">{columnMeta.label}</th>
          );
        },
      },
    },
    {
      name: "Codigo ORCI",
      options: {
        customHeadRender: (columnMeta) => {
          return (
            <th className="header-datatable">{columnMeta.label}</th>
          );
        },
      },
    },
    {
      name: "",
      options: {
        customHeadRender: (columnMeta) => {
          return (
            <th className="header-datatable">{columnMeta.label}</th>
          );
        },
        customBodyRender: () => {
          return (
            <Button variant="primary" onClick={handleShowEditRed}>
              Editar
            </Button>
          );
        },
      },
    },

  ];

  const options = {
    responsive: "standard",
    selectableRows: "none",
    toolbar: false,
    search: false,
    download: false,
    print: false,
    viewColumns: false,
    filter: false,
    pagination: false, // Desactivar el toolbar
    textLabels: {
      body: {
        noMatch: "No se encontraron registros",
        toolTip: "Ordenar",
        columnHeaderTooltip: (column) => `Ordenar por ${column.label}`,
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

  //Datos Generales para la tabla Datos Generales
  const transformedDatosGenerales = dataGenerales.map((datosGenerales, index) => {
    const datosRestantes = dataGenerales2.map((docente) => {
    })
    return [
      datosGenerales.identification,
      datosGenerales.name,
      datosGenerales.lastname,
      datosGenerales.email,
      docente.faculty,
      docente.modality,
      docente.category

    ];
  });

  //Datos Generales para la tabla Datos Devengamiento
  const transformedDatosDevengamiento = data3.map((datosDevengamiento, index) => {

    return [
      datosDevengamiento.thesisLink,
      datosDevengamiento.fechaLecturaTesis,
      datosDevengamiento.fechaReintegroTesis,
      datosDevengamiento.accrualTime,
      datosDevengamiento.contractAddendumLink,
    ];
  });

  //Datos Generales para la tabla Datos Redes
  const transformedDatosRedes = data4.map((datosRedes, index) => {
    return [
      datosRedes.cedia,
      datosRedes.rniSenesyt,
      datosRedes.orcidCode
    ];
  });

  return (
    <div>
      <Navigation />

      <div className="p-3 m-3">
        <h2 className="p-2">Datos Generales</h2>
        <MUIDataTable
          data={transformedDatosGenerales}
          columns={columnasDatosGenerales}
          options={options}
        />

      </div>
      <div className="p-3 m-3">
        <h2 className="p-2">Devengamiento</h2>
        <MUIDataTable
          data={transformedDatosDevengamiento}
          columns={columnasDatosDevengamiento}
          options={options}
        />
      </div>
      <Modal show={showEditDev} onHide={handleCloseEditDev}>
        <Modal.Header closeButton>
          <Modal.Title>Datos de Devengamiento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container py-3  text-center ">
            <div className="card-body">
              <div>
                <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                  <label
                    className="p-2 col-form-label"
                    htmlFor="Enlace de la tesis"
                  >
                    Enlace de la tesis
                  </label>
                  <div className="p-2 col-sm-8">
                    <input
                      className="form-control"
                      type="url"
                      placeholder="http://ejemplo.com"
                      value={enlaceTesis}
                      onChange={handleChangeEnlaceTesis}
                    ></input>
                  </div>
                </div>
              </div>
              <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                <label
                  className="p-2 col-form-label"
                  htmlFor="Fecha de lectura de la tesis"
                >
                  Fecha de lectura de la tesis
                </label>
                <div className="p-2 col-sm-8">
                  <input
                    type="date"
                    required={true}
                    id="Fecha de lectura de la tesis"
                    className="form-control"
                    value={fechaLectura}
                    onChange={handleChangeFechaLectura}
                  />
                </div>
              </div>
              <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                <label
                  className="p-2 col-form-label"
                  htmlFor="Fecha de reintegro"
                >
                  Fecha de reintegro
                </label>
                <div className="p-2 col-sm-8">
                  <input
                    type="date"
                    required={true}
                    id="Fecha de reintegro"
                    className="form-control"
                    value={fechaReintegro}
                    onChange={handleChangeFechaReintegro}
                  />
                </div>
              </div>
              <div>
                <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                  <label
                    className="p-2 col-form-label"
                    htmlFor="Enlace de la tesis"
                  >
                    Tiempo de devengamiento (meses){" "}
                  </label>
                  <div className="p-2 col-sm-8">
                    <input
                      className="form-control"
                      type="number"
                      placeholder="0"
                      value={tiempoDevengamiento}
                      onChange={handleChangeTiempoDevengamiento}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                <label
                  className="p-2 col-form-label"
                  htmlFor="Enlace de la tesis"
                >
                  Enlace de Adenda o Contrato
                </label>
                <div className="p-2 col-sm-8">
                  <input
                    className="form-control"
                    type="url"
                    placeholder="http://ejemplo.com"
                    value={enlaceAdendaContrato}
                    onChange={handleChangeEnlaceAdendaContrato}
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseEditDev}
          >
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Enviar
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="p-3 m-3">
        <h2 className="p-2">Redes</h2>
        <MUIDataTable
          data={transformedDatosRedes}
          columns={columnasDatosRedes}
          options={options}
        />
      </div>

      <Modal show={showEditRed} onHide={handleCloseEditRed}>
        <Modal.Header closeButton>
          <Modal.Title>Datos de Redes </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container py-3  text-center ">
            <div className="card-body">
              <div>
                <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                  <label
                    className="p-2 col-form-label"
                    htmlFor="Senescyt"
                  >
                    Forma parte de la Red de Investigadores
                    nacionales de REDI/ CEDIA{" "}
                  </label>
                  <div className="p-2 col-sm-8">
                    <select
                      id="select"
                      className="form-control"
                      required={true}
                      name="idSenescyt"
                      value={rediCedia}
                      onChange={handleChangeRediCedia}
                    >
                      <option>Seleccione... </option>
                      <option value="Si">SI</option>
                      <option value="No">NO</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                  <label
                    className="p-2 col-form-label"
                    htmlFor="Senescyt"
                  >
                    Está registrado en el sistema de
                    Investigadores nacionales de Senescyt
                  </label>
                  <div className="p-2 col-sm-8">
                    <select
                      id="select"
                      className="form-control"
                      required={true}
                      name="idSenescyt"
                      value={senescyt}
                      onChange={handleChangeSenescyt}
                    >
                      <option>Seleccione... </option>
                      <option value="Si">SI</option>
                      <option value="No">NO</option>
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                    <label
                      className="p-2 col-form-label"
                      htmlFor="Senescyt"
                    >
                      Codigo Orcid
                    </label>
                    <div className="p-2 col-sm-8">
                      <input
                        type="text"
                        id="select"
                        className="form-control"
                        required={true}
                        name="orcid"
                        value={orcid}
                        onChange={handleChangeRediOrcid}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseEditRed}
          >
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmitRedes}>
            Enviar
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="py-2 text-center">
        <Button variant="primary" onClick={handleShow}>
          Observaciones{" "}
        </Button>{" "}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Observaciones</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>
                  Comentar si existe alguna novedad con los datos para
                  modificarlos
                </Form.Label>
                <textarea value={observaciones} onChange={handleChangeObservaciones} className="form-control" maxLength={80} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmitObservaciones}>
              Enviar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default MostrarDatosDocente;
