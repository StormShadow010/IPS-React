import React, { useState, useContext, useEffect } from 'react'
import "./style.scss"
import { NavbarAdmin } from '../NavbarAdmin';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Modal, Button, Input, Row, Col, Popconfirm } from 'antd';
import { addData, getData, editData, deleteData } from "../../../controller/control"
import { AppContext } from '../../../Provider';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { FcPrevious } from 'react-icons/fc'
//Images
import mamografiaImage from '../../../Images/mamografia.png';
import sifilisImage from '../../../Images/sifilis.png';
import citologiaImage from '../../../Images/papilla.png';
import desnutricionImage from '../../../Images/desnutricion.png';
import edaImage from '../../../Images/diarrea.png';
import iraImage from '../../../Images/neumonia.png';
import mmeImage from '../../../Images/mme.png';
import addImage from '../../../Images/agregar-usuario.png';


export default function GruRiesgo() {
    //Obtener los parametros por supervisor su ID
    let { id } = useParams()

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

    //Global state
    const [state, setState] = useContext(AppContext)

    //Navegación a la página acorde al grupo de riesgo
    const navigate = useNavigate();

    //Data risk groups
    const [dataSource, setDataSource] = useState([]);

    //Diccionario de imagenes de lo grupos de riesgo
    const riskImages = {
        mamografía: mamografiaImage,
        sifilisgestacionalycongenita: sifilisImage,
        citologiaycolposcopia: citologiaImage,
        desnutrición: desnutricionImage,
        eda: edaImage,
        ira: iraImage,
        mme: mmeImage,
        add: addImage,
    }

    //Función para encontrar la imagen de cada grupo en relación al diccionario riksImages
    const filteredRisk = (riskGroup) => {
        const foundPair = Object.entries(riskImages).find(([key, value]) => key === riskGroup.replace(/\s+/g, ''));
        if (foundPair) {
            const [key, value] = foundPair;
            return value
        } else {
            console.log('Pair not found.');
        }
    }

    //Editar grupo de riesgo y actualizar
    const editRisk = (risk) => {
        form.resetFields()
        setisEditing(true)
        formUpdateRisk.setFieldsValue(risk);
        setIdEdit(risk._id)
    }

    const updateRisk = async (values) => {
        const data = await editData(values, `https://api.clubdeviajeros.tk/api/risk/${idEdit}`, state?.token)
        if (data === "ok") { setisEditing(false); getRisks() }
    }

    //Creación de un nuevo grupo de riesgo
    const createNewRisk = async (values) => {
        form.resetFields()
        setIsModalVisible(false);
        const datos = {
            name: values.name,
            id_supervisor: id,
        }
        const data = await addData(datos, "https://api.clubdeviajeros.tk/api/risk", state?.token)
        if (data) { getRisks() }
    };

    //Obtención de los grupos de riesgo
    const getRisks = async () => {
        setState({ ...state, id_supervisor: id })
        const getConstdata = await getData(`https://api.clubdeviajeros.tk/api/risk/${id}`, state?.token)
        setDataSource(getConstdata);
    }

    useEffect(() => {
        getRisks()
        console.log(dataSource)
        // eslint-disable-next-line
    }, [])

    //Borrar grupo de riesgo 
    const deleteRisk = async (risk) => {
        const data = await deleteData(`https://api.clubdeviajeros.tk/api/risk/${risk._id}`, state?.token)
        if (data === 200) getRisks()
    }

    return (
        <div>
            <NavbarAdmin />
            <div>
                <FcPrevious size={35} onClick={() => navigate(-1)} className='backArrow'/>
            </div>
            <Modal
                onCancel={() => {
                    setIsModalVisible(false)
                    form.resetFields()
                }}
                title="Creación grupo de riesgo"
                open={isModalVisible}
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
                <Form form={form} onFinish={createNewRisk}>
                    <Form.Item
                        name="name"
                        label="Nombre grupo de riesgo"
                        rules={[{ required: true, message: 'Por favor ingresa un nombre' }]}
                    >
                        <Input />
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
                            <Row className='styledRow2' onClick={() => navigate(`/questions/${read._id}`)}>
                                <h1 style={{ textTransform: "capitalize", textAlign: 'center' }}>{read.name} </h1>
                                <img src={filteredRisk(read.name)} alt={read.name + "imagen"} />
                            </Row>
                            <Row style={{ marginTop: "20px" }}>
                                <FiEdit onClick={() => editRisk(read)} />
                                <Popconfirm title="Seguro deseas borrarlo?" onConfirm={() => deleteRisk(read)}>
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
                        <h1 style={{ textTransform: "capitalize", textAlign: 'center' }}> agregar grupo de riesgo </h1>
                        <img src={filteredRisk('add')} alt={"addimage"} />
                    </Row>
                </Col>
            </Row>
            {/* Modal for updating risk */}
            <Modal
                title="Actualización del grupo de riesgo"
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
                <Form form={formUpdateRisk} onFinish={updateRisk}>
                    <Form.Item name="name" label="Nombre grupo:">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

