import React, { useState, useContext, useEffect } from 'react'
import "./style.scss"
import { Form, Button, Input, Row, Col, Tabs, DatePicker } from 'antd';
import { addData, getData, editData } from "../../../controller/control"
import { AppContext } from '../../../Provider';
import { FcReading, FcFinePrint, FcPrevious, FcAlarmClock } from "react-icons/fc";
import { useParams, useNavigate } from 'react-router-dom';
import { NavbarAux } from '../NavbarAux';

export default function QuestionsGRisk() {
    let { id } = useParams()

    //Id for updating specific questions
    const [idRecord, setIdRecord] = useState()

    //Forms to control diferent modals
    const [formPersonal] = Form.useForm();
    const [formSeguimiento] = Form.useForm();
    const [formDate] = Form.useForm();

    const navigate = useNavigate();

    // Estado para guardar el id del grupo de riesgo
    const [gRisk, setGRisk] = useState()

    //Global state
    const [state, setState] = useContext(AppContext)

    //Data de las preguntas
    const [dataSourceSeguimiento, setDataSourceSeguimiento] = useState([]);
    //Data pacientes
    const [dataSource, setDataSource] = useState([]);
    const [initialVal, setInitialVal] = useState()

    //Obtención de los pacientes
    const getPaciente = async () => {
        const getConstdata = await getData(`https://api.clubdeviajeros.tk/api/personal/name/${id}`, state?.token)
        setInitialVal(getConstdata[0].values)
        setIdRecord(getConstdata[0]._id)
        setGRisk(getConstdata[0].id_riesgo)
        await getQuestions(getConstdata[0])
    }

    //Obtención de las preguntas
    const getQuestions = async (data) => {
        const getConstdata = await getData(`https://api.clubdeviajeros.tk/api/questions/${data.id_riesgo}`, state?.token)
        await getNameQuestions(data, getConstdata)
        const filteredDataSeguimiento = getConstdata.filter(item => item.tipo === "seguimiento")
        setDataSourceSeguimiento(filteredDataSeguimiento);
    }

    const getNameQuestions = async (values, data) => {
        let array = []
        Object.entries(values.values).forEach(([key, val]) => {
            const newObject = data.filter((a) => a._id === key)
            if (newObject.length > 0 && newObject[0].pregunta) {
                array.push({
                    id: key,
                    pregunta: newObject[0].pregunta,
                    respuesta: val
                })
            }
        })
        setDataSource(array)
    }

    useEffect(() => {
        getPaciente()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        formPersonal.setFieldsValue(initialVal)
    }, [initialVal])

    const sendPersonalQuestions = async (values) => {
        const data = await editData({ values: values }, `https://api.clubdeviajeros.tk/api/personal/${idRecord}`, state?.token)
        console.log(data)
    }

    const createNewQuestion = async (values) => {
        values.id_aux = state.user._id;
        const data = await addData({ id_paciente: idRecord, values }, `https://api.clubdeviajeros.tk/api/seguimiento`, state?.token)
        if (data._id) {
            alert('Datos insertados correctamente')
            formSeguimiento.resetFields()
        }
    }

    //Creación de una nueva cita
    const createNewDate = async (values) => {
        formDate.resetFields()
        const datos = {
            id_auxiliar: state.user._id,
            id_paciente: idRecord,
            id_riesgo: gRisk,
            fecha: values.fecha,
            observacion: values.observaciones,
        }
        const data = await addData(datos, "https://api.clubdeviajeros.tk/api/agenda", state?.token)
    };

    const items = [
        {
            key: '1',
            label:
                (<span style={{ fontSize: '20px', display: 'flex', alignItems: 'center' }}>
                    <FcReading style={{ marginRight: '10px' }} size={30} />
                    Preguntas Personales
                </span>),
            children:
                (
                    <Form form={formPersonal} layout="vertical" onFinish={sendPersonalQuestions} >
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
                        {dataSource.map((read, index) => (
                            <Form.Item
                                key={index}
                                name={read.id}
                                label={read.pregunta}
                                rules={[{ required: true, message: 'Por favor ingresa un nombre' }]}
                            >
                                <Input />
                            </Form.Item>))}
                        <Form.Item>
                            <Button type='primary' htmlType="submit">Actualizar</Button>
                        </Form.Item>
                    </Form>
                ),
        },
        {
            key: '2',
            label:
                (<span style={{ fontSize: '20px', display: 'flex', alignItems: 'center' }}>
                    <FcFinePrint style={{ marginRight: '10px' }} size={30} />
                    Preguntas de seguimiento
                </span>),
            children:
                (
                    <Form form={formSeguimiento} layout="vertical" onFinish={createNewQuestion} >
                        {dataSourceSeguimiento.map((read, index) => (
                            <Form.Item
                                key={index}
                                name={read._id}
                                label={read.pregunta}
                                rules={[{ required: true, message: 'Por favor ingresa un nombre' }]}
                            >
                                <Input />
                            </Form.Item>))}
                        <Form.Item>
                            <Button type='primary' htmlType="submit"> Enviar datos</Button>
                        </Form.Item>

                    </Form>
                ),
        },
        {
            key: '3',
            label:
                (<span style={{ fontSize: '20px', display: 'flex', alignItems: 'center' }}>
                    <FcAlarmClock style={{ marginRight: '10px' }} size={30} />
                    Proximo Seguimiento
                </span>),
            children:
                (
                    <Form form={formDate} layout="vertical" onFinish={createNewDate} >
                        <Form.Item label="Próximo seguimiento" name="fecha">
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                        </Form.Item>
                        <Form.Item label="Observaciones" name="observaciones">
                            <Input />
                        </Form.Item>
                        <Form.Item>
                            <Button type='primary' htmlType="submit"> Enviar datos</Button>
                        </Form.Item>
                    </Form>
                ),
        },
    ];

    return (
        <div>
            <NavbarAux />
            <div className='div-arrow-back'>
                <FcPrevious size={35} onClick={() => navigate(-1)} className='backArrow' />
            </div>
            <Row className='styledRow'>
                <Col>
                    <Tabs
                        defaultActiveKey="1"
                        centered
                        items={items}
                    />
                </Col>
            </Row>
        </div>
    )
}
