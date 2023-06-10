import FormularioLogin from "../components/FormularioLogin";
import { Form, redirect } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { NavLink } from 'react-router-dom';
import Swal from "sweetalert2";

const variable = "https://accrual.up.railway.app/accrual/authorization";

export async function action({ request }) {
  const formData = await request.formData();
  const datos = Object.fromEntries(formData);

  try {
    const respuesta = await fetch(variable, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });

    if (respuesta.ok) {
      const token = await respuesta.json();

      var valorToken = token.token;
      sessionStorage.setItem("token", valorToken);
      const periodo = "2022-2023"
      localStorage.setItem("periodo", periodo);
      const partesToken = valorToken.split(".");
      const decoded = atob(partesToken[1]);
      const valorJson = JSON.parse(decoded);
      const idDocente = valorJson.sub;
      sessionStorage.setItem("idPersona", idDocente);
      return redirect("/index");
    } else {
      await Swal.fire({
        title: "Error",
        text: "Usuario o Contraseña incorrectos",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    }

  } catch (error) {
    console.error(error);
    await Swal.fire({
      title: "Error",
      text: "Ocurrió un error al Iniciar Sesión",
      icon: "error",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    });
  }
  return null;
}

function Login() {

  return (
    <div>
      <Form method="post">
        <FormularioLogin />
        <div className="button-login text-center py-1">
          <input
            className=" btn btn-primary "
            type="submit"
            value="Ingresar"
          />
        </div>
        <div className='my-4 text-center '>
              <NavLink to="/solicitudRegistroDevengamiento">
                <Button variant="link" className='link-registro'>Solicitud de registro en el sistema</Button>
              </NavLink>
            </div>
      </Form>
    </div>
  );
}

export default Login;
