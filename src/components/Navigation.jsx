import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const token = sessionStorage.getItem("token");
const variableFiniquito = "https://accrual.up.railway.app/accrualData/settlement";
const idPersona = sessionStorage.getItem("idPersona")

function Navigation() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

function cerrar(){
  sessionStorage.clear();
  localStorage.clear();
  window.location.href = "/"
}

  async function handleSubmit() {
    try {
      const respuesta = await fetch(
        `${variableFiniquito}/${idPersona}`,
        {
          method: "PATCH",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(
            "true"),
        }
      );
      await respuesta.json();
      if (respuesta.ok) {
      
        await Swal.fire({
          title: "Enviado",
          text: "La solicitud ha sido enviada correctamente",
          icon: "success",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "OK",
        });
        handleClose();
      } else {
        await Swal.fire({
          title: "Error",
          text: "Ocurrió un error al enviar la solicitud",
          icon: "error",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.log(error);
      await Swal.fire({
        title: "Error",
        text: "Ocurrió un error al enviar la solicitud",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    }
  }
  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Container className="m-0">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link to="/index" className="nav-link">Inicio</Link>

              <Link to="/datosDocente" className="nav-link">Datos Docente</Link>

              <NavDropdown title="Plan Devengamiento" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={handleShow}>
                  Solicitud de Finiquito
                </NavDropdown.Item>
              </NavDropdown>
              <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Solicitud de acta de finiquito</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>
                    Cuando se solicita un finiquito, no se podrá ya registrar
                    más actividades al periodo actual.
                  </p>

                  <p>
                    Ten en cuenta que una vez solicitado el finiquito, se
                    revisará todos los planes y actividades registradas.
                  </p>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
                  <Button variant="primary" onClick={handleSubmit}>Enviar Solicitud</Button>
                </Modal.Footer>
              </Modal>
              <NavDropdown
                title="Actividad Devengamiento"
                id="basic-nav-dropdown"
              >
                <Link to="/nuevaActividad" className="dropdown-item">Nueva Actividad</Link>
                <Link to="/MostrarActividades" className="dropdown-item">Mostrar Actividades</Link>
              </NavDropdown>
              <Nav.Link onClick={cerrar}>Cerrar Sesión</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default Navigation;
