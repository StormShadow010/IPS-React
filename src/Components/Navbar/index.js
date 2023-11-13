import logo from '../../Images/logo.png'
import './style.scss'
import { BsPersonCircle } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
    const navigate = useNavigate();

    return (
        <div className='NavbarContainerComponent'>
            <img src={logo} alt="logo" style={{ marginLeft: '4em' }} />
            <p className='stylep'>SISALUD</p>
            <div style={{ display: 'flex', marginRight: '4em', color: 'white' }}>
                <BsPersonCircle size={30} onClick={() => navigate('/login')} className='icon'/>
            </div>
        </div >
    )
}
