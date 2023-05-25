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
import NuevaActividadDevengamiento, { action as actionActividadDevengamiento } from '../src/pages/NuevaActividadDevengamiento'
import EditarActividades, {
    loader as loaderEditar
} from '../src/pages/EditarActividades'
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
                loader: loaderEditar,

            },
            {
                path: "/actividades/:actividadId/eliminar",
                action: eliminarActividadAction
            },
            {
                path: "/periodos/:idPersona/ver",
                element: <VerPeriodos />
            },
            {
                path: "/solicitudRegistroDevengamiento",
                element: <SolicitudRegistroDevengamiento />
            },
            {
                path: "/nuevoDocente",
                element: <NuevoDocente />
            },
            {
                path: "/revisarValidar",
                element: <RevisarValidar />
            },
            {
                path: "/abrirCerrarPeriodos",
                element: <AbrirCerrarPeriodos />
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
