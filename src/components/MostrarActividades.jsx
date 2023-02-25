import Table from "react-bootstrap/Table";
import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Form } from "react-router-dom";
import Navigation from "./Navigation";
import { useNavigate, redirect } from "react-router-dom";
import { eliminarActividad } from "../api/actividades";
import Swal from "sweetalert2";

const token = sessionStorage.getItem("token");
const idPlan = sessionStorage.getItem("idPlan");
const period = sessionStorage.getItem("idPeriodo");
const idPerson = sessionStorage.getItem("idPersona");
const variableObtenerActividades = process.env.REACT_APP_API_GENERAL + "/activityPlan/byPlan";
const variableObtenerInstitucion =   process.env.REACT_APP_API_GENERAL + "/institution/withDetailsByIdActivityPlan";
const variableNoEditable = process.env.REACT_APP_API_GENERAL + "/plan/updatePlanNotEditable";

  export async function action({params}){
    await eliminarActividad(params.actividadId)
    
    return redirect ("/mostrarActividades")
    }

function MostrarActividades({}) {
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
console.log(datosActividadPlan)
  //Enviar actividades
  async function handleEnviar(){
    
  try {
    const respuesta = await fetch(`${variableNoEditable}/${idPerson},${period}`, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify("Se va"),
    });
    if (respuesta.ok) {
      await Swal.fire({
        title: "Enviado",
        text:  "Actividades enviadas, recuerde ya no puede agregar ni editar más actividades",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cerrar",
      });
      window.location.href = "/mostrarActividades";
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
                    {actividades.activity.idActivity === null
                      ? "No disponible"
                      : actividades.activity.idActivity}
                  </td>
                  <td>
                    {actividades.type.nameActivityType === null
                      ? "No disponible"
                      : actividades.type.nameActivityType}
                  </td>
                  <td>
                    {actividades.activity.startDate === null
                      ? "No disponible"
                      : actividades.activity.startDate}
                  </td>
                  <td>
                    {actividades.activity.endDate === null
                      ? "No disponible"
                      : actividades.activity.endDate}
                  </td>
                  <td>
                    {actividades.activity.description === null
                      ? "No disponible"
                      : actividades.activity.description}
                  </td>

                  <td>
                    {actividades.activity.evidences === null
                      ? "No disponible"
                      : actividades.activity.evidences}
                  </td>
                  
                    <td>
                      {actividades.activity.institutionName === null
                        ? "No disponible"
                        : actividades.activity.institutionName}
                    </td>
                  
                  <div>
                    <Button className="m-3"
                      type="button"
                      variant="primary"
                      onClick={() =>
                        navigate(
                          `/actividades/${actividades.idActivityPlan}/editar`
                        )
                      }
                    >
                      Editar
                 
                  </Button>
                  <Form
                 method="post"
                 action={`/actividades/${actividades.idActivityPlan}/eliminar`}
                 onSubmit={(e) => {
                   e.preventDefault();
                   Swal.fire({
                     title: '¿Está seguro de eliminar esta actividad?',
                     icon: 'warning',
                     showCancelButton: true,
                     confirmButtonText: 'Sí, eliminar',
                     cancelButtonText: 'Cancelar',
                   }).then(async (result) => {
                     if (result.isConfirmed) {
                       await eliminarActividad(actividades.idActivityPlan);
                       
                     }
                   });
                 }}
               >
                 <Button
                   type="submit"
                   variant="danger"
                 >
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
              enviadas a revision.
              Tenga en cuenta que cuando se envían las actividades ya no podrá agregar más ni editar actividades.
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
