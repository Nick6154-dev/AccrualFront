import Swal from "sweetalert2";
const varibaleExcelDatosD = "https://accrualback.up.railway.app/validator/generateDocentInformationExcel";

export async function downloadDatosDocentes(token, idPerson, nombre, apellido) {
    const respuestaExcel = await fetch(`${varibaleExcelDatosD}/${idPerson}`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al generar el archivo Excel');
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `DATOS_${nombre} ${apellido}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            Swal.close();
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error',
                text: 'Ha ocurrido un error al generar el archivo Excel.',
                icon: 'error',
            });
        });
}