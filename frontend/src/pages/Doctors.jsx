import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const dayNames = ['E diel', 'E hënë', 'E martë', 'E mërkurë', 'E enjte', 'E premte', 'E shtunë']

function Doctors() {
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState([])
  const [day, setDay] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = sessionStorage.getItem('token')
    const query = day === '' ? '' : `?day=${day}`
    setLoading(true)

    fetch(`http://localhost:5000/api/doctors${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.status === 401) {
          sessionStorage.clear()
          navigate('/')
          return null
        }
        const data = await res.json()
        if (!res.ok) throw new Error(data.message)
        return data
      })
      .then((data) => {
        if (data) {
          setDoctors(data)
          setError('')
        }
      })
      .catch(() => setError('Nuk u arrit të ngarkohen doktorët.'))
      .finally(() => setLoading(false))
  }, [day, navigate])

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-blue-50 p-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Doktorët</h1>

      <div className="mb-6">
        <label className="text-sm text-gray-600 mr-2">Shfaq doktorët që punojnë:</label>
        <select
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className="border rounded-lg p-2 bg-white"
        >
          <option value="">Të gjitha ditët</option>
          {dayNames.map((name, index) => (
            <option key={name} value={index}>{name}</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-600">Duke ngarkuar...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && doctors.length === 0 && (
        <p className="text-gray-600">Asnjë doktor nuk punon atë ditë.</p>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {doctors.map((doctor) => (
          <div key={doctor._id} className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-xl font-semibold">{doctor.name}</h2>
            <p className="text-gray-600">{doctor.specialty}</p>
            <p className="text-sm text-gray-500 mt-2">{doctor.location}, {doctor.city}</p>
            <p className="text-sm text-gray-500">
              Ditët: {doctor.workDays.map((d) => dayNames[d]).join(', ')}
            </p>
            <p className="text-sm text-gray-500">Orari: {doctor.startTime} - {doctor.endTime}</p>
            <button
              onClick={() => navigate(`/book/${doctor._id}`)}
              className="mt-4 bg-blue-700 text-white rounded-lg px-4 py-2 hover:bg-blue-800"
            >
              Cakto termin
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Doctors