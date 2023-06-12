import image from "../img/uce.png";
import Navigation from "../components/Navigation";
import { useEffect, useState } from "react";

const obteneridPlan = "https://accrual.up.railway.app/plan/byIdPersonPeriod";

function Home() {

  //variables  a useState

  //Obtenemos el Token con estado
  const token = sessionStorage.getItem("token");
  const partesToken = token.split(".");
  const decoded = atob(partesToken[1]);
  const valorJson = JSON.parse(decoded);
  const arregloPeriodos = JSON.parse(valorJson.periods);
  const periodosAbiertos = arregloPeriodos[0].valuePeriod;
  localStorage.setItem("periodosAbiertos", periodosAbiertos);



  console.log(periodosAbiertos);

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


  //Hacemos la consulta para obtener el idPlan
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${obteneridPlan}/${idPersona},${periodosAbiertos}`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();

          console.log(data)
          sessionStorage.setItem('idPlan', JSON.stringify(data));
        } else {
          throw new Error('Error en la consulta Fetch');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

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
      <div className="row justify-content-md-center align-items-center m-5 border border-secondar">
        <div className="col-md-auto m-5 image">
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