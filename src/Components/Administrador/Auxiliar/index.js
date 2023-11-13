import React, { useState, useContext, useEffect } from 'react'
import "./style.scss"
import { NavbarAdmin } from '../NavbarAdmin';
import { useNavigate } from 'react-router-dom';
import { Form, Modal, Button, Input, Row, Col, Popconfirm, Table, Select } from 'antd';
import { getData, editData, deleteData } from "../../../controller/control"
import { AppContext } from '../../../Provider';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { FcPrevious } from 'react-icons/fc'

const { Option } = Select

export default function AdminAuxiliar() {

    //Id for updating specific supervisor 
    const [idEdit, setIdEdit] = useState(null)

    //Forms to control diferent modals
    const [formUpdateAuxiliar] = Form.useForm();
    const [form] = Form.useForm();

    //Estados para el control de las modales
    //Modal para la actualización de los supervisores
    const [isEditing, setisEditing] = useState(false)
    const [idAuxiliar, setIdAuxiliar] = useState("")
    //Global state
    const [state, setState] = useContext(AppContext)

    //Navegación a la página acorde a los supervisores
    const navigate = useNavigate();

    //Data auxiliares
    const [dataSource, setDataSource] = useState([]);

    //Obtención de los supervisores
    const getUsers = async () => {
        const getConstdata = await getData("https://api.clubdeviajeros.tk/api/users", state?.token)
        console.log(getConstdata)
        const filteredData = getConstdata.filter(item => item.roll.toLowerCase() === "auxiliar")
        setDataSource(filteredData)
    }

    useEffect(() => {
        getUsers()
        console.log(dataSource)
    }, [0])

    const columns = [
        {
            title: 'Nombre del auxiliar',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Acciones',
            dataIndex: 'actions',
            key: 'actions',
            render: (_, record) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <FiEdit onClick={() => {
                            editAuxiliar(record)
                            form.resetFields()
                        }} />
                        <Popconfirm title="Seguro deseas borrarlo?" onConfirm={() => deleteAuxiliar(record._id)}>
                            <FiTrash2 />
                        </Popconfirm>
                    </div >
                );
            }
        }
    ]

    //Borrar auxiliar
    const deleteAuxiliar = async (auxiliar) => {
        const data = await deleteData(`https://api.clubdeviajeros.tk/api/users/${auxiliar}`, state?.token)
        if (data === 200) getUsers()
    }

    const editAuxiliar = (auxiliar) => {
        setisEditing(true)
        formUpdateAuxiliar.setFieldsValue(auxiliar);
        setIdEdit(auxiliar._id)
    }

    const updateAuxiliar = async (values) => {
        form.resetFields()
        const data = await editData(values, `https://api.clubdeviajeros.tk/api/users/${idEdit}`, state?.token)
        if (data === "ok") { setisEditing(false); getUsers() }
    }

    return (
        <div>
            <NavbarAdmin />
            <div>
                <FcPrevious size={35} onClick={() => navigate(-1)} className='backArrow' />
            </div>
            <Row className='styledRow'>
                <Col
                    className='styledColAuxiliar'
                    xs={{ span: 20, offset: 2 }} md={{ span: 10, offset: 3 }} lg={{ span: 5, offset: 2 }}>
                    <Form
                        layout="vertical">
                        <Form.Item
                            label='Seleccione un auxiliar'
                        >
                            <Select
                                style={{ width: '100%' }}
                                onChange={(e) => setIdAuxiliar(e)}
                            >
                                {dataSource.map((read, index) => (
                                    <Option
                                        key={index}
                                        value={read._id}>{read.name}
                                    </Option>))}
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button type='primary' onClick={() => idAuxiliar.length > 0 ? navigate(`/asignacionsupervisor/${idAuxiliar}`) : ""}> Siguiente</Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
            <Row style={{ display: 'flex', justifyContent: 'center', padding: '0 1em' }}>
                <Col className='tableUser'>
                    <Table columns={columns} dataSource={dataSource} rowKey="_id" />
                </Col>
            </Row>
            <Modal
                title="Actualización del nombre del supervisor"
                open={isEditing}
                onCancel={() => {
                    setisEditing(false)
                    form.resetFields()
                }}
                footer={[
                    <Button key="cancel" onClick={() => {
                        setisEditing(false)
                        form.resetFields()
                    }}>
                        Cancelar
                    </Button>,
                    <Button key="create" type="primary" onClick={() => { formUpdateAuxiliar.submit() }}>
                        Editar
                    </Button>,
                ]}>
                <Form form={formUpdateAuxiliar} onFinish={updateAuxiliar}>
                    <Form.Item name="name" label="Nombre del auxiliar:">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div >
    )
}
