import { Link, useNavigate, useLocation } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  useLocation()
  const token = sessionStorage.getItem('token')
  const user = JSON.parse(sessionStorage.getItem('user') || 'null')

  const handleLogout = () => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    navigate('/')
  }

  return (
    <nav className="h-16 bg-white shadow flex items-center justify-between px-8">
      <span className="text-xl font-bold text-blue-700">Doctor Appointments</span>
      <div className="flex items-center gap-6">
        {token ? (
          <>
            <Link to="/doctors" className="text-gray-700 hover:text-blue-700">Doktorët</Link>
            <Link to="/appointments" className="text-gray-700 hover:text-blue-700">Terminet e mia</Link>
            <span className="text-sm text-gray-500">{user?.name}</span>
            <button onClick={handleLogout} className="text-gray-700 hover:text-blue-700">
              Dil
            </button>
          </>
        ) : (
          <>
            <Link to="/" className="text-gray-700 hover:text-blue-700">Hyr</Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-700">Regjistrohu</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar