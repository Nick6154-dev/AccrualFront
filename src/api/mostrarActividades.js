const variableObtenerActividades = "https://accrualback.up.railway.app/activityPlanAccrual/byPlan";
export async function obtenerActividadesAPI(token, idPersona, idPeriodo) {
    try {
        const response1 = await fetch(
          `${variableObtenerActividades}/${idPersona},${idPeriodo}`,
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
        return dataActividades;
    } catch (error) {
        console.log(error);
    }
}