import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Gabim gjatë hyrjes.')
        return
      }
      sessionStorage.setItem('token', data.token)
      sessionStorage.setItem('user', JSON.stringify(data.user))
      navigate('/doctors')
    } catch {
      setError('Serveri nuk përgjigjet. Provo përsëri.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-blue-50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow w-full max-w-sm">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">Hyr në llogari</h1>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full border rounded-lg p-2 mb-3"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Fjalëkalimi"
          required
          className="w-full border rounded-lg p-2 mb-4"
        />

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 text-white rounded-lg p-2 hover:bg-blue-800 disabled:opacity-50"
        >
          {loading ? 'Duke hyrë...' : 'Hyr'}
        </button>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Nuk ke llogari?{' '}
          <Link to="/register" className="text-blue-700 hover:underline">Regjistrohu</Link>
        </p>
      </form>
    </div>
  )
}

export default Login