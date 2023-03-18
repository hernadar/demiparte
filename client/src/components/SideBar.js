import React from 'react';
import {Link} from 'react-router-dom';



function SideBar(){
    return(
        <React.Fragment>
            {/*<!-- Sidebar -->*/}
            <ul className="navbar-nav bg-gradient-secondary sidebar sidebar-dark accordion" id="accordionSidebar">

                {/*<!-- Sidebar - Brand -->
                <a className="sidebar-brand d-flex align-items-center justify-content-center" href="/">
                    
                    <div className="sidebar-brand-icon sidebar-dark  p-3 ">
                        <img className="w-100" src={image} alt="Recomendame"/>
                    </div>
                </a>

                {/*<!-- Divider -->*/}
                {/*<hr className="sidebar-divider my-0"/>*/}

                {/*<!-- Nav Item - Dashboard -->*/}
                <li className="nav-item active">
                    <Link className="nav-link" to="/">
                       
                        <span>Acciones</span></Link>
                </li>

                {/*<!-- Divider -->*/}
                <hr className="sidebar-divider"/>

                {/*<!-- Heading -->*/}
                <div className="sidebar-heading"></div>

                {/*<!-- Nav Item - Home -->*/}
                <li className="nav-item">
                    <Link className="nav-link collapsed" to="/">
                    <i className="fas fa-home"></i>
                        <span>Home</span>
                    </Link>
                </li>

                {/*<!-- Nav Item - Companies -->*/}
                <li className="nav-item">
                    <Link className="nav-link" to="/companies">
                    <i className="fas fa-fw fa-table"></i>
                        <span>Empresas</span></Link>
                </li>

                {/*<!-- Nav Item - Stadistics -->*/}
                <li className="nav-item">
                    <Link className="nav-link" to="/">
                    <i className="fas fa-chart-bar"></i>
                        <span>Estadisticas</span></Link>
                </li>
                 {/*<!-- Nav Item - About -->*/}
                 <li className="nav-item">
                    <Link className="nav-link" to="/">
                    <i className="fas fa-users"></i>
                        <span>Nosotros</span></Link>
                </li>
                    {/*<!-- Nav Item - Contact -->*/}
                    <li className="nav-item">
                    <Link className="nav-link" to="/">
                    <i className="fas fa-comment"></i>
                        <span>Contacto</span></Link>
                </li>

                {/*<!-- Divider -->*/}
                <hr className="sidebar-divider d-none d-md-block"/>
            </ul>
            {/*<!-- End of Sidebar -->*/}
        

            

        </React.Fragment>
    )
}



export default SideBar;