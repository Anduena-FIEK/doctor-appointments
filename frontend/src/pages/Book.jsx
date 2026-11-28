import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const types = [
  { value: 'visit', label: 'Vizitë' },
  { value: 'checkup', label: 'Kontroll' },
  { value: 'analysis', label: 'Analizë' },
  { value: 'procedure', label: 'Procedurë' },
]

function headers() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
  }
}

function Book() {
  const { doctorId } = useParams()
  const navigate = useNavigate()
  const [doctor, setDoctor] = useState(null)
  const [type, setType] = useState('visit')
  const [date, setDate] = useState('')
  const [slots, setSlots] = useState([])
  const [time, setTime] = useState('')
  const [error, setError] = useState('')
  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    fetch('http://localhost:5000/api/doctors', { headers: headers() })
      .then((res) => res.json())
      .then((list) => {
        if (Array.isArray(list)) setDoctor(list.find((d) => d._id === doctorId) || null)
      })
      .catch(() => setError('Nuk u arrit të ngarkohet doktori.'))
  }, [doctorId])

  useEffect(() => {
    if (!date) return
    fetch(`http://localhost:5000/api/appointments/slots?doctor=${doctorId}&date=${date}`, {
      headers: headers(),
    })
      .then((res) => res.json())
      .then((data) => {
        setSlots(data.slots || [])
        setTime('')
      })
      .catch(() => setError('Nuk u arrit të ngarkohen oraret.'))
  }, [date, doctorId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ doctor: doctorId, type, date, time }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Gabim gjatë caktimit.')
        return
      }
      navigate('/appointments')
    } catch {
      setError('Serveri nuk përgjigjet. Provo përsëri.')
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-blue-50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-700 mb-2">Cakto termin</h1>
        {doctor && (
          <p className="text-gray-600 mb-4">
            {doctor.name}, {doctor.specialty}
            <br />
            <span className="text-sm text-gray-500">{doctor.location}, {doctor.city}</span>
          </p>
        )}

        <label className="block text-sm text-gray-600 mb-1">Lloji i terminit</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border rounded-lg p-2 mb-3"
        >
          {types.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        <label className="block text-sm text-gray-600 mb-1">Data</label>
        <input
          type="date"
          min={today}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full border rounded-lg p-2 mb-3"
        />

        <label className="block text-sm text-gray-600 mb-1">Ora</label>
        {date && slots.length === 0 && (
          <p className="text-sm text-gray-500 mb-3">Nuk ka orare të lira për këtë datë.</p>
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          {slots.map((slot) => (
            <button
              type="button"
              key={slot}
              onClick={() => setTime(slot)}
              className={`px-3 py-1 rounded-lg border ${
                time === slot ? 'bg-blue-700 text-white' : 'bg-white text-gray-700'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          disabled={!date || !time}
          className="w-full bg-blue-700 text-white rounded-lg p-2 hover:bg-blue-800 disabled:opacity-50"
        >
          Konfirmo terminin
        </button>
      </form>
    </div>
  )
}

export default Book