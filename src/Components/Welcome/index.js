import React from 'react'
import "./style.scss"
import { Navbar } from './../Navbar';

export default function Welcome() {
    return (
        <div>
            <Navbar />
            <div className='container'>
                <h2 className='styleh2'>BIENVENIDOS A SISALUD</h2>
            </div>
        </div>
    )
}