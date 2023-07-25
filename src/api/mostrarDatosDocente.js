const variableActualizarDatosGenerales = "https://accrualback.up.railway.app/docent/updateCategoryModalityDocent";

const variableAgregarDatosDevengamiento = "https://accrualback.up.railway.app/accrualData/save";

const variableActualizarDatosDevengamiento = "https://accrualback.up.railway.app/accrualData/update";

const variableAgregarDatosRedes ="https://accrualback.up.railway.app/network/save"

const variableActualizarRedes = "https://accrualback.up.railway.app/network/update"

export async function actualizarDatosGeneralesAPI(idPerson, token, datos) {
    try {
        const respuestaActualizar = await fetch(
            `${variableActualizarDatosGenerales}/${idPerson}`,
            {
                method: "PATCH",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(datos),
            }
        );

        return respuestaActualizar;
    } catch (error) {
        console.log(error);
    }
}

export async function agregarDatosDevengamientoAPI(idPerson, token, datosDevengamiento) {
    try {
        const respuestaAgregar = await fetch(
            `${variableAgregarDatosDevengamiento}/${idPerson}`,
            {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(datosDevengamiento),
            }
        );

        return respuestaAgregar;
    } catch (error) {
        console.log(error);
    }
}

export async function actualizarDatosDevengamientoAPI(idAccrualData, token, datosDevengamiento) {
    try {
        const respuestaActualizar = await fetch(
            `${variableActualizarDatosDevengamiento}/${idAccrualData}`,
            {
                method: "PUT",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(datosDevengamiento),
            }
        );
        return respuestaActualizar
    } catch (error) {
        console.log(error);
    }
}

export async function agregarDatosRedesAPI(idPerson, token, datos) {
    try {
        const respuestaAgregar = await fetch(
            `${variableAgregarDatosRedes}/${idPerson}`,
            {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(datos),
            }
        );

        return respuestaAgregar;
    } catch (error) {
        console.log(error);
    }
}

export async function actualizarDatosRedesAPI(idAccrualData, token, datos) {
    try {
        const respuestaActualizar = await fetch(
            `${variableActualizarRedes}/${idAccrualData}`,
            {
                method: "PUT",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(datos),
            }
        );
        return respuestaActualizar
    } catch (error) {
        console.log(error);
    }
}
