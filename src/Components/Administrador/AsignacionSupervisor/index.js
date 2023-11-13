import React, { useState, useContext, useEffect } from 'react'
import "./style.scss"
import { NavbarAdmin } from '../NavbarAdmin';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Modal, Button, Row, Col, Popconfirm, Select } from 'antd';
import { addData, getData, editData, deleteData } from "../../../controller/control"
import { AppContext } from '../../../Provider';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
//Images
import mamografiaImage from '../../../Images/mamografia.png';
import sifilisImage from '../../../Images/sifilis.png';
import citologiaImage from '../../../Images/papilla.png';
import desnutricionImage from '../../../Images/desnutricion.png';
import edaImage from '../../../Images/diarrea.png';
import iraImage from '../../../Images/neumonia.png';
import mmeImage from '../../../Images/mme.png';
import addSupervisor from '../../../Images/addsupervisor.png';

const { Option } = Select

export default function AsignacionSupervisor() {
    //Obtener los parametros por supervisor su ID
    let { idaux } = useParams()


    //Id for updating specific risk group
    const [idEdit, setIdEdit] = useState(null)

    //Forms to control diferent modals
    const [formUpdateRisk] = Form.useForm();
    const [form] = Form.useForm();

    //Estados para el control de las modales
    //Modal para creación de grupo de riesgo
    const [isModalVisible, setIsModalVisible] = useState(false);
    //Modal para la actualización del grupo de riesgo
    const [isEditing, setisEditing] = useState(false)
    //Estado del auxiliar
    const [isAux, setIsAux] = useState(false)
    //Global state
    const [state, setState] = useContext(AppContext)

    //Data supervisor
    const [dataSupervisor, setDataSupervisor] = useState([]);
    //Data Aux risk groups
    const [dataSource, setDataSource] = useState([]);
    //Data risk groups filter
    const [dataRiskSource, setRiskDataSource] = useState([]);
    //Data risk groups
    const [dataSourceRisk, setDataSourceRisk] = useState([]);

    //Editar asignacion
    const editRiskAux = (value) => {
        form.resetFields()
        setisEditing(true)
        formUpdateRisk.setFieldsValue(value);
        setIdEdit(value._id)
    }
    const updateRiskAux = async (values) => {
        const data = await editData(values, `https://api.clubdeviajeros.tk/api/asignaciones/${idEdit}`, state?.token)
        if (data === "ok") { setisEditing(false); getRisksAux() }
    }


    //Creación de asignaciones
    const createNewAsigSup = async (values) => {
        form.resetFields()
        setIsAux(false)
        setIsModalVisible(false);
        const datos = {
            id_auxiliar: idaux,
            id_supervisor: values.id_supervisor,
            id_riesgo: values.id_riesgo,
        }
        const data = await addData(datos, "https://api.clubdeviajeros.tk/api/asignaciones", state?.token)
        if (data) { getRisksAux() }
    };

    //Obtención de asignaciones
    const getRisksAux = async () => {
        setState({ ...state, id_auxiliar: idaux })
        const getConstdata = await getData(`https://api.clubdeviajeros.tk/api/asignaciones/${idaux}`, state?.token)
        setDataSource(getConstdata);
    }

    //Obtención de los grupos de riesgo con filtro
    const getRisksAdm = async (value) => {
        setState({ ...state, id_supervisor: value });
        const getConstdata = await getData(`https://api.clubdeviajeros.tk/api/risk/${value}`, state?.token)
        setRiskDataSource(getConstdata);
    }
    //Obtención de los grupos de riesgo
    const getRisks = async () => {
        const getConstdata = await getData(`https://api.clubdeviajeros.tk/api/risk`, state?.token)
        setDataSourceRisk(getConstdata);
    }

    //Obtención de los supervisores
    const getSupervisor = async () => {
        const getConstdata = await getData("https://api.clubdeviajeros.tk/api/supervisor", state?.token)
        setDataSupervisor(getConstdata);
    }

    useEffect(() => {
        getRisksAdm()
        getRisks()
        getSupervisor()
        getRisksAux()
        // eslint-disable-next-line
    }, [])

    //Borrar asiganciones
    const deleteRiskAsig = async (value) => {
        const data = await deleteData(`https://api.clubdeviajeros.tk/api/asignaciones/${value._id}`, state?.token)
        if (data === 200) getRisksAux()
    }

    const handleChange = (selectedOption) => {
        (selectedOption) ? setIsAux(true) : setIsAux(false)
        getRisksAdm(selectedOption)
    }

    // filtro nombre supervisor
    const filterNameSupervisor = (a) => {
        const filtro = dataSupervisor.filter(data => data._id === a.id_supervisor)
        return (filtro[0]?.name)
    }
    // filtro nombre supervisor
    const filterRiskSupervisor = (a) => {
        const filtro = dataSourceRisk.filter(data => data._id === a.id_riesgo)
        return (filtro[0]?.name)
    }

    //Diccionario de imagenes de lo grupos de riesgo
    const riskImages = {
        mamografía: mamografiaImage,
        sifilisgestacionalycongenita: sifilisImage,
        citologiaycolposcopia: citologiaImage,
        desnutrición: desnutricionImage,
        eda: edaImage,
        ira: iraImage,
        mme: mmeImage,
    }

    //Función para encontrar la imagen de cada grupo en relación al diccionario riksImages
    const filteredRisk = (riskGroup) => {
        if (riskGroup) {
            const foundPair = Object.entries(riskImages).find(([key, value]) => key === riskGroup.split(" ").filter(Boolean).join(""));
            if (foundPair) {
                const [key, value] = foundPair;
                return value
            } else {
                console.log('Pair not found.');
            }
        }
    }

    return (
        <div>
            <NavbarAdmin />
            <Modal
                onCancel={() => {
                    setIsModalVisible(false)
                    form.resetFields()
                }}
                title="Asignacion de supervisor"
                open={isModalVisible}
                footer={[
                    <Button key="cancel" onClick={() => {
                        setIsModalVisible(false)
                        form.resetFields()
                        setIsAux(false)
                    }}>
                        Cancelar
                    </Button>,
                    <Button key="create" type="primary" onClick={() => {
                        form.submit()
                    }}>
                        Crear
                    </Button>,
                ]}>
                <Form form={form} onFinish={createNewAsigSup}>
                    <Form.Item
                        name="id_supervisor"
                        label="Nombre del supervisor"
                    >
                        <Select
                            style={{ width: '100%' }}
                            onChange={handleChange}
                        >
                            {dataSupervisor.map((read, index) => (
                                <Option
                                    key={index}
                                    value={read._id}>{read.name}
                                </Option>))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="id_riesgo"
                        label="Grupo de riesgo"
                        hidden={!isAux}>
                        <Select
                            style={{ width: '100%' }}
                        >
                            {dataRiskSource.map((read, index) => (
                                <Option
                                    key={index}
                                    value={read._id}>{read.name}
                                </Option>))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Row className='styledRow'>
                {
                    dataSource.map((read, index) => (
                        <Col
                            className='styledColGrisk'
                            xs={{ span: 20, offset: 2 }} md={{ span: 10, offset: 3 }} lg={{ span: 6, offset: 2 }}
                            key={index}>
                            <Row className='styledRow2'>
                                <h1 style={{ textTransform: "capitalize", textAlign: 'center' }}>
                                    {filterNameSupervisor({ id_supervisor: read.id_supervisor })} - {filterRiskSupervisor({ id_riesgo: read.id_riesgo })}
                                </h1>
                                <img src={filteredRisk(filterRiskSupervisor({ id_riesgo: read.id_riesgo }))} alt={filterRiskSupervisor({ id_riesgo: read.id_riesgo }) + "image"} />
                            </Row>
                            <Row style={{ marginTop: "20px" }}>
                                <FiEdit onClick={() => editRiskAux(read)} />
                                <Popconfirm title="Seguro deseas borrarlo?" onConfirm={() => deleteRiskAsig(read)}>
                                    <FiTrash2 />
                                </Popconfirm>
                            </Row>
                        </Col>
                    ))
                }
                <Col
                    className='styledColGrisk'
                    xs={{ span: 20, offset: 2 }} md={{ span: 10, offset: 3 }} lg={{ span: 6, offset: 2 }}>
                    <Row className='styledRow2' onClick={() => { setIsModalVisible(true) }}>
                        <h1 style={{ textTransform: "capitalize", textAlign: 'center' }}> Asignar supervisor </h1>
                        <img src={addSupervisor} alt={"addSupervisor"} />
                    </Row>
                </Col>
            </Row>
            {/* Modal for updating risk */}
            <Modal
                title="Actualización del supervisor"
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
                    <Popconfirm title="Seguro deseas editar?" onConfirm={() => { formUpdateRisk.submit() }}>
                        <Button key="create" type="primary">
                            Crear
                        </Button>
                    </Popconfirm>,
                ]}>
                <Form form={formUpdateRisk} onFinish={updateRiskAux}>
                    <Form.Item
                        name="id_supervisor"
                        label="Nombre del supervisor"
                    >
                        <Select
                            style={{ width: '100%' }}
                            onChange={handleChange}
                        >
                            {dataSupervisor.map((read, index) => (
                                <Option
                                    key={index}
                                    value={read._id}>{read.name}
                                </Option>))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="id_riesgo"
                        label="Grupo de riesgo"
                        hidden={!isAux}>
                        <Select
                            style={{ width: '100%' }}
                        >
                            {dataRiskSource.map((read, index) => (
                                <Option
                                    key={index}
                                    value={read._id}>{read.name}
                                </Option>))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

