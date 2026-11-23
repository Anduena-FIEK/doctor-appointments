const doctors = [
  { id: 1, name: "Dr. Arben Krasniqi", specialty: "Kardiolog", days: "Hënë, Mërkurë, Premte" },
  { id: 2, name: "Dr. Elira Gashi", specialty: "Pediatër", days: "Të Martë, Të Enjte" },
  { id: 3, name: "Dr. Besnik Hoxha", specialty: "Dermatolog", days: "Hënë - Premte" },
]

function Doctors() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-blue-50 p-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Doktorët</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-xl font-semibold">{doctor.name}</h2>
            <p className="text-gray-600">{doctor.specialty}</p>
            <p className="text-sm text-gray-500 mt-2">Ditët: {doctor.days}</p>
            <button className="mt-4 bg-blue-700 text-white rounded-lg px-4 py-2 hover:bg-blue-800">
              Cakto termin
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Doctors