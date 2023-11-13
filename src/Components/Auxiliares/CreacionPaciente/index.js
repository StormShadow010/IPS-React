import React, { useState, useContext, useEffect } from 'react'
import "./style.scss"
import { Form, Modal, Button, Input, Row, Col, Popconfirm, Table, Select } from 'antd';
import { addData, getData, editData, deleteData } from "../../../controller/control"
import { AppContext } from '../../../Provider';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import { FcPrevious, FcReading } from 'react-icons/fc'
import { NavbarAux } from '../NavbarAux';

const { Option } = Select

export default function CreacionPaciente() {

    let { id } = useParams()

    //Id for updating specific supervisor 
    const [idEdit, setIdEdit] = useState(null)

    //Forms to control diferent modals
    const [formUpdatePaciente] = Form.useForm();
    const [formPersonal] = Form.useForm();

    //Estados para el control de las modales
    //Modal para creación de los supervisores
    const [isModalVisible, setIsModalVisible] = useState(false);
    //Modal para la actualización de los supervisores
    const [isEditing, setisEditing] = useState(false)
    const [idPaciente, setIdPaciente] = useState("")
    //Global state
    const [state, setState] = useContext(AppContext)

    //Navegación a la página acorde a los supervisores
    const navigate = useNavigate();

    // Data preguntas personales
    const [dataSourcePersonales, setDataSourcePersonales] = useState([]);

    //Data pacientes
    const [dataSource, setDataSource] = useState([]);

    //Obtención de las preguntas
    const getQuestions = async () => {
        const getConstdata = await getData(`https://api.clubdeviajeros.tk/api/questions/${id}`, state?.token)
        const filteredDataPersonales = getConstdata.filter(item => item.tipo === "personal")
        setDataSourcePersonales(filteredDataPersonales);
    }

    //Obtención de los pacientes
    const getPaciente = async () => {
        const getConstdata = await getData(`https://api.clubdeviajeros.tk/api/personal/${id}`, state?.token)
        setDataSource(getConstdata)
        console.log(getConstdata)
    }

    // Creacion de pacientes
    const sendPersonal = async (values) => {
        values.id_aux = state.user._id;
        const sendData = await addData({ id_riesgo: id, values }, `https://api.clubdeviajeros.tk/api/personal`, state?.token)
        console.log(sendData)
        if (sendData) getPaciente()
        formPersonal.resetFields()
    }
    //Borrar supervisor
    const deletePaciente = async (paciente) => {
        const data = await deleteData(`https://api.clubdeviajeros.tk/api/personal/${paciente}`, state?.token)
        if (data === 200) getPaciente()
    }
    //Editar supervisor y actualizar
    const editPaciente = (paciente) => {
        setisEditing(true)
        formUpdatePaciente.setFieldsValue(paciente.name);
        setIdEdit(paciente._id)

    }

    const updatePaciente = async (values) => {
        formPersonal.resetFields()
        const data = await editData(values, `https://api.clubdeviajeros.tk/api/personal/${idEdit}`, state?.token)
        if (data === "ok") { setisEditing(false); getPaciente() }
    }

    useEffect(() => {
        getPaciente()
        getQuestions()
        console.log(dataSource)
    }, [0])

    const columns = [
        {
            title: 'Nombre del paciente',
            dataIndex: 'values',
            key: 'values',
            render: (values) => values['name'],
        },
        {
            title: 'Acciones',
            dataIndex: 'actions',
            key: 'actions',
            render: (_, record) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <FcReading />
                        <Popconfirm title="Seguro deseas borrarlo?" onConfirm={() => deletePaciente(record._id)}>
                            <FiTrash2 />
                        </Popconfirm>
                    </div >
                );
            }
        }
    ]

    return (
        <div>
            <NavbarAux />
            <div className='div-arrow-back'>
                <FcPrevious size={35} onClick={() => navigate(-1)} className='backArrow' />
            </div>
            <Row className='styledRow'>
                <Col
                    className='styledColSupervisor'
                    xs={{ span: 20, offset: 2 }} md={{ span: 10, offset: 3 }} lg={{ span: 5, offset: 2 }}>
                    <Form
                        layout="vertical">
                        <Form.Item
                            label='Seleccione un paciente'
                        >
                            <Select
                                style={{ width: '100%' }}
                                onChange={(e) => setIdPaciente(e)}
                            >
                                {dataSource.map((read, index) => (
                                    <Option
                                        key={index}
                                        value={read._id}>{read.values["name"]}
                                    </Option>))}
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button type='primary' onClick={() => idPaciente.length > 0 ? navigate(`/questionsgrisk/${idPaciente}`) : ""}> Siguiente</Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
            <Row style={{ display: 'flex', justifyContent: 'center' }}>
                <Col>
                    <Button style={{ float: 'right', marginBottom: '1rem' }} type="primary" onClick={() => { setIsModalVisible(true) }}>
                        Agregar un paciente
                    </Button>
                    <Table columns={columns} dataSource={dataSource} rowKey="_id" />
                </Col>
            </Row>
            {/*Modal creacion supervisor*/}
            <Modal
                title="Creación paciente"
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false)
                    formPersonal.resetFields()
                }}
                footer={[
                    <Button key="cancel" onClick={() => {
                        setIsModalVisible(false)
                        formPersonal.resetFields()
                    }}>
                        Cancelar
                    </Button>,
                    <Button key="create" type="primary" onClick={() => {
                        setIsModalVisible(false)
                        formPersonal.submit()
                    }}>
                        Crear
                    </Button>,
                ]}>
                <Form form={formPersonal} layout="vertical" onFinish={sendPersonal} >
                    <Form.Item
                        name="name"
                        label="Nombre completo del paciente"
                        rules={[{ required: true, message: 'Por favor ingresa un valor' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="id_paciente"
                        label="Número de identificacione del paciente"
                        rules={[{ required: true, message: 'Por favor ingresa un valor' }]}
                    >
                        <Input />
                    </Form.Item>
                    {dataSourcePersonales.map((read, index) => (
                        <Form.Item
                            key={index}
                            name={read._id}
                            label={read.pregunta}
                            rules={[{ required: true, message: 'Por favor ingresa un valor' }]}
                        >
                            <Input />
                        </Form.Item>
                    ))}
                </Form>
            </Modal>
            {/* Modal para editar o actualizar el supervisor */}
            <Modal
                title="Actualización del nombre del supervisor"
                open={isEditing}
                onCancel={() => {
                    setisEditing(false)
                    formPersonal.resetFields()
                }}
                footer={[
                    <Button key="cancel" onClick={() => {
                        setisEditing(false)
                        formPersonal.resetFields()
                    }}>
                        Cancelar
                    </Button>,
                    <Button key="create" type="primary" onClick={() => { formUpdatePaciente.submit() }}>
                        Crear
                    </Button>,
                ]}>
                <Form form={formUpdatePaciente} layout="vertical" onFinish={updatePaciente} >
                    <Form.Item
                        name="name"
                        label="Nombre completo del paciente"
                        rules={[{ required: true, message: 'Por favor ingresa un valor' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="id_paciente"
                        label="Número de identificacione del paciente"
                        rules={[{ required: true, message: 'Por favor ingresa un valor' }]}
                    >
                        <Input />
                    </Form.Item>
                    {dataSourcePersonales.map((read, index) => (
                        <Form.Item
                            key={index}
                            name={read._id}
                            label={read.pregunta}
                            rules={[{ required: true, message: 'Por favor ingresa un nombre' }]}
                        >
                            <Input />
                        </Form.Item>))}
                </Form>
            </Modal>
        </div >
    )
}