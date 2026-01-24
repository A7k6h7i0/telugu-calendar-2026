import { useNavigate } from "react-router-dom";

const TYPES = [
  { key: "daily", label: "దిన ఫలాలు" },
  { key: "weekly", label: "వార ఫలాలు" },
  { key: "monthly", label: "మాస ఫలాలు" },
  { key: "yearly", label: "సంవత్సర ఫలాలు" },
];

export default function RashiphalaluHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 px-4 py-6">
      <h1 className="text-xl font-bold text-orange-700 mb-6 text-center">
        రాశిఫలాలు
      </h1>

      <div className="grid grid-cols-2 gap-4">
        {TYPES.map((t) => (
          <button
            key={t.key}
            onClick={() => navigate(`/rashiphalalu/${t.key}`)}
            className="bg-white rounded-2xl shadow-lg border border-orange-200 p-6 font-semibold text-orange-700 hover:bg-orange-50 transition"
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
