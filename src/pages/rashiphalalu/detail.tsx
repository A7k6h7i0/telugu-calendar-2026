import { useParams, useNavigate } from "react-router-dom";
import { getRashiphalam } from "../../engine/rashiphalamEngine";
import { RASI_LIST } from "../../data/rashiphalalu";

export default function RashiDetailPage() {
  const navigate = useNavigate();
  const { type = "daily", rasi } = useParams();

  const rasiData = RASI_LIST.find((r) => r.key === rasi);

  if (!rasiData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        రాశి సమాచారం దొరకలేదు
      </div>
    );
  }

  const result = getRashiphalam(
    rasiData.data,
    type,
    new Date()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 px-4 py-6">
      {/* HEADER */}
      <div className="flex items-center mb-4">
        <button onClick={() => navigate(-1)} className="mr-3 text-xl">◀</button>
        <h1 className="text-lg font-bold text-orange-700">
          {rasiData.name} –
          {type === "daily" && " దిన ఫలాలు"}
          {type === "dhinaphalalu" && " దిన ఫలాలు"}
          {type === "weekly" && " వార ఫలాలు"}
          {type === "varaphalalu" && " వార ఫలాలు"}
          {type === "monthly" && " మాస ఫలాలు"}
          {type === "masaphalalu" && " మాస ఫలాలు"}
          {type === "yearly" && " సంవత్సర ఫలాలు"}
          {type === "samvatsaraphalalu" && " సంవత్సర ఫలాలు"}
        </h1>
      </div>

      {/* CONTENT */}
      <div className="bg-white rounded-3xl shadow-xl p-5 border border-orange-200">
        <p className="text-sm leading-7 text-gray-800 whitespace-pre-line">
          {result.text}
        </p>

        {Object.keys(result.stats).length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-4">
            {Object.entries(result.stats).map(([k, v]) => (
              <div key={k}>
                <p className="text-xs text-gray-500">{k}</p>
                <div className="h-2 bg-gray-200 rounded-full mt-1">
                  <div
                    className="h-2 bg-orange-500 rounded-full"
                    style={{ width: `${v}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
