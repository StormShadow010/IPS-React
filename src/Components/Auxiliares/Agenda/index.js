import React, { useState, useContext, useEffect } from 'react'
import "./style.scss"
import { Form, Button, Row, Col, Popconfirm, Table, Select } from 'antd';
import { getData, deleteData } from "../../../controller/control"
import { AppContext } from '../../../Provider';
import { FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { FcPrevious } from 'react-icons/fc'
import { NavbarAux } from '../NavbarAux';

const { Option } = Select

export default function Agenda() {

    //Id for updating specific supervisor 
    const [isName, setIsName] = useState()

    //Forms to control diferent modals

    //Estados para el control de las modales
    //Global state
    const [state, setState] = useContext(AppContext)

    //Navegación a la página acorde a los supervisores
    const navigate = useNavigate();

    //Data pacientes
    const [dataSource, setDataSource] = useState([]);
    //Data Dates
    const [dataSourceDates, setDataSourceDates] = useState([]);
    //Data risk groups filter
    const [dataFilter, setDataFilter] = useState([]);
    const [dataSourceRisk, setDataSourceRisk] = useState([]);

    //Obtención de los pacientes
    const getPaciente = async () => {
        const getConstdata = await getData(`https://api.clubdeviajeros.tk/api/personal`, state?.token)
        const filtro = getConstdata.filter(data => data.values.id_aux === state.user._id)
        setDataSource(filtro)
    }

    //Obtención de los grupos de riesgo
    const getRisks = async () => {
        const getConstdata = await getData(`https://api.clubdeviajeros.tk/api/risk`, state?.token)
        setDataSourceRisk(getConstdata);
    }

    //Borrar pregunta 
    const deleteDate = async (date) => {
        const data = await deleteData(`https://api.clubdeviajeros.tk/api/agenda/${date}`, state?.token)
        if (data === 200) getDates()
    }
    //Update info from user
    const filtroDates = (nombre) => {
        setDataFilter(dataSourceDates)
        const filtro = dataSourceDates.filter(data => data.nombre === nombre)
        setDataFilter(filtro)
    }

    //Obtención de las fechas - agenda
    const getDates = async () => {
        const getConstdata = await getData(`https://api.clubdeviajeros.tk/api/agenda/${state.user._id}`, state?.token)
        const getConstdataRisk = await getData(`https://api.clubdeviajeros.tk/api/risk`, state?.token)
        const getConstdataPaciente = await getData(`https://api.clubdeviajeros.tk/api/personal`, state?.token)

        let array = []
        Object.entries(getConstdata).forEach((element) => {
            const newObject = getConstdataRisk.filter((a) => a._id === element[1].id_riesgo)
            const newObject2 = getConstdataPaciente.filter((a) => a._id === element[1].id_paciente)
            array.push({
                _id: element[1]._id,
                nombre: newObject2[0]?.values.name,
                griesgo: newObject[0]?.name,
                hora: element[1].fecha,
                observacion: element[1].observacion,
            })
        })
        setDataSourceDates(array);
        setDataFilter(array);
    }

    useEffect(() => {
        getPaciente()
        getRisks()
        getDates()
    }, [])

    const columns = [
        {
            title: 'Nombre del paciente',
            dataIndex: 'nombre',
            key: 'name'
        },
        {
            title: 'Riesgo',
            dataIndex: 'griesgo',
            key: 'risk'
        },
        {
            title: 'Hora',
            dataIndex: 'hora',
            key: 'hour'
        },
        {
            title: 'Observaciones',
            dataIndex: 'observacion',
            key: 'comments'
        },
        {
            title: 'Acciones',
            dataIndex: 'actions',
            key: 'actions',
            render: (_, record) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Popconfirm title="Seguro deseas borrarlo?" onConfirm={() => deleteDate(record._id)}>
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
            <Row className='styledRowDate'>
                <Col
                    className='styledColDates'
                    xs={{ span: 20, offset: 2 }} md={{ span: 10, offset: 3 }} lg={{ span: 8, offset: 2 }}>
                    <Form
                        layout="vertical">
                        <Form.Item
                            label='Seleccione un paciente'
                        >
                            <Select
                                style={{ width: '100%' }}
                                onChange={(e) => setIsName(e)}
                            >
                                {dataSource.map((read, index) => (
                                    <Option
                                        key={index}
                                        value={read.values['name']}>{read.values["name"]}
                                    </Option>))}
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button style={{ marginInline: '10px' }} type='primary' onClick={() => { getDates() }}> Ver todos</Button>
                            <Button type='primary' onClick={() => { filtroDates(isName) }}> Siguiente</Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
            <Row style={{ display: 'flex', justifyContent: 'center' }}>
                <Col>
                    <Table columns={columns} dataSource={dataFilter} rowKey="_id" />
                </Col>
            </Row>
        </div >
    )
}