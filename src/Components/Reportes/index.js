import React, { useState, useContext, useEffect } from 'react'
import "./style.scss"
import { NavbarAdmin } from '../Administrador/NavbarAdmin';
import { Form, Modal, Button, Input, Row, Col, Popconfirm, Select, Table } from 'antd';
import { addData, getData, editData, deleteData } from "../../controller/control"
import { AppContext } from '../../Provider';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

export default function Reports() {

    //Id for updating specific questions
    const [idEdit, setIdEdit] = useState(null)

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

    //Editar las preguntas y actualizar
    const editQuestions = (questions) => {
        setisEditing(true)
        formUpdateQuestions.setFieldsValue(questions);
        setIdEdit(questions._id)
    }

    const updateQuestions = async (values) => {
        const data = await editData(values, `https://api.clubdeviajeros.tk/api/questions/${idEdit}`, state?.token)
        if (data === "ok") { setisEditing(false); getQuestions() }
    }

    //Creación de una nueva pregunta
    const createNewQuestion = async (values) => {
        setIsModalVisible(false);
        const data = await addData(values, "https://api.clubdeviajeros.tk/api/questions", state?.token)
        console.log(data)
        if (data) getQuestions()
    };

    //Obtención de las preguntas
    const getQuestions = async () => {
        const getConstdata = await getData("https://api.clubdeviajeros.tk/api/questions", state?.token)
        setDataSource(getConstdata);
        console.log(getConstdata);
    }

    useEffect(() => {
        getQuestions()
        // eslint-disable-next-line
    }, [])

    //Borrar pregunta 
    const deleteQuestions = async (questions) => {
        const data = await deleteData(`https://api.clubdeviajeros.tk/api/questions/${questions._id}`, state?.token)
        if (data === 200) getQuestions()
    }

    //Relacion id con grupo de riesgo
    const QuestionName = {
        _6464311f614c906ff6ba4296: 'Mamografía',
        _646521f6614c906ff6ba43cb: 'Sifilis gestacional y congenita',
        _64657176614c906ff6ba447c: 'Citologia y colposcopia',
        _64657161614c906ff6ba4478: 'Desnutrición',
        _6465719b614c906ff6ba4482: 'Eda',
        _6465226b614c906ff6ba43d8: 'Ira',
        _6465224b614c906ff6ba43d2: 'Mme',
    }

    const columns = [
        {
            title: 'Id del grupo de Riesgo',
            dataIndex: 'id_riesgo',
            key: 'id_riesgo',
        },
        {
            title: 'Tipo de pregunta',
            dataIndex: 'tipo',
            key: 'tipo',
        },
        {
            title: 'Pregunta',
            dataIndex: 'pregunta',
            key: 'pregunta',
        },
        {
            title: 'Nombre del input de la pregunta',
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
                        <FiEdit onClick={() => editQuestions(record)} />
                        <Popconfirm title="Seguro deseas borrarlo?" onConfirm={() => deleteQuestions(record._id)}>
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
                <Row style={{ display: 'flex', justifyContent: 'center', padding: '0 1em' }}>
                    <Col className='tableUser'>
                        <Button style={{ marginBottom: '2rem' }} type="primary" onClick={() => { setIsModalVisible(true) }}>
                            Crear nueva pregunta
                        </Button>
                        <Table columns={columns} dataSource={dataSource} rowKey="_id" />
                        {/* Modal para la creación de usuarios */}
                        <Modal
                            title="Creación preguntas"
                            open={isModalVisible}
                            onCancel={() => {
                                setIsModalVisible(false)
                            }}
                            footer={[
                                <Button key="cancel" onClick={() => setIsModalVisible(false)}>
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
                                    name="id_riesgo"
                                    label="Id del grupo de riesgo"
                                    rules={[{ required: true, message: 'Por favor ingresa un nombre' }]}
                                >
                                    <Select
                                        options={[
                                            {
                                                value: '64657176614c906ff6ba447c',
                                                label: 'Citología y colposcopia',
                                            },
                                            {
                                                value: '6464311f614c906ff6ba4296',
                                                label: 'Mamografía',
                                            },
                                            {
                                                value: '646521f6614c906ff6ba43cb',
                                                label: 'Sifilis gestacional y congenita',
                                            },
                                            {
                                                value: '64657161614c906ff6ba4478',
                                                label: 'Desnutricion',
                                            },
                                            {
                                                value: '6465719b614c906ff6ba4482',
                                                label: 'Eda',
                                            },
                                            {
                                                value: '6465226b614c906ff6ba43d8',
                                                label: 'Ira',
                                            },
                                            {
                                                value: '6465224b614c906ff6ba43d2',
                                                label: 'Mme',
                                            },
                                        ]} />
                                </Form.Item>
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
                            onCancel={() => setisEditing(false)}
                            footer={[
                                <Button key="cancel" onClick={() => setisEditing(false)}>
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
                                    name="id_riesgo"
                                    label="Id del grupo de riesgo"
                                    rules={[{ required: true, message: 'Por favor ingresa un nombre' }]}
                                >
                                    <Select
                                        options={[
                                            {
                                                value: '64657176614c906ff6ba447c',
                                                label: 'Citología y colposcopia',
                                            },
                                            {
                                                value: '6464311f614c906ff6ba4296',
                                                label: 'Mamografía',
                                            },
                                            {
                                                value: '646521f6614c906ff6ba43cb',
                                                label: 'Sifilis gestacional y congenita',
                                            },
                                            {
                                                value: '64657161614c906ff6ba4478',
                                                label: 'Desnutricion',
                                            },
                                            {
                                                value: '6465719b614c906ff6ba4482',
                                                label: 'Eda',
                                            },
                                            {
                                                value: '6465226b614c906ff6ba43d8',
                                                label: 'Ira',
                                            },
                                            {
                                                value: '6465224b614c906ff6ba43d2',
                                                label: 'Mme',
                                            },
                                        ]} />
                                </Form.Item>
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