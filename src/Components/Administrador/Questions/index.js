import React, { useState, useContext, useEffect } from 'react'
import "./style.scss"
import { NavbarAdmin } from '../NavbarAdmin';
import { Form, Modal, Button, Input, Row, Col, Popconfirm, Select, Table } from 'antd';
import { addData, getData, editData, deleteData } from "../../../controller/control"
import { AppContext } from '../../../Provider';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { SearchOutlined } from "@ant-design/icons"
import { useParams, useNavigate } from 'react-router-dom';
import { FcPrevious } from 'react-icons/fc'

const { Option } = Select

export default function Questions() {
    let { id } = useParams()

    //Id for updating specific questions
    const [idEdit, setIdEdit] = useState(null)

    //Navegación a la página acorde al grupo de riesgo
    const navigate = useNavigate();

    //Forms to control diferent modals
    const [formUpdateQuestions] = Form.useForm();
    const [form] = Form.useForm();

    //Estados para el control de las modales
    //Modal para creación de las preguntas
    const [isModalVisible, setIsModalVisible] = useState(false);
    //Modal para la actualización de las preguntas
    const [isEditing, setisEditing] = useState(false)

    //Global state
    const [state, setState] = useContext(AppContext)

    //Data de las preguntas
    const [dataSource, setDataSource] = useState([]);

    const [dataRisk, setDataRisk] = useState([]);

    //Editar las preguntas y actualizar
    const editQuestions = (questions) => {
        setisEditing(true)
        formUpdateQuestions.setFieldsValue(questions);
        setIdEdit(questions._id)
    }

    //Actualizar la pregunta
    const updateQuestions = async (values) => {
        form.resetFields()
        const data = await editData(values, `https://api.clubdeviajeros.tk/api/questions/${idEdit}`, state?.token)
        if (data === "ok") { setisEditing(false); getQuestions() }
    }

    //Creación de una nueva pregunta
    const createNewQuestion = async (values) => {
        form.resetFields()
        setIsModalVisible(false);
        const datos = {
            id_riesgo: id,
            tipo: values.tipo,
            pregunta: values.pregunta,
            name: values.name,
        }
        const data = await addData(datos, "https://api.clubdeviajeros.tk/api/questions", state?.token)
        if (data) getQuestions()
    };

    //Obtención de las preguntas
    const getQuestions = async () => {
        const getConstdata = await getData(`https://api.clubdeviajeros.tk/api/questions/${id}`, state?.token)
        setDataSource(getConstdata);
        getRisks()
    }

    useEffect(() => {
        getQuestions()
        // eslint-disable-next-line
    }, [])

    //Borrar pregunta 
    const deleteQuestions = async (questions) => {
        const data = await deleteData(`https://api.clubdeviajeros.tk/api/questions/${questions}`, state?.token)
        if (data === 200) getQuestions()
    }

    //Obtención de los grupos de riesgo
    const getRisks = async () => {
        const getConstdata = await getData(`https://api.clubdeviajeros.tk/api/risk/${state?.id_supervisor}`, state?.token)
        setDataRisk(getConstdata);

    }

    //
    const filterRisk = (a) => {
        const filtro = dataRisk.filter(data => data._id === a.id_riesgo)
        return (filtro[0]?.name)
    }

    const columns = [
        {
            title: 'Tipo de pregunta',
            dataIndex: 'tipo',
            key: 'tipo',
            filters: [
                {
                    text: 'seguimiento',
                    value: 'seguimiento',
                },
                {
                    text: 'personal',
                    value: 'personal',
                },
            ],
            onFilter: (value, record) => record.tipo.indexOf(value) === 0,
        },
        {
            title: 'Pregunta',
            dataIndex: 'pregunta',
            key: 'pregunta',
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
            onFilter: (value, record) => { return record.pregunta.toLowerCase().includes(value.toLowerCase()) },
        },
        {
            title: 'Nombre del input de la pregunta',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (a) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <FiEdit onClick={() => editQuestions(a)} />
                        <Popconfirm title="Seguro deseas borrarlo?" onConfirm={() => deleteQuestions(a._id)}>
                            <FiTrash2 />
                        </Popconfirm>
                    </div >
                );
            }
        },
    ];

    return (
        <div>
            <NavbarAdmin />
            <div className='containerquestion'>
                <div className='div-arrow-back'>
                    <FcPrevious size={35} onClick={() => navigate(-1)} className='backArrow' />
                </div>
                <Row style={{ display: 'flex', justifyContent: 'center', padding: '0 1em' }}>
                    <Col>
                        <Row style={{ justifyContent: 'center', }}>
                            <Col>
                                <h1 style={{ textTransform: 'uppercase', fontSize: '2.5rem', color: '#105c5c', fontWeight: '800' }}>{filterRisk({ id_riesgo: id })}</h1>
                            </Col>
                        </Row>
                        <Button style={{ marginBottom: '2rem' }} type="primary" onClick={() => { setIsModalVisible(true) }}>
                            Crear nueva pregunta
                        </Button>
                        <Table columns={columns} dataSource={dataSource} rowKey="_id" />
                        {/* Modal para la creación de usuarios */}
                        <Modal
                            title={filterRisk({ id_riesgo: id })}
                            open={isModalVisible}
                            onCancel={() => {
                                setIsModalVisible(false)
                                form.resetFields()
                            }}
                            footer={[
                                <Button key="cancel" onClick={() => {
                                    setIsModalVisible(false)
                                    form.resetFields()
                                }}>
                                    Cancelar
                                </Button>,
                                <Button key="create" type="primary" onClick={() => {
                                    form.submit()
                                }}>
                                    Crear
                                </Button>,
                            ]}>
                            <Form form={form} onFinish={createNewQuestion}>
                                <Form.Item
                                    name="tipo"
                                    label="Tipo de pregunta"
                                    rules={[{ required: true, message: 'Por favor ingresa un nombre' }]}
                                >
                                    <Select
                                        options={[
                                            {
                                                value: 'personal',
                                                label: 'Pregunta datos personales',
                                            },
                                            {
                                                value: 'seguimiento',
                                                label: 'Pregunta de seguimiento',
                                            },
                                        ]} />
                                </Form.Item>
                                <Form.Item
                                    name="pregunta"
                                    label="Pregunta"
                                    rules={[{ required: true, message: 'Por favor ingresa un nombre' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="name"
                                    label="Nombre del input"
                                    rules={[{ required: true, message: 'Por favor ingresa un nombre' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Form>
                        </Modal>
                        {/* Modal for updating questions */}
                        <Modal
                            title="Actualización de la pregunta"
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
                                <Popconfirm title="Seguro deseas editar?" onConfirm={() => { formUpdateQuestions.submit() }}>
                                    <Button key="create" type="primary">
                                        Actualizar
                                    </Button>
                                </Popconfirm>,
                            ]}>
                            <Form form={formUpdateQuestions} onFinish={updateQuestions}>
                                <Form.Item
                                    name="tipo"
                                    label="Tipo de pregunta"
                                    rules={[{ required: true, message: 'Por favor ingresa un nombre' }]}
                                >
                                    <Select
                                        options={[
                                            {
                                                value: 'personal',
                                                label: 'Pregunta datos personales',
                                            },
                                            {
                                                value: 'seguimiento',
                                                label: 'Pregunta de seguimiento',
                                            },
                                        ]} />
                                </Form.Item>
                                <Form.Item
                                    name="pregunta"
                                    label="Pregunta"
                                    rules={[{ required: true, message: 'Por favor ingresa un nombre' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="name"
                                    label="Nombre del input"
                                    rules={[{ required: true, message: 'Por favor ingresa un nombre' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Form>
                        </Modal>
                    </Col>
                </Row>
            </div>
        </div>
    )
}