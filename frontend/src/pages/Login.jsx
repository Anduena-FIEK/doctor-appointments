function Login() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-sm">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">Hyr në llogari</h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg p-2 mb-3"
        />
        <input
          type="password"
          placeholder="Fjalëkalimi"
          className="w-full border rounded-lg p-2 mb-4"
        />
        <button className="w-full bg-blue-700 text-white rounded-lg p-2 hover:bg-blue-800">
          Hyr
        </button>
      </div>
    </div>
  )
}

export default Login