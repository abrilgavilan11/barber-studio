import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Layout from './layouts/Layout'

import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Booking from './pages/Booking'
import AdminLogin from "./pages/AdminLogin";
import Registro from "./pages/Registro";
import Dashboard from './pages/Dashboard'
import MisTurnos from "./pages/MisTurnos";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/servicios" element={<Catalog />} />
          <Route path="/reservar" element={<Booking />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/mis-turnos" element={<MisTurnos />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;