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

export default function ReporteSeguimiento() {

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
    //Data seguimiento
    const [dataReportesSegimiento, setDataReportesSegimiento] = useState([]);
    //Data seguimiento
    const [dataSourcerReportes, setDataSourcerReportes] = useState([]);
    const [initialVal, setInitialVal] = useState()

    //Obtención de los pacientes
    const getPaciente = async () => {
        const getConstdata = await getData(`https://api.clubdeviajeros.tk/api/personal`, state?.token)
        const filtro = getConstdata.filter(data => data.values.id_aux === state.user._id)
        console.log(filtro)
        setDataSource(filtro)
    }

    //Obtención de las preguntas
    const getSeguimiento = async () => {
        const getConstdata = await getData(`https://api.clubdeviajeros.tk/api/personal`, state?.token)
        const filtro2 = getConstdata.filter(data => data.values.id_aux === state.user._id)
        const getConstdata2 = await getData(`https://api.clubdeviajeros.tk/api/seguimiento`, state?.token)
        const filtro = getConstdata2.filter(data => data.values.id_aux === state.user._id)
        const getConstdataRisk = await getData(`https://api.clubdeviajeros.tk/api/risk`, state?.token)

        console.log("Filtro get seguimiento:", filtro)

        let array = []
        Object.entries(filtro).forEach((element) => {
            const newObject = filtro2.filter((a) => a._id === element[1].id_paciente)
            const newObject2 = getConstdataRisk.filter((a) => a._id === newObject[0]?.id_riesgo)

            array.push({
                _id: element[1]._id,
                nombre: newObject[0]?.values.name,
                identificacion: newObject[0]?.values.id_paciente,
                grisk: newObject2[0]?.name,
                fecha: element[1].createdAt,
            })
        })
        setDataSourcerReportes(array)
        setDataReportesSegimiento(array)
        console.log(array)

    }

    //Borrar supervisor
    const deletePaciente = async (paciente) => {
        const data = await deleteData(`https://api.clubdeviajeros.tk/api/personal/${paciente}`, state?.token)
        if (data === 200) getPaciente()
    }

    const filterSeguimiento = (idPaciente) => {
        setDataReportesSegimiento(dataSourcerReportes)
        const filtro = dataSourcerReportes.filter(data => data.identificacion === idPaciente)
        setDataReportesSegimiento(filtro)
    }

    // //Ver datos del reporte
    const verReporte = async (paciente) => {
        navigate(`/patientreport/${paciente._id}/${paciente.grisk}`)
    }

    useEffect(() => {
        getPaciente()
        getSeguimiento()
        //getQuestions()
    }, [0])

    const columns = [
        {
            title: 'Identificacion del paciente',
            dataIndex: 'identificacion',
            key: 'id_paciente',
        },
        {
            title: 'Nombre del paciente',
            dataIndex: 'nombre',
            key: 'name'
        },
        {
            title: 'Grupo de riesgo',
            dataIndex: 'grisk',
            key: 'grisk'
        },
        {
            title: 'fecha',
            dataIndex: 'fecha',
            key: 'date'
        },
        {
            title: 'Acciones',
            dataIndex: 'actions',
            key: 'actions',
            render: (_, record) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <FcReading onClick={() => {
                            verReporte(record)
                        }} />
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
                    className='styledColDates'
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
                                        value={read.values['id_paciente']}>{read.values['id_paciente']}
                                    </Option>))}
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button style={{ marginInline: '10px' }} type='primary' onClick={() => { getSeguimiento() }}> Ver todos</Button>
                            <Button type='primary' onClick={() => filterSeguimiento(idPaciente)}> Siguiente</Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
            <Row style={{ display: 'flex', justifyContent: 'center' }}>
                <Col>
                    <Table columns={columns} dataSource={dataReportesSegimiento} rowKey="_id" />
                </Col>
            </Row>
        </div >
    )
}