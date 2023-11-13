import React, { useContext } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import logo from '../../Images/logo.png'
import './style.scss'
import { FiLock, FiUser } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

import { loginData } from "../../controller/control"
import { AppContext } from '../../Provider';


function Login() {

    //Estado para veriicar si entro un administrador
    const [state, setState] = useContext(AppContext)

    //Validar usuario que ingresa
    const datosLogin = async (value) => {
        const data = await loginData(value, "https://api.clubdeviajeros.tk/api/users/login")
        console.log(data)
        if (data.length > 0) {
            setState({ user: data[0], token: data[1].token })
            navigate(`/${data[0].roll.toLowerCase()}`)
        } else {
            alert("Login failed, user or pass is incorrect")
            navigate('/login')
        }
    };

    const navigate = useNavigate();

    return (
        <div className='container'>
            <div style={{ width: '100%' }}>
                <Row style={{ display: 'flex', justifyContent: 'center', padding: '0 1em' }}>
                    <Col className='loginform' xs={{ span: 20, offset: 2 }} md={{ span: 10, offset: 3 }} lg={{ span: 6, offset: 10 }} style={{ margin: '0 2em' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', margin: '1em 0' }}>
                            <img src={logo} alt='logo' />
                        </div>
                        <div>
                            <Form
                                onFinish={datosLogin}
                                name="basic"
                                layout="vertical"
                                autoComplete="off"
                            >
                                <Form.Item
                                    name='user'
                                    rules={[{ required: true, message: 'Por favor diligencie su usuario!' }]}
                                    size='large'
                                    label='Usuario:'

                                >
                                    <Input prefix={<FiUser />} placeholder="Escribe tu usuario" />
                                </Form.Item>
                                <Form.Item
                                    name='pass'
                                    rules={[{ required: true, message: 'Por favor diligencie su contraseña!' }]}
                                    size='large'
                                    label='Contraseña:'
                                >
                                    <Input.Password prefix={<FiLock />} placeholder="Escribe tu contraseña" />
                                </Form.Item>
                                <Form.Item >
                                    <Button
                                        type='primary'
                                        htmlType="submit"
                                        className='estilobotoningresar'
                                        style={{ margin: '1em 0' }}
                                    >
                                        Ingresar
                                    </Button>
                                    <Button type='default' className='estilobotoncancelar'>
                                        Cancelar
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Login;