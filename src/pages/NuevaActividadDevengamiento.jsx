import { Form, useActionData } from "react-router-dom";
import FormularioNuevaActividad from "../components/FormularioNuevaActividad";
import Swal from "sweetalert2";
import Error from "../components/Error";

const variableSubmit = "https://accrualback.up.railway.app/activityPlanAccrual";

const token = sessionStorage.getItem("token");


export async function action({ request }) {
  const token = sessionStorage.getItem("token");

  const storedData = localStorage.getItem("datoSeleccionado");
  const idPersona = sessionStorage.getItem("idPersona");
  const idUniversidad = 1;
  const period = localStorage.getItem("idPeriodo");
  const institutionNameLocal = localStorage.getItem("universidad");
  const idCarrera = localStorage.getItem("idCarrera");
  const nombreOtraInstitucion = localStorage.getItem("nombreOtraInstitucion");
  const idFacultad = localStorage.getItem("idFacultad");
  const detalleDocente = localStorage.getItem("detalleDocente");


  const formData = await request.formData();
  const datos = Object.fromEntries(formData);

  datos.idActivitySubtype = storedData;
  datos.idPeriod = period;
  datos.idPerson = idPersona;

  if (detalleDocente !== "") {
    datos.descriptionSubtype = detalleDocente;
  }

  if (nombreOtraInstitucion === "") {
    datos.idCareer = idCarrera;
    datos.idFaculty = idFacultad;
    datos.idUniversity = idUniversidad;
    datos.institutionName = institutionNameLocal;
  }
  if (idCarrera === "") {
    datos.otherInstitutionName = nombreOtraInstitucion;
    datos.institutionName = nombreOtraInstitucion;
  }

  //Validacion
  const errores = [];
  if (Object.values(datos).includes("")) {
    errores.push("Todos los campos son obligatorios");

  }

  //Retornar datos si hay errores
  if (Object.keys(errores).length) {
    return errores;
  }
  try {
    const respuesta = await fetch(variableSubmit, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datos),
    });
    const respuestaEnviar = await respuesta.json();
    const error = Object.values(respuestaEnviar);
    console.log(respuestaEnviar);
    if (respuesta.ok) {
      await Swal.fire({
        title: "Actividad Registrada",
        text: "El formulario se ha registrado, si requiere enviarlo, diríjase a 'Mostrar'",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#5f559c", 
        confirmButtonText: "Enviar otra Respuesta",
        cancelButtonText: "Mostrar Actividades", 
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          window.location.href = "#/mostrarActividades"; 
        }
      });
    } else {
      await Swal.fire({
        title: "Error",
        text: error,
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    }
  } catch (error) {
    console.error(error);
    await Swal.fire({
      title: "Error",
      text: "Ha ocurrido un error inesperado",
      icon: "error",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    });
  }

  return datos;
}
function NuevaActividadDevengamiento() {
  const errores = useActionData();
  return (
    <div>
      <Form method="post">
        <FormularioNuevaActividad />
        {errores?.length &&
          errores.map((error, i) => <Error key={i}>{error} </Error>)}
        <div className="text-center py-3">
          <input
            className="btn btn-primary my-2 "
            type="submit"
            value="Registrar"
          />
        </div>
      </Form>
    </div>
  );
}

export default NuevaActividadDevengamiento;
