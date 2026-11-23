import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Doctors from './pages/Doctors'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/doctors" element={<Doctors />} />
    </Routes>
  )
}

export default App