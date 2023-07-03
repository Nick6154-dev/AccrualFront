
import image from "../img/uce.png";
import Navigation from "../components/Navigation";
import { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";


const variableObtenerPeriodo = "https://accrualback.up.railway.app/period/findAllActivePeriods";
const obteneridPlan = "https://accrualback.up.railway.app/plan/byIdPersonPeriod";

function Home() {

  //variables  a useState
  const [periodosAbiertos, setPeriodosAbiertos] = useState("");
  const [idPeriodo, setIdPeriodo] = useState("");
  const [idPlan, setIdPlan] = useState("");

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responsePeriodos = await fetch(`${variableObtenerPeriodo}`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const periodosData = await responsePeriodos.json();
        setPeriodosAbiertos(periodosData[0].valuePeriod);
        setIdPeriodo(periodosData[0].idPeriod);

        const responseIdPlan = await fetch(`${obteneridPlan}/${idPersona},${periodosData[0].idPeriod}`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (responseIdPlan.ok) {
          const idPlanData = await responseIdPlan.json();
          setIdPlan(idPlanData.idPlan);
         
        } else {
          throw new Error('Error en la consulta Fetch');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  localStorage.setItem("periodosAbiertos", periodosAbiertos);
  localStorage.setItem("idPeriodo", idPeriodo);
  sessionStorage.setItem("idPlan", idPlan);

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
      <div className="d-flex flex-column justify-content-center align-items-center ">
        {periodosAbiertos === "" ? (
          <Alert variant="danger" className="col-sm-3 text-center">
            No existen periodos activos
          </Alert>
        ) : (
          <Alert variant="primary" className="col-sm-3 text-center">
            Periodo Activo: <h3>{periodosAbiertos}</h3>
          </Alert>
        )}

      </div>
      <div className="row justify-content-md-center align-items-center m-4 border border-secondar">
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