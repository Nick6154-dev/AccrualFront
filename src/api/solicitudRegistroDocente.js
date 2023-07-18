import Swal from "sweetalert2";

const variableAprobarDenegar = "https://accrualback.up.railway.app/register/registerUserToDocentWithOutIt";
const variableAprobarTodos= "https://accrualback.up.railway.app/register/registerAllNewUsersToDocents";

export async function aprobarDocente (id, token){
    const response3 = await fetch(`${variableAprobarDenegar}/${id},true`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      
    });
    if(response3.ok){
      Swal.fire({
        title: 'Docente Aprobado',
        icon: 'success',
      }).then(() => {
        window.location.reload();
      });   
    }else {
      await Swal.fire({
        title: "Error",
        text: "Ocurrió un error al aprobar al Docente",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    }
  }

  export async function aprobarTodos (token){
    const response3 = await fetch(`${variableAprobarTodos}`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      
    });
    if(response3.ok){
      Swal.fire({
        title: 'Docentes Aprobados',
        icon: 'success',
      }).then(() => {
        window.location.reload();
      });   
    }else {
      await Swal.fire({
        title: "Error",
        text: "Ocurrió un error al aprobar al Docente",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    }
  }

export async function denegarDocente (id, token){
    const response3 = await fetch(`${variableAprobarDenegar}/${id},false`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      
    });
    if(response3.ok){
      Swal.fire({
        title: 'Docente Denegado',
        icon: 'success',
      }).then(() => {
        window.location.reload();
      });   
    }else {
      await Swal.fire({
        title: "Error",
        text: "Ocurrió un error al denegar al Docente",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    }
  }