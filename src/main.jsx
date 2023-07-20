import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import { createHashRouter, RouterProvider } from "react-router-dom"
import Layout from '../src/components/Layout'
import Login, { action as actionLogin } from '../src/pages/Login'
import Home from './pages/Home'
import SolicitudRegistroDevengamiento from '../src/pages/SolicitudRegistroDevengamiento'
import NuevoDocente from './pages/NuevoDocente'
import RevisarValidar from './pages/RevisarValidar'
import AbrirCerrarPeriodos from './pages/AbrirCerrarPeriodos'
import MostrarDatosDocente from '../src/components/MostrarDatosDocente'
<<<<<<< HEAD
import CambiarModo from './pages/CambiarModo'
=======
>>>>>>> 974ac2f9657ca7da3fe4df3767cb7f990a9233ac
import NuevaActividadDevengamiento, { action as actionActividadDevengamiento } from '../src/pages/NuevaActividadDevengamiento'
import EditarActividades, {
    loader as loaderEditar
} from '../src/pages/EditarActividades'

import DocentesRegistroSistema from '../src/pages/DocentesRegistroSistema'
import MostrarActividades from "../src/components/MostrarActividades"
import ErrorPage from '../src/components/ErrorPage'
import { action as eliminarActividadAction } from '../src/components/MostrarActividades'
import VerPeriodos from './pages/VerPeriodos'

const router = createHashRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Login />,
                action: actionLogin,
                errorElement: <ErrorPage />
            },
            {
                path: "/datosDocente",
                element: <MostrarDatosDocente />,
                errorElement: <ErrorPage />
            },
            {
                path: "/nuevaActividad",
                element: <NuevaActividadDevengamiento />,
                action: actionActividadDevengamiento,
                errorElement: <ErrorPage />

            },
            {
                path: "/MostrarActividades",
                element: <MostrarActividades />,
                errorElement: <ErrorPage />
            },
            {
                path: "/actividades/:actividadId/editar",
                element: <EditarActividades />,
                errorElement: <ErrorPage />,
                loader: loaderEditar,

            },
            {
                path: "/actividades/:actividadId/eliminar",
                action: eliminarActividadAction,
                errorElement: <ErrorPage />
            },
            {
                path: "/periodos/:idPersona/ver",
                element: <VerPeriodos />,
                errorElement: <ErrorPage />
            },
            {
<<<<<<< HEAD
                path: "/periodos/:idPeriodo/cambiarModo",
                element: <CambiarModo />,
                errorElement: <ErrorPage />
            },
            {
=======
>>>>>>> 974ac2f9657ca7da3fe4df3767cb7f990a9233ac
                path: "/solicitudRegistroDevengamiento",
                element: <SolicitudRegistroDevengamiento />,
                errorElement: <ErrorPage />
            },
            {
                path: "/nuevoDocente",
                element: <NuevoDocente />,
                errorElement: <ErrorPage />
            },
            {
                path: "/revisarValidar",
                element: <RevisarValidar />,
                errorElement: <ErrorPage />
            },
            {
                path: "/abrirCerrarPeriodos",
                element: <AbrirCerrarPeriodos />,
                errorElement: <ErrorPage />
            },
            {
                path: "/verDocentesRegistroSistema",
                element: <DocentesRegistroSistema />,
                errorElement: <ErrorPage />
            }

        ]
    },
    {
        path: "/index",
        element: <Home />
    }

])

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
