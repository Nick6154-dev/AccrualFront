import Swal from "sweetalert2";

const variableObtenerActividades = "https://accrual.up.railway.app/activityPlan";
const variableObtenerInstitucion = "https://accrual.up.railway.app/institution/withDetailsByIdActivityPlan"
const variableEliminarActividad = "https://accrual.up.railway.app/activityPlanAccrual"
const token = sessionStorage.getItem("token")

export async function obtenerActividades(id){
     const response = await fetch(`${variableObtenerActividades}/${id}`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    const resultado = await response.json()

    const response2 = await fetch(`${variableObtenerInstitucion}/${id}`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    const resultado2 = await response2.json();
    const data = {...resultado, ...resultado2};
    return data;
}

export async function eliminarActividad (id){
  const response3 = await fetch(`${variableEliminarActividad}/${id}`, {
    method: "DELETE",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    
  });
  if(response3.ok){
    Swal.fire({
      title: 'Actividad eliminada',
      icon: 'success',
    }).then(() => {
      window.location.href = '/mostrarActividades';
    });   
  }else {
    await Swal.fire({
      title: "Error",
      text: "Ocurrió un error al eliminar la actividad",
      icon: "error",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    });
  }
}

