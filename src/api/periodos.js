const variableObtenerPeriodos = "https://accrualback.up.railway.app/period/findAllWithDetails";

export async function obtenerPeriodosAPI(token) {
    try {
        const response = await fetch(`${variableObtenerPeriodos}`, {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const data1 = await response.json();
        return data1;
    } catch (error) {
        console.log(error);
    }
}