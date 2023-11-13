import React, { useState, useContext, useEffect } from 'react'
import { Table, Button, Modal, Input, Row, Col, Form, Select, Popconfirm } from 'antd';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { SearchOutlined } from "@ant-design/icons"
import "./style.scss"
import { NavbarAdmin } from '../NavbarAdmin';
import { addData, getData, editData, deleteData } from "../../../controller/control"
import { AppContext } from '../../../Provider';

const { Option } = Select

export default function GestUser() {
    //Forms to control diferent modals
    const [formNewUser] = Form.useForm();
    const [formUpdateUser] = Form.useForm();

    //Id for updating specific user
    const [idEdit, setIdEdit] = useState(null)

    //Control form and update user
    const [isEditing, setisEditing] = useState(false)

    //Control for creating new user
    const [isAddNewUser, setisAddNewUser] = useState(false)

    //Global state
    const [state, setState] = useContext(AppContext)

    //Data people
    const [dataSource, setDataSource] = useState([]);
    const [dataSupervisor, setDataSupervisor] = useState([]);

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Usuario',
            dataIndex: 'user',
            key: 'user',
            editable: true,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
                return (
                    <>
                        <Input
                            autoFocus
                            placeholder='Escribe aquí'
                            onPressEnter={() => { confirm() }}
                            onBlur={() => { confirm() }}
                            value={selectedKeys[0]}
                            onChange={(e) => {
                                setSelectedKeys(e.target.value ? [e.target.value] : [])
                                confirm({ closeDropdown: false })
                            }}
                        ></Input>
                    </>
                )
            },
            filterIcon: () => { return (<SearchOutlined />) },
            onFilter: (value, record) => { return record.user.toLowerCase().includes(value.toLowerCase()) },
        },
        {
            title: 'Contraseña',
            dataIndex: 'pass',
            key: 'pass',
        },
        {
            title: 'Roll',
            dataIndex: 'roll',
            key: 'roll',
        },
        {
            title: 'Acciones',
            dataIndex: 'actions',
            key: 'actions',
            render: (_, record) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <FiEdit onClick={() => editUser(record)} />
                        <Popconfirm title="Seguro deseas borrarlo?" onConfirm={() => deleteUser(record._id)}>
                            <FiTrash2 />
                        </Popconfirm>
                    </div >
                );
            }
        },
    ];

    //Delete specific user
    const deleteUser = async (id) => {
        const data = await deleteData(`https://api.clubdeviajeros.tk/api/users/${id}`, state?.token)
        if (data === 200) getUsers()
    }

    //Update info from user
    const editUser = (user) => {
        formUpdateUser.setFieldsValue(user);
        setisEditing(true)
        setIdEdit(user._id)
    }

    const getUsers = async () => {
        const getConstdata = await getData("https://api.clubdeviajeros.tk/api/users", state?.token)
        setDataSource(getConstdata);
    }

    useEffect(() => {
        getUsers()
        getSupervisor()
        // eslint-disable-next-line
    }, [])

    //Create new user
    const createNewUser = async (values) => {
        setisAddNewUser(false);
        const data = await addData(values, "https://api.clubdeviajeros.tk/api/users", state?.token)
        data._id ? getUsers() : console.log(data)
    };

    //Update user
    const updateUser = async (values) => {
        const data = await editData(values, `https://api.clubdeviajeros.tk/api/users/${idEdit}`, state?.token)
        if (data === "ok") { setisEditing(false); getUsers() }
    }

    //Obtención de los supervisores
    const getSupervisor = async () => {
        const getConstdataSup = await getData("https://api.clubdeviajeros.tk/api/supervisor", state?.token)
        setDataSupervisor(getConstdataSup);
        console.log(getConstdataSup)
    }

    return (
        <div>
            <NavbarAdmin />
            <div className='containeruser'>
                <div style={{ width: '100%' }}>
                    <Row style={{ display: 'flex', justifyContent: 'center', padding: '0 1em' }}>
                        <Col className='tableUser'>
                            <Button style={{ marginBottom: '2rem' }} onClick={() => { setisAddNewUser(true) }}>Agregar un nuevo usuario</Button>
                            <Table columns={columns} dataSource={dataSource} rowKey="_id" />
                            {/* Modal para la creación de usuarios */}
                            <Modal
                                title="Creación de usuario"
                                open={isAddNewUser}
                                onCancel={() => setisAddNewUser(false)}
                                footer={[
                                    <Button key="cancel" onClick={() => setisAddNewUser(false)}>
                                        Cancelar
                                    </Button>,
                                    <Button key="create" type="primary" onClick={() => { formNewUser.submit() }}>
                                        Crear
                                    </Button>,
                                ]}>
                                <Form form={formNewUser} onFinish={createNewUser}>
                                    <Form.Item name="name" label="Nombre">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="user" label="Usuario">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="pass" label="Contraseña">
                                        <Input.Password />
                                    </Form.Item>
                                    <Form.Item name="roll" label="Roll">
                                        <Select
                                            options={[
                                                {
                                                    value: 'Administrador',
                                                    label: 'Administrador',
                                                },
                                                {
                                                    value: 'auxiliar',
                                                    label: 'Auxiliar',
                                                },
                                                {
                                                    value: 'revisor',
                                                    label: 'Revisor',
                                                }
                                            ]} />
                                    </Form.Item>
                                </Form>
                            </Modal>
                            {/* Modal for updating users */}
                            <Modal
                                title="Actualización de usuario"
                                open={isEditing}
                                onCancel={() => setisEditing(false)}
                                footer={[
                                    <Button key="cancel" onClick={() => setisEditing(false)}>
                                        Cancelar
                                    </Button>,
                                    <Popconfirm title="Seguro deseas editar?" onConfirm={() => { formUpdateUser.submit() }}>
                                        <Button key="update" type="primary" >
                                            Actualizar
                                        </Button>
                                    </Popconfirm>,
                                ]}>
                                <Form form={formUpdateUser}
                                    onFinish={updateUser}>
                                    <Form.Item name="name" label="Nombre">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="user" label="Usuario">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="pass" label="Contraseña">
                                        <Input.Password name="pass" />
                                    </Form.Item>
                                    <Form.Item name="roll" label="Roll">
                                        <Select
                                            options={[
                                                {
                                                    value: 'Administrador',
                                                    label: 'Administrador',
                                                },
                                                {
                                                    value: 'auxiliar',
                                                    label: 'Auxiliar',
                                                },
                                                {
                                                    value: 'revisor',
                                                    label: 'Revisor',
                                                }
                                            ]} />
                                    </Form.Item>
                                </Form>
                            </Modal>
                        </Col>
                    </Row>
                </div>
            </div>
        </div >
    )
}