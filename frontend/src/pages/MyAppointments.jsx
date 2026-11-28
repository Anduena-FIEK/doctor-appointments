import { useEffect, useState } from 'react'

const typeLabels = {
  visit: 'Vizitë',
  checkup: 'Kontroll',
  analysis: 'Analizë',
  procedure: 'Procedurë',
}

function headers() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
  }
}

function isPast(a) {
  return new Date(`${a.date}T${a.time}`) < new Date()
}

function AppointmentCard({ a, onCancel }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="text-xl font-semibold">{typeLabels[a.type]}</h3>
      <p className="text-gray-600">{a.doctor?.name}, {a.doctor?.specialty}</p>
      <p className="text-sm text-gray-500 mt-2">{a.doctor?.location}, {a.doctor?.city}</p>
      <p className="text-sm text-gray-500">{a.date} në orën {a.time}</p>
      {a.version > 1 && <p className="text-xs text-gray-400 mt-1">Versioni {a.version}</p>}
      {onCancel && (
        <button onClick={() => onCancel(a._id)} className="mt-4 text-red-600 hover:underline">
          Anulo
        </button>
      )}
    </div>
  )
}

function Section({ title, items, empty, onCancel }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">{title}</h2>
      {items.length === 0 ? (
        <p className="text-gray-600">{empty}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {items.map((a) => (
            <AppointmentCard key={a._id} a={a} onCancel={onCancel} />
          ))}
        </div>
      )}
    </section>
  )
}

function MyAppointments() {
  const [appointments, setAppointments] = useState([])
  const [error, setError] = useState('')

  const load = () => {
    fetch('http://localhost:5000/api/appointments', { headers: headers() })
      .then((res) => res.json())
      .then((data) => setAppointments(Array.isArray(data) ? data : []))
      .catch(() => setError('Nuk u arrit të ngarkohen terminet.'))
  }

  useEffect(load, [])

  const cancel = async (id) => {
    if (!window.confirm('A je i sigurt që dëshiron ta anulosh terminin?')) return
    const res = await fetch(`http://localhost:5000/api/appointments/${id}`, {
      method: 'DELETE',
      headers: headers(),
    })
    if (res.ok) load()
    else setError('Termini nuk u anulua.')
  }

  const upcoming = appointments.filter((a) => !a.archived && !isPast(a)).reverse()
  const past = appointments.filter((a) => !a.archived && isPast(a))
  const cancelled = appointments.filter((a) => a.archived)

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-blue-50 p-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Terminet e mia</h1>
      {error && <p className="text-red-600 mb-3">{error}</p>}
      <Section title="Të ardhshme" items={upcoming} empty="Nuk ke termine të ardhshme." onCancel={cancel} />
      <Section title="Të kaluara" items={past} empty="Nuk ke termine të kaluara." />
      <Section title="Të anuluara" items={cancelled} empty="Nuk ke termine të anuluara." />
    </div>
  )
}

export default MyAppointments