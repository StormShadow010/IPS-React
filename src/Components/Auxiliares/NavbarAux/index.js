import logo from '../../../Images/logo.png'
import './style.scss'
import { BsPersonCircle } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import React, { useState } from 'react';

export const NavbarAux = () => {

    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className='NavbarContainerComponentAux'>
            <div className='stylelogoAux'>
                <img src={logo} alt="logo" style={{ marginLeft: '1em' }} onClick={() => navigate('/')} />
                <p className='stylepAux'>SISALUD</p>
            </div>
            <div className={`stylelinkAux ${menuOpen ? 'open' : ''}`}>
                <Link to='/auxiliar'>
                    <h2 className='styleh2Aux'>Grupos de riesgo</h2>
                </Link>
                <Link to='/agenda'>
                    <h2 className='styleh2Aux'>Agenda</h2>
                </Link>
                <Link to='/reporteseguimiento'>
                    <h2 className='styleh2Aux'>Reportes</h2>
                </Link>
            </div>
            <div style={{ display: 'flex', margin: '1em', alignSelf: 'flex-end', color: 'white' }}>
                <BsPersonCircle size={30} onClick={() => navigate('/login')} className='icon' />
            </div>
            <button className="navbar-toggle" onClick={toggleMenu}>
                <span className="navbar-toggle-bar"></span>
                <span className="navbar-toggle-bar"></span>
                <span className="navbar-toggle-bar"></span>
            </button>
        </div>
    )
}