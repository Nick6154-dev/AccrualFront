import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from './components/Layout'
import Login, {action as actionLogin} from './pages/Login'
import Index from './pages/Home'
import MostrarDatosDocente from './components/MostrarDatosDocente'
import NuevaActividadDevengamiento, {action as actionActividadDevengamiento} from './pages/NuevaActividadDevengamiento'
import EditarActividades , {loader as editarActividadesLoader, action as actionEditarActividades} from './pages/EditarActividades'
import MostrarActividades from "./components/MostrarActividades"
import ErrorPage from './components/ErrorPage'
import {action as eliminarActividadAction} from  './components/MostrarActividades'
const router = createBrowserRouter([
 
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Login />,
        action: actionLogin,
        errorElement: <ErrorPage/>
      },
    {
      path:"/index",
      element: <Index/>
    },
    {
      path: "/datosDocente",
      element : <MostrarDatosDocente/>,
      errorElement: <ErrorPage/>
    },
    {
      path: "/nuevaActividad",
      element : <NuevaActividadDevengamiento/>,
      action: actionActividadDevengamiento,
      errorElement: <ErrorPage/>

    },
    {
      path: "/MostrarActividades",
      element : <MostrarActividades/>,
      errorElement: <ErrorPage/>
    },{
      path:"/actividades/:actividadId/editar",
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
    
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <RouterProvider router={router} />
  </React.StrictMode>
);
