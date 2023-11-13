import React, { useState, useContext, useEffect } from 'react'
import { FcPrevious } from 'react-icons/fc'
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Row, Col, Input } from 'antd';
import { NavbarAux } from '../NavbarAux';
import { addData, getData, editData } from "../../../controller/control"
import { AppContext } from '../../../Provider';

export default function Patientreport() {
    // id del paciente
    let { id } = useParams()
    // grupo de riesgo del paciente
    let { grisk } = useParams()
    // formulario con las preguntas de seguimiento
    const [formSeguimiento] = Form.useForm();
    //Global state
    const [state, setState] = useContext(AppContext)
    //Data preguntas de seguimiento
    const [dataSource, setDataSource] = useState([]);
    //Data valores que ya se tienen en seguimiento
    const [initialVal, setInitialVal] = useState()
    //Navegación a la página acorde a los supervisores
    const navigate = useNavigate();

    const getPacienteSeguimiento = async () => {
        const getConstdata = await getData(`https://api.clubdeviajeros.tk/api/seguimiento`, state?.token)
        const filtroSeguimiento = getConstdata.filter(data => data._id === id)
        setInitialVal(filtroSeguimiento[0].values)
        //Obtener grupos de riesgo
        const getConstdata2 = await getData(`https://api.clubdeviajeros.tk/api/risk`, state?.token)
        const filtroIdGRisk = getConstdata2.filter(data => data.name === grisk)
        // Obtener las preguntas del grupo de riesgo especifico
        const getConstdata3 = await getData(`https://api.clubdeviajeros.tk/api/questions`, state?.token)
        const filtroQuestions = getConstdata3.filter(data => data.id_riesgo === filtroIdGRisk[0]._id && data.tipo === "seguimiento")
        setDataSource(filtroQuestions)
    }

    useEffect(() => {
        getPacienteSeguimiento()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        formSeguimiento.setFieldsValue(initialVal)
    }, [initialVal])

    return (
        <div>
            <NavbarAux />
            <div className='div-arrow-back'>
                <FcPrevious size={35} onClick={() => navigate(-1)} className='backArrow' />
            </div>
            <Row className='styledRow'>
                <Col>
                    <Form form={formSeguimiento} layout="vertical" >
                        {dataSource.map((read, index) => (
                            <Form.Item
                                key={index}
                                name={read._id}
                                label={read.pregunta}
                                rules={[{ required: true, message: 'Por favor ingresa un nombre' }]}
                            >
                                <Input disabled={true} />
                            </Form.Item>))}
                    </Form>
                </Col>
            </Row>
        </div>
    )
}
