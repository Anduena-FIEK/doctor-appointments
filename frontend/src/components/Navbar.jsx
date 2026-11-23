import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="h-16 bg-white shadow flex items-center justify-between px-8">
      <span className="text-xl font-bold text-blue-700">Doctor Appointments</span>
      <div className="flex gap-6">
        <Link to="/doctors" className="text-gray-700 hover:text-blue-700">Doktorët</Link>
        <Link to="/" className="text-gray-700 hover:text-blue-700">Hyr</Link>
      </div>
    </nav>
  )
}

export default Navbar