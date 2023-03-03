import image from "../img/uce.png";
import Navigation from "../components/Navigation";
import Alert from "react-bootstrap/Alert";
import { redirect } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

const token = sessionStorage.getItem("token");

const period = "2022-2023";
const obteneridPlan = "https://accrual.up.railway.app/plan/byIdPersonPeriod";


const idPersona = sessionStorage.getItem("idPersona");

const useLoaderData2 = () => {

  const [data2, setData2] = useState();
  const loader2 = async () => {
    try {
      const response1 = await fetch(`${obteneridPlan}/${idPersona},${"2022-2023"}`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response1.json();
      sessionStorage.setItem("idPlan", data);
      setData2(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    loader2();
  }, [data2]);
  return data2;
};

function Home() {

  const idPlan = useLoaderData2();

  function handleIdPlan() {
    Swal.fire({
      title: "Listo",
      text: "Ya puede ingresar las actividades de devengamiento",
      icon: "success",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
    }).then((result) => {
      if (result.isConfirmed) { 
        
        window.location.reload(true);
      }
    });
  }

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
        <div className="d-flex flex-column justify-content-center align-items-center py-5 ">
          <Alert variant="primary" className=" col-sm-5 text-center">
            Usted se encuentra en el periodo: <h3>{period}</h3>
            <br></br>
            Antes de continuar, debe aceptar que está de acuerdo en ingresar las actividades
            de devengamiento en el periodo actual.
          </Alert>
          <Button id="boton" onClick={handleIdPlan} variant="primary">Aceptar</Button>
        </div>
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
