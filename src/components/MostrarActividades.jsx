import Table from "react-bootstrap/Table";
import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Form } from "react-router-dom";
import Navigation from "./Navigation";
import { useNavigate, redirect } from "react-router-dom";
import { eliminarActividad } from "../api/actividades";
import Swal from "sweetalert2";

const period = "2022-2023";
var token = localStorage.getItem("token");
console.log(token);
const variableObtenerActividades =
  "https://accrual.up.railway.app/activityPlan/byPlan";
const variableNoEditable =
  "https://accrual.up.railway.app/plan/updatePlanNotEditable";

export async function action({ params }) {
  await eliminarActividad(params.actividadId);

  return redirect("/#/mostrarActividades");
}

function MostrarActividades() {

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
//Obtenemos el idPlan con estado
  const [idPlan, setIdPlan] = useState(sessionStorage.getItem("idPlan"));
  useEffect(() => {
    const handleStorageChange = () => {
      setIdPlan(sessionStorage.getItem("idPlan"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Consultas para datos de la actividad de devengamiento
  const useLoaderData1 = () => {
    const [dataActividad, setDataActividad] = useState({});
    const loader1 = async () => {
      try {
        const response1 = await fetch(
          `${variableObtenerActividades}/${idPlan}`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const dataActividades = await response1.json();
      

        setDataActividad(dataActividades);
      } catch (error) {
        console.log(error);
      }
    };
    useEffect(() => {
      loader1();
    }, []);
    return dataActividad;
  };

  // Obtener datos del editar actividad
  const datosActividadPlan = useLoaderData1();

  //Enviar actividades
  async function handleEnviar() {
    try {
      const respuesta = await fetch(
        `${variableNoEditable}/${idPerson},${period}`,
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
      <div className="p-3 m-3">
        <h3 className="p-2">Actividades del periodo 2022-2023</h3>
        {datosActividadPlan.length ? (
          <Table striped>
            <thead>
              <tr>
                <th>Actividad</th>
                <th>Tipo de actividad</th>
                <th>Fecha de inicio </th>
                <th>Fecha de finalización</th>
                <th>Detalle de la actividad</th>
                <th>Enlaces de evidencia</th>
                <th>Lugar de la actividad</th>

                <th></th>
              </tr>
            </thead>

            <tbody>
              {datosActividadPlan.map((actividades, index) => (
                <tr key={index}>
                  <td>
                    {actividades.activityPlan.activity.idActivity === null
                      ? "No disponible"
                      : actividades.activityPlan.activity.idActivity}
                  </td>
                  <td>
                    {actividades.activityPlan.type.nameActivityType === null
                      ? "No disponible"
                      : actividades.activityPlan.type.nameActivityType}
                  </td>
                  <td>
                    {actividades.activityPlan.activity.startDate === null
                      ? "No disponible"
                      : actividades.activityPlan.activity.startDate[0] + "/"+ actividades.activityPlan.activity.startDate[1] + "/" + actividades.activityPlan.activity.startDate[2] }
                  </td>
                  <td>
                    {actividades.activityPlan.activity.endDate === null
                      ? "No disponible"
                      : actividades.activityPlan.activity.endDate[0]+ "/"+ actividades.activityPlan.activity.endDate[1]+ "/"+actividades.activityPlan.activity.endDate[2] }
                  </td>
                  <td>
                    {actividades.activityPlan.activity.description === null
                      ? "No disponible"
                      : actividades.activityPlan.activity.description}
                  </td>

                  <td>
                    {actividades.activityPlan.activity.evidences === null
                      ? "No disponible"
                      : actividades.activityPlan.activity.evidences}
                  </td>

                  <td>
                    {actividades.object.institution.institutionName === null
                      ? "No disponible"
                      : actividades.object.institution.institutionName}
                  </td>

                  <div>
                    <Button
                      className="m-3"
                      type="button"
                      variant="primary"
                      onClick={() =>
                        navigate(
                          `/actividades/${actividades.activityPlan.idActivityPlan}/editar`
                        )
                      }
                    >
                      Editar
                    </Button>
                    <Form
                      method="post"
                      action={`/actividades/${actividades.activityPlan.idActivityPlan}/eliminar`}
                      onSubmit={(e) => {
                        e.preventDefault();
                        Swal.fire({
                          title: "¿Está seguro de eliminar esta actividad?",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Sí, eliminar",
                          cancelButtonText: "Cancelar",
                        }).then(async (result) => {
                          if (result.isConfirmed) {
                            await eliminarActividad(
                              actividades.activityPlan.idActivityPlan, token
                            );
                          }
                        });
                      }}
                    >
                      <Button type="submit" variant="danger">
                        Eliminar
                      </Button>
                    </Form>
                  </div>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No existen datos del docente disponibles</p>
        )}
        <div>
          <Button variant="primary" onClick={handleShow}>
            Enviar
          </Button>
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
              Al momento de confirmar el envío, las actividades ingresadas seran
              enviadas a revision. Tenga en cuenta que cuando se envían las
              actividades ya no podrá agregar más ni editar actividades.
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
        </div>
      </div>
    </div>
  );
}

export default MostrarActividades;
