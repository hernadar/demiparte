import React from 'react';
import foto from '../assets/images/avatars/user.png';
import {Link} from 'react-router-dom';


function TopBar() {
	return (
		<React.Fragment>
				{/*<!-- Topbar -->*/}
				<nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

					{/*<!-- Sidebar Toggle (Topbar) -->*/}
					<button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
						<i className="fa fa-bars"></i>
					</button>

					{/*<!-- Topbar Navbar -->*/}
					<ul className="navbar-nav ml-auto">

						{/*<!-- Nav Item - Alerts -->*/}
						<li className="nav-item dropdown no-arrow mx-1">
							<a className="nav-link dropdown-toggle" href="/" id="alertsDropdown">
								<i className="fas fa-bell fa-fw"></i>
								{/*<!-- Counter - Alerts -->*/}
								<span className="badge badge-danger badge-counter">3+</span>
							</a>
						</li>

						
						<div className="topbar-divider d-none d-sm-block"></div>

						{/*<!-- Nav Item - User Information -->*/}
						{/*<!-- Nav Item - Registrarse -->*/}
						<li className="nav-item ">
                    		<Link className="nav-link" to="/user/register">
                    		<span>Registrarse</span></Link>
               			</li>
						{/*<!-- Nav Item - Login -->*/}
						<li className="nav-item">
                    		<Link className="nav-link" to="/user/login">
                    		<span>Loguearse</span></Link>
               			</li>
						{/* <li className="nav-item dropdown no-arrow">
							<a className="nav-link dropdown-toggle" href="/" id="userDropdown">
								<span className="mr-2 d-none d-lg-inline text-gray-600 small"></span>
								<img className="img-profile rounded-circle" src={foto} alt="Jordan Walke - Creador de React" width="60"/>
							</a>
						</li> */}
						<ul className="navbar-nav align-items-center">
				{/* Pregunto por a varable local si está logueado si lo está hace lo que sigue */}
					<li className="nav-item dropdown">
						<a className="nav-link dropdown-toggle" href="/" id="dropUser" role="button" data-bs-toggle="dropdown" aria-expanded="false">
							<img src={foto} width="40" className="img-profile rounded-circle" alt='Foto de perfin mini'/>
							Hi {/*<%= locals.userLogged.fullName %> */} 
						</a>
						<ul className="dropdown-menu" aria-labelledby="navbarDropdown">
							<a className="dropdown-item" href="/user/profile">My profile</a>
							<li><hr className="dropdown-divider"/></li>
							<a className="dropdown-item" href="/user/logout">Logout</a>
						</ul>
					</li>
				{/* Sin no está logueado agraga los item de Registro y Logueo */}
					<li className="nav-item"><a className="nav-link" href="/user/register">Register</a></li>
					<li className="nav-item"><a className="nav-link" href="/user/login">Login</a></li>
				
			</ul>

					</ul>

				</nav>
				{/*<!-- End of Topbar -->*/}

		</React.Fragment>
	)
}
export default TopBar;