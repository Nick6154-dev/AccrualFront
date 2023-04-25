import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import { createHashRouter, RouterProvider} from "react-router-dom"
import Layout from '../src/components/Layout'
import Login, {action as actionLogin} from '../src/pages/Login'
import Home from './pages/Home'
import MostrarDatosDocente from '../src/components/MostrarDatosDocente'
import NuevaActividadDevengamiento, {action as actionActividadDevengamiento} from '../src/pages/NuevaActividadDevengamiento'
import EditarActividades, {
    loader as editarActividadesLoader,
    action as actionEditarActividades
} from '../src/pages/EditarActividades'
import MostrarActividades from "../src/components/MostrarActividades"
import ErrorPage from '../src/components/ErrorPage'
import {action as eliminarActividadAction} from '../src/components/MostrarActividades'

const router = createHashRouter([
    {
        path: "/",
        element: <Layout/>,
        children: [
            {
                index: true,
                element: <Login/>,
                action: actionLogin,
                errorElement: <ErrorPage/>
            },
            {
                path: "/datosDocente",
                element: <MostrarDatosDocente/>,
                errorElement: <ErrorPage/>
            },
            {
                path: "/nuevaActividad",
                element: <NuevaActividadDevengamiento/>,
                action: actionActividadDevengamiento,
                errorElement: <ErrorPage/>

            },
            {
                path: "/MostrarActividades",
                element: <MostrarActividades/>,
                errorElement: <ErrorPage/>
            }, {
                path: "/actividades/:actividadId/editar",
                element: <EditarActividades/>,
                loader: editarActividadesLoader,
                action: actionEditarActividades,
                errorElement: <ErrorPage/>
            },
            {
                path: "/actividades/:actividadId/eliminar",
                action: eliminarActividadAction
            }
        ] 
    },
        {
            path: "/index",
            element: <Home/>
        }  
    
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);
