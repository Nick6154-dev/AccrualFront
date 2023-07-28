
import image from "../img/uce.png";
import Navigation from "../components/Navigation";
import { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";


const variableObtenerPeriodo = "https://accrualback.up.railway.app/period/findAllByIdPerson";
function Home() {

  //variables  a useState
  const [idPeriodo, setIdPeriodo] = useState([]);
  const [modo, setModo] = useState("");
  const [activo, setActivo] = useState("");
  const [periodos, setPeriodos] = useState([])
  const [numeroPeriodos, setNumeroPeriodos] = useState();
  const [modoPeriodo, setModoPeriodo] = useState();

  //Obtenemos el Token con estado
  const token = sessionStorage.getItem("token");

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

  //Consulta para obtener periodos

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responsePeriodos = await fetch(`${variableObtenerPeriodo}/${idPersona}`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const periodosData = await responsePeriodos.json();
        const periodoValorModo = periodosData.map((periodos) => periodos.state);
        setModoPeriodo(periodoValorModo);
        
        localStorage.setItem("modoPeriodo",periodoValorModo);
    


        localStorage.setItem("periodosCompletos", JSON.stringify(periodosData));
        const periodoValores = [periodosData.map((periodos) => periodos.valuePeriod)];

        setPeriodos(periodoValores[0]);
        setNumeroPeriodos(Object.values(periodoValores[0]).length)
        
        const periodoValorID = [periodosData.map((periodos) => periodos.idPeriod)];
        setIdPeriodo(periodoValorID);

        const existeCerrado = periodosData.some((periodos) => periodos.active === true);
        if (existeCerrado) {
          setActivo(true);
        } else {
          setActivo(false);
        }

        if ((Object.values(periodosData)).length == 1) {

         const periodoValorModo = periodosData.map((periodos) => periodos.state);
          const valorModo= periodoValorModo[0];
        localStorage.setItem("modoPeriodoActual", valorModo);
        
          const activoObtenido = periodosData[0].active;
          const modoObtenido = periodosData[0].state;
          const valorPeriodos = periodosData[0].valuePeriod;
          setPeriodos(valorPeriodos);
          if (activoObtenido) {
            setActivo(true)
          } else {
            setActivo(false)
          }

          if (modoObtenido === 0) {
            setModo("No Existe una etapa registrada")
          } else if (modoObtenido === 1) {
            setModo("Etapa completa (Registro/Validación)")
          }
          else if (modoObtenido === 2) {
            setModo("Etapa de Registro")
          }
          else if (modoObtenido === 3) {
            setModo("Etapa de validación")
          }
          setIdPeriodo(periodosData[0].idPeriod);
        }

      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  localStorage.setItem("periodosAbiertos", periodos);
  localStorage.setItem("idPeriodo", idPeriodo);
  return (
    <div>
      <header className="header">
        <div className=" text-right">
          <div className="mask">
            <div className="d-flex justify-content-end align-items-center ">
              <div className="text-white">
                <h3 className="mb-3 text-white">UNIVERSIDAD CENTRAL DEL ECUADOR </h3>
                <h4 className="mb-3">Sistema de seguimiento a Devengamiento</h4>

              </div>
            </div>
          </div>
        </div>
      </header>
      <Navigation />
      <div className="container-md py-4">
        <h4 className="text text-center">
          Bienvenido al Sistema de Seguimiento a Devengamientos de los Docentes
        </h4>
      </div>
      <div className="d-flex flex-row justify-content-center align-items-center">
        {activo === false ? (
          <Alert variant="danger" className="p-2 text-center">
            <h4>Ningún periodo activado</h4>
          </Alert>
        ) : numeroPeriodos === 1 ? (
          <Alert variant="primary" className="p-2 m-4 text-center">
            <h3>Periodo Activo</h3>
            <h4>{periodos}</h4>
            <br />
            <p>{modo}</p>
          </Alert>
        ) : numeroPeriodos > 1 ? (
          <Alert variant="primary" className="p-2 text-center">
            <h3>Periodos activados para ingreso de datos</h3>
          </Alert>
        ) : null}
      </div>
      <div className="row justify-content-md-center align-items-center m-4 p-3 border border-secondar">
        <div className="col-md-auto m-4 image">
          <img className=" p-1" src={image} alt="imagen uce" width="200" />
        </div>
        <div className="col col-lg-5">
          <p>
            En este sistema, los docentes podrán registrar su devengamiento de
            las becas.
          </p>
        </div>
      </div>

      <footer className="bg-light text-center text-lg-start footer m-2">


        <div className="text-left p-3 ">
          <h4 className="text-white ">© 2020 Copyright: Universidad Central del Ecuador</h4>
        </div>

      </footer>
    </div>
  );
}

export default Home;