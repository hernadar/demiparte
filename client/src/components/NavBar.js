
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import image from '../assets/images/app/demiparte.png';
import {Link} from 'react-router-dom';

function NavbarDark() {

  const [user, setUser] = useState([])

useEffect(() => {

		// recupero el Id de usuario de la sesión para buscar el resto de datos del usuario
		let userId = sessionStorage.getItem('userId')
		// Verifico si aún no se ha solicitado los datos de usuario y los solicito        
		if (user.length === 0) {
			fetch('/api/users/profile/' + userId)
				.then(response => response.json())
				.then(usuario => {
					setUser(usuario.data)
				})
				.catch((err) => {
					console.log(err)
				})
		}
	}, [user.length])



      
   
  return (
   <>
   <Navbar  expand="lg">
      <Container fluid>
        <Navbar.Brand href='/'><img width={200} src={image} alt="demiparte"/></Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-dark" />
        <Navbar.Collapse id="navbar-dark">
          <Nav>
          
           { sessionStorage.userId && (
           <>
            {  (sessionStorage.userPrivilege==='2' || sessionStorage.userPrivilege==='3') && 
              <Link className="nav-link navbar-dark  collapsed " to="/companies/register">
                  Crear Empresa
              </Link>
            } 
           <NavDropdown
              id="nav-dropdown-dark-example"
              title={(sessionStorage.userImage && user.length !==0)  &&  <span>
                <img src={user[0].image} width="40" className="img-profile rounded-circle" alt='Foto de perfin mini' />
              </span>}
              menuVariant="dark"
            >
              <Link className="nav-link navbar-dark  collapsed " to="/users/profile">Mi Perfil</Link>
              <NavDropdown.Divider />
              <Link className="nav-link navbar-dark  collapsed " to="/users/logout">
                Logout
                </Link>
            </NavDropdown>
            
            </>
            )}
            { !sessionStorage.userId && (
              <>
            <Link className="nav-link navbar-dark  collapsed " to="/users/login">
                Iniciar Sesion
            </Link>
            <Link className="nav-link navbar-dark  collapsed "  to="/users/register">
                Registrarse
            </Link>
            </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    </>
  );
}

export default NavbarDark;