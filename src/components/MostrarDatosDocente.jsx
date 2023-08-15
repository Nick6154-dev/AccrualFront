import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Navigation from "./Navigation";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import MUIDataTable from 'mui-datatables';
import { actualizarDatosGeneralesAPI } from "../api/mostrarDatosDocente";
import { agregarDatosDevengamientoAPI } from "../api/mostrarDatosDocente";
import { actualizarDatosDevengamientoAPI } from "../api/mostrarDatosDocente";
import { agregarDatosRedesAPI } from "../api/mostrarDatosDocente";
import { actualizarDatosRedesAPI } from "../api/mostrarDatosDocente";
function MostrarDatosDocente() {

  //Obtenemos el Token con estado
  const token = sessionStorage.getItem("token");

  const variable = "https://accrualback.up.railway.app/person";
  const variableDatosDocente = "https://accrualback.up.railway.app/docent/byIdPerson";
  const variableDatosDevengamiento = "https://accrualback.up.railway.app/accrualData/ByIdPerson";
  const variableActualizarDevengamiento = "https://accrualback.up.railway.app/accrualData";
  const variableRedes = "https://accrualback.up.railway.app/network/byIdPerson";
  const variableActualizarRedes = "https://accrualback.up.railway.app/network";
  const variableObservaciones = "https://accrualback.up.railway.app/accrualData/observation"


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

  // Verificar si modality y category son cadenas vacías usando .map()
  const modalidadCategoria = dataGenerales2.map((item) => {
    return item.modality === "" && item.category === "";
  });

  // Comprobar si todas las entradas son true usando .every()
  const existeVaciosDatosGenerales = modalidadCategoria.every(
    (item) => item === true
  );


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
        if (idNetwork == null) {
          setData4([])
        } else {
          setData4([{ ...dataRedes }]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    useEffect(() => {
      loader4();
    }, []);

    return data4;
  };

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

  const [ShowDatosG, setShowDatosG] = useState(false);
  const handleCloseDatosG = () => setShowDatosG(false);
  const handleShowDatosG = () => setShowDatosG(true);

  const [showEditRed, setShowEditRed] = useState(false);
  const handleCloseEditRed = () => setShowEditRed(false);
  const handleShowEditRed = () => setShowEditRed(true);

  //Obtener Datos Generales
  const [valorModalidad, setValorModalidad] = useState("");
  const [valorCategoria, setValorCategoria] = useState("");

  function handleChange6(event) {
    setValorModalidad(event.target.value);
  }
  function handleChange7(event) {
    setValorCategoria(event.target.value);
  }

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


  //Datos para agregar
  const datosGeneralesActualizar = {
    "categoryDocent": valorCategoria,
    "modalityAccrual": valorModalidad
  }

  const datosNuevosDevengamiento = {
    "thesisLink": enlaceTesis,
    "readingThesisDate": fechaLectura,
    "refundDate": fechaReintegro,
    "contractAddendumLink": enlaceAdendaContrato,
    "accrualTime": tiempoDevengamiento
  }

  const datosNuevosRedes = {
    "orcidCode": orcid,
    "cedia": rediCedia,
    "rniSenesyt": senescyt
  }

  //Consultas para actualizar
  async function actualizarDatosGenerales() {
    const respuesta = await actualizarDatosGeneralesAPI(idPersona, token, datosGeneralesActualizar);
    if (respuesta.ok) {

      await Swal.fire({
        title: "Agregado",
        text: "Los datos se han agredado",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      window.location.reload();
    } else {
      await Swal.fire({
        title: "Error",
        text: error,
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    }
  }

  //Agregar datos devengamiento
  async function agregarDatosDevengamiento() {
    const respuesta = await agregarDatosDevengamientoAPI(idPersona, token, datosNuevosDevengamiento);

    const error = Object.values(respuesta);
    if (respuesta.ok) {
      setShowEditDev(false);

      await Swal.fire({
        title: "Agregado",
        text: "Los datos se han agregado",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      window.location.reload();
    } else {
      await Swal.fire({
        title: "Error",
        text: error,
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    }
  }

  //Actualizar datos devengamiento
  async function handleSubmit() {
    const respuesta = await actualizarDatosDevengamientoAPI(idAccrualData, token, datosNuevosDevengamiento);

    const error = Object.values(respuesta);
    if (respuesta.ok) {
      setShowEditDev(false);

      await Swal.fire({
        title: "Agregado",
        text: "Los datos se han actualizado",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      window.location.reload();
    } else {
      await Swal.fire({
        title: "Error",
        text: error,
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    }
  }

  //Agregar datos redes
  async function agregarDatosRedes() {
    const respuesta = await agregarDatosRedesAPI(idPersona, token, datosNuevosRedes);

    const error = Object.values(respuesta);
    if (respuesta.ok) {
      setShowEditRed(false);
      await Swal.fire({
        title: "Agregado",
        text: "Los datos se han agregado",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      window.location.reload();
    } else {
      await Swal.fire({
        title: "Error",
        text: error,
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    }
  }

  // Actualizar datos redes
  async function handleSubmitRedes() {
    const respuesta = await actualizarDatosRedesAPI(idAccrualData, token, datosNuevosRedes);

    const error = Object.values(respuesta);
    if (respuesta.ok) {
      setShowEditRed(false)
      await Swal.fire({
        title: "Agregado",
        text: "Los datos se han actualizado",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      window.location.reload();
    } else {
      await Swal.fire({
        title: "Error",
        text: error,
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    }
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
  if (existeVaciosDatosGenerales) {
    columnasDatosGenerales.push({
      name: " ",
      options: {
        customHeadRender: (columnMeta) => {
          return (
            <th className="header-datatable">{columnMeta.label}</th>
          );
        },
        customBodyRender: () => {
          return (
            <div>
              <Button variant="primary" className="mx-1 btn-block my-2" onClick={handleShowDatosG} >
                Agregar datos
              </Button>
            </div>
          );
        },
      },
    });
  }


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
            <div>
              {data3.length > 0 ? (
                <Button variant="primary" onClick={handleShowEditDev}>
                  Editar
                </Button>
              ) : (
                <Button variant="primary" onClick={handleShowEditDev} >
                  Agregar Datos
                </Button>
              )}
            </div>
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
      name: "Código ORCID",
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
            <div>
              {data4.length > 0 ? (
                <Button variant="primary" onClick={handleShowEditRed}>
                  Editar
                </Button>
              ) : (
                <Button variant="primary" onClick={handleShowEditRed} >
                  Agregar Datos
                </Button>
              )}
            </div>

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
  // Datos Generales para la tabla Datos Generales
  const transformedDatosGenerales = dataGenerales.map((datosGenerales, index) => {
    const docente = dataGenerales2[index]; // Obtener los datos del docente correspondiente
    return [
      datosGenerales.identification || "",
      datosGenerales.name || "",
      datosGenerales.lastname || "",
      datosGenerales.email || "",
      docente ? docente.faculty || "" : "", // Verificar si el objeto docente existe antes de acceder a sus propiedades
      docente ? docente.modality || "" : "",
      docente ? docente.category || "" : ""
    ];
  });

  // Datos Generales para la tabla Datos Devengamiento
  const transformedDatosDevengamiento = data3.length > 0
    ? data3.map((datosDevengamiento, index) => {
      return [
        datosDevengamiento.thesisLink || "",
        datosDevengamiento.fechaLecturaTesis|| "",
        datosDevengamiento.fechaReintegroTesis|| "",
        datosDevengamiento.accrualTime|| "",
        datosDevengamiento.contractAddendumLink|| "",
      ];
    })
    : [
      ""
    ];

  // Datos Generales para la tabla Datos Redes
  const transformedDatosRedes = data4.length > 0 ?
    data4.map((datosRedes, index) => {
      return [
        datosRedes.cedia,
        datosRedes.rniSenesyt,
        datosRedes.orcidCode,
      ];
    })
    : [
      ""
    ];

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
          {data3.length > 0 ? (
            <Button variant="primary" onClick={handleSubmit}>
              Editar
            </Button>
          ) : (
            <Button variant="primary" onClick={agregarDatosDevengamiento}>
              Agregar Datos
            </Button>
          )}
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
          {data4.length > 0 ? (
            <Button variant="primary" onClick={handleSubmitRedes}>
              Editar
            </Button>
          ) : (
            <Button variant="primary" onClick={agregarDatosRedes}>
              Agregar Datos
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <Modal show={ShowDatosG} onHide={handleCloseDatosG}>
        <Modal.Header closeButton>
          <Modal.Title>Datos Generales </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container py-3  text-center ">
            <div className="card-body">

              <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">

                <label className="p-2 col-form-label" htmlFor="modalidad">Modalidad de devengamiento:</label>
                <div className="p-2 col-sm-8">
                  <select
                    id="modalidad"
                    required={true}
                    onChange={handleChange6}
                    value={valorModalidad}
                    className="form-control">
                    <option className="text-center"> ** Seleccione **</option>
                    <option value="Tiempo de devengamiento">Tiempo de devengamiento</option>
                    <option value="Medio tiempo (combinado)">Medio tiempo (combinado)</option>
                  </select>
                </div>
              </div>
              <div className="form-group  d-flex flex-column justify-content-center align-items-center py-2">
                <label className="p-2 col-form-label" htmlFor="categoria">Categoría del Docente:</label>
                <div className="p-2 col-sm-8">
                  <select
                    id="categoria"
                    required={true}
                    onChange={handleChange7}
                    value={valorCategoria}
                    className="form-control">
                    <option className="text-center"> ** Seleccione **</option>
                    <option value="Auxiliar 1">Auxiliar 1</option>
                    <option value="Auxiliar 2">Auxiliar 2</option>
                    <option value="Agregado 1">Agregado 1</option>
                    <option value="Agregado 2">Agregado 2</option>
                    <option value="Agregado 3">Agregado 3</option>
                    <option value="Principal">Principal</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseDatosG}
          >
            Cancelar
          </Button>

          <Button variant="primary" onClick={actualizarDatosGenerales}>
            Agregar Datos
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
