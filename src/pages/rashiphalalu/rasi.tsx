import { useNavigate, useParams } from "react-router-dom";
import { RASI_LIST } from "../../data/rashiphalalu";

export default function RasiSelectionPage() {
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 px-4 py-6">
      <h1 className="text-xl font-bold text-orange-700 mb-6 text-center">
        రాశిని ఎంచుకోండి
      </h1>

      <div className="grid grid-cols-3 gap-4">
        {RASI_LIST.map((rasi) => (
          <button
            key={rasi.key}
            onClick={() =>
              navigate(`/rashiphalalu/${type}/${rasi.key}`)
            }
            className="bg-white rounded-xl shadow-md border border-orange-200 py-4 font-semibold text-gray-800 hover:bg-orange-50 transition"
          >
            {rasi.name}
          </button>
        ))}
      </div>
    </div>
  );
}
