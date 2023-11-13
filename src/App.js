import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Components/Login'
import Home from './Components/Home';
import Welcome from './Components/Welcome'
import GestUser from './Components/Administrador/GestionDeUsuario'
import GruRiesgo from './Components/Administrador/GruposDeRiego';
import Reports from './Components/Reportes'
import Supervisor from './Components/Administrador/Supervisor';
import Questions from './Components/Administrador/Questions';
import AdminAuxiliar from './Components/Administrador/Auxiliar';
import CreacionPaciente from './Components/Auxiliares/CreacionPaciente';

import MyProvider from "./Provider"
import GruRiesgoAux from './Components/Auxiliares/GruposRiesgo';
import QuestionsGRisk from './Components/Auxiliares/QuestionsGRisk';
import AsignacionSupervisor from './Components/Administrador/AsignacionSupervisor';
import Agenda from './Components/Auxiliares/Agenda';
import ReporteSeguimiento from './Components/Auxiliares/ReporteSeguimiento';
import Patientreport from './Components/Auxiliares/ReportePaciente';


function App() {
  return (
    <MyProvider>
      <BrowserRouter>
        <Routes>
          {/*Rutas para acceso Administrador*/}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/Usuarios" element={<GestUser />} />
          <Route path="/griesgo/:id" element={<GruRiesgo />} />
          <Route path="/reportes" element={<Reports />} />
          <Route path="/questions/:id" element={<Questions />} />
          <Route path="/administrador" element={<Supervisor />} />
          <Route path="/adminauxiliar" element={<AdminAuxiliar />} />
          <Route path="/asignacionsupervisor/:idaux" element={<AsignacionSupervisor />} />
          {/*Rutas para acceso a auxiliares*/}
          <Route path="/auxiliar" element={<GruRiesgoAux />} />
          <Route path="/questionsgrisk/:id" element={<QuestionsGRisk />} />
          <Route path="/creacionpaciente/:id" element={<CreacionPaciente />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/reporteseguimiento" element={<ReporteSeguimiento />} />
          <Route path="/patientreport/:id/:grisk" element={<Patientreport />} />
        </Routes>
      </BrowserRouter>
    </MyProvider>
  );
}

export default App;