import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const cities = ['Prishtinë', 'Prizren', 'Pejë', 'Gjakovë', 'Mitrovicë', 'Ferizaj', 'Gjilan']

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    city: '',
    password: '',
    confirmPassword: '',
    consent: false,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 8) {
      setError('Fjalëkalimi duhet të ketë të paktën 8 karaktere.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Fjalëkalimet nuk përputhen.')
      return
    }
    if (!form.consent) {
      setError('Duhet të pranosh përpunimin e të dhënave.')
      return
    }

    setError('')
    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          city: form.city,
          password: form.password,
          consent: form.consent,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Gabim gjatë regjistrimit.')
        return
      }
      navigate('/')
    } catch {
      setError('Serveri nuk përgjigjet. Provo përsëri.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-blue-50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow w-full max-w-sm">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">Krijo llogari</h1>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Emri dhe mbiemri"
          required
          className="w-full border rounded-lg p-2 mb-3"
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full border rounded-lg p-2 mb-3"
        />
        <select
          name="city"
          value={form.city}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-2 mb-3"
        >
          <option value="">Zgjidh qytetin</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Fjalëkalimi (min. 8 karaktere)"
          required
          className="w-full border rounded-lg p-2 mb-3"
        />
        <input
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Përsërit fjalëkalimin"
          required
          className="w-full border rounded-lg p-2 mb-3"
        />

        <label className="flex items-start gap-2 text-sm text-gray-600 mb-4">
          <input
            name="consent"
            type="checkbox"
            checked={form.consent}
            onChange={handleChange}
            className="mt-1"
          />
          Pranoj që të dhënat e mia të përpunohen për caktimin e termineve.
        </label>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 text-white rounded-lg p-2 hover:bg-blue-800 disabled:opacity-50"
        >
          {loading ? 'Duke u regjistruar...' : 'Regjistrohu'}
        </button>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Ke llogari?{' '}
          <Link to="/" className="text-blue-700 hover:underline">Hyr</Link>
        </p>
      </form>
    </div>
  )
}

export default Register