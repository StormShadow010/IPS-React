import logo from '../../../Images/logo.png'
import './style.scss'
import { BsPersonCircle } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import React, { useContext, useState } from 'react';

export const NavbarAdmin = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className='NavbarContainerComponentAdm'>
            <div className='stylelogoAdm'>
                <img src={logo} alt="logo" style={{ marginLeft: '1em' }} onClick={() => navigate('/')} />
                <p className='stylepAdm'>SISALUD</p>
            </div>
            <div className={`stylelinkAdm ${menuOpen ? 'open' : ''}`}>
                <Link to='/usuarios'>
                    <h2 className='styleh2Adm'>Gestion de usuario</h2>
                </Link>
                <Link to='/reportes'>
                    <h2 className='styleh2Adm'>Reportes</h2>
                </Link>
                <Link to='/administrador'>
                    <h2 className='styleh2Adm'>Supervisores</h2>
                </Link>
                <Link to='/adminauxiliar'>
                    <h2 className='styleh2Adm'>Asignacion auxiliares</h2>
                </Link>
            </div>
            <div style={{ display: 'flex', margin: '1em', alignSelf: 'flex-end', color: 'white' }}>
                <BsPersonCircle size={30} onClick={() => navigate('/login')} />
            </div>
            <button className="navbar-toggle" onClick={toggleMenu}>
                <span className="navbar-toggle-bar"></span>
                <span className="navbar-toggle-bar"></span>
                <span className="navbar-toggle-bar"></span>
            </button>
        </div>
    )
}