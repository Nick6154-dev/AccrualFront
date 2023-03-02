import { obtenerActividades } from "../api/actividades";
import { Form, useActionData, useLoaderData } from "react-router-dom";
import FormularioNuevaActividad from "../components/FormularioNuevaActividad";
import Swal from "sweetalert2";
import Error from "../components/Error";

const token = sessionStorage.getItem("token");
const variableEdit = "https://accrual.up.railway.app/activityPlanAccrual";

export async function loader({ params }) {
  const actividades = await obtenerActividades(params.actividadId);

  let idActivityPlan = sessionStorage.setItem(
    "idActivityPlan",
    params.actividadId
  );

  if (Object.values(actividades).length === 0) {
    throw new Response("", {
      status: 404,
      statusText: "No hay resultados",
    });
  }
  return actividades;
}

export async function action({ request, params }) {
  const storedData = localStorage.getItem("datoSeleccionado");
  const idPersona = sessionStorage.getItem("idPersona");
  const idUniversidad = 1;
  const period = localStorage.getItem("periodo");
  const institutionNameLocal = localStorage.getItem("universidad");
  const idCarrera = localStorage.getItem("idCarrera");
  const nombreOtraInstitucion = localStorage.getItem("nombreOtraInstitucion");
  const idFacultad = localStorage.getItem("idFacultad");
  const detalleDocente = localStorage.getItem("detalleDocente");

  const enlaceVerificacion = localStorage.getItem("enlaceVerificacion");

  const formData = await request.formData();
  const datos = Object.fromEntries(formData);

  datos.idActivitySubtype = storedData;
  datos.period = period;
  datos.idPerson = idPersona;

  if (detalleDocente !== "") {
    datos.descriptionSubtype = detalleDocente;
  }

  if (enlaceVerificacion === "" && nombreOtraInstitucion === "") {
    datos.idCareer = idCarrera;
    datos.idFaculty = idFacultad;
    datos.idUniversity = idUniversidad;
    datos.institutionName = institutionNameLocal;
  }
  if (idCarrera === "") {
    datos.otherInstitutionName = nombreOtraInstitucion;
    datos.verificationLink = enlaceVerificacion;
    datos.institutionName = nombreOtraInstitucion;
  }

  console.log(datos);

  //Validacion
  const errores = [];
  if (Object.values(datos).includes("")) {
    errores.push("Todos los campos son obligatorios");
  }

  //Retornar datos si hay errores
  if (Object.keys(errores).length) {
    return errores;
  }

  //Actualizar Actividad

  try {
    const respuesta = await fetch(`${variableEdit}/${params.actividadId}`, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datos),
    });
    
    if (respuesta.ok) {
      await Swal.fire({
        title: "Actualizado",
        text: "La actividad se ha actualizado, si requiere enviarlo, diríjase a 'Ver' ",
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

function EditarActividades() {
  const actividades = useLoaderData();
  const errores = useActionData();
  return (
    <div>
      <Form method="post">
        <FormularioNuevaActividad actividad={actividades} />
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

export default EditarActividades;
