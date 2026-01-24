import { useParams, useNavigate } from "react-router-dom";
import { getRashiphalam } from "../../engine/rashiphalamEngine";
import { RASI_LIST } from "../../data/rashiphalalu";

/* 🎨 Telugu color → Tailwind map */
const COLOR_CLASS: Record<string, string> = {
  ఎరుపు: "bg-red-500 text-white",
  పసుపు: "bg-yellow-400 text-black",
  ఆకుపచ్చ: "bg-green-500 text-white",
  నీలం: "bg-blue-500 text-white",
  తెలుపు: "bg-gray-100 text-black border",
  నలుపు: "bg-black text-white",
  గులాబీ: "bg-pink-400 text-white",
};

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

  /* ✅ SHOW COLORS ONLY FOR DINAPHALALU */
  const showColors =
    type === "daily" || type === "dhinaphalalu";

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pb-24">

      {/* HEADER */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-xl">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="text-xl font-bold"
          >
            ◀
          </button>

          <div className="text-center">
            <h1 className="text-lg font-bold">రాశి ఫలాలు</h1>
            
          </div>

          <div className="w-6" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="pt-24 px-4">
        <div className="bg-white rounded-3xl shadow-xl p-5 border border-orange-200">

          {/* TITLE */}
          <h2 className="text-xl font-bold text-orange-700 mb-4">
            {rasiData.name} –
            {type === "daily" || type === "dhinaphalalu" ? " దిన ఫలాలు" : ""}
            {type === "weekly" || type === "varaphalalu" ? " వార ఫలాలు" : ""}
            {type === "monthly" || type === "masaphalalu" ? " మాస ఫలాలు" : ""}
            {type === "yearly" || type === "samvatsaraphalalu"
              ? " సంవత్సర ఫలాలు"
              : ""}
          </h2>

          {/* 🔮 ROTATING RASHIPHALAM TEXT */}
          <p className="text-sm leading-7 text-gray-800 whitespace-pre-line mb-6">
            {result.text}
          </p>

          {/* 🎨 COLOR PREFERENCE – ONLY FOR DAILY */}
          {showColors && result.colors && result.colors.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                ఈ రోజు ధరించాల్సిన రంగులు:
              </p>
              <div className="flex flex-wrap gap-2">
                {result.colors.map((c) => (
                  <span
                    key={c}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      COLOR_CLASS[c] || "bg-gray-300 text-black"
                    }`}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 📊 STATS – VERTICAL */}
          {result.stats && (
            <div className="space-y-2 text-sm text-gray-800">
              <p>– ఆరోగ్యం: {result.stats["ఆరోగ్యం"]}%</p>
              <p>– సంపద: {result.stats["సంపద"]}%</p>
              <p>– కుటుంబం: {result.stats["కుటుంబం"]}%</p>
              <p>– ప్రేమ సంబంధిత విషయాలు: {result.stats["ప్రేమ"]}%</p>
              <p>– వృత్తి: {result.stats["వృత్తి"]}%</p>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-4 left-4 right-4 bg-white rounded-xl shadow-xl flex justify-around py-3 border border-orange-200">
        <button onClick={() => navigate("/")}>హోమ్</button>
        <button onClick={() => navigate("/festivals")}>పండుగలు</button>
        <button className="font-bold text-orange-600">
          రాశి ఫలాలు
        </button>
      </div>
    </div>
  );
}
