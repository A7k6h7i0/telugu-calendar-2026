import { useNavigate, useParams } from "react-router-dom";

const RASIS = [
  { key: "mesham", label: "మేషం" },
  { key: "vrushabham", label: "వృషభం" },
  { key: "mithunam", label: "మిథునం" },
  { key: "karkatakam", label: "కర్కాటకం" },
  { key: "simham", label: "సింహం" },
  { key: "kanya", label: "కన్య" },
  { key: "thula", label: "తుల" },
  { key: "vruschikam", label: "వృశ్చికం" },
  { key: "dhanassu", label: "ధనుస్సు" },
  { key: "makaram", label: "మకరం" },
  { key: "kumbham", label: "కుంభం" },
  { key: "meenam", label: "మీనం" },
];

export default function RashiList() {
  const navigate = useNavigate();
  const { type = "daily" } = useParams();

  const TYPE_LABEL: Record<string, string> = {
    daily: "దిన ఫలాలు",
    weekly: "వార ఫలాలు",
    monthly: "మాస ఫలాలు",
    yearly: "సంవత్సర ఫలాలు",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pb-24">
      
      {/* HEADER – FIXED */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-xl">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="text-xl font-bold"
          >
            ◀
          </button>

          <div className="text-center">
            <h1 className="text-lg font-bold">రాశి ఎంపిక</h1>
            <p className="text-xs opacity-90">
              {TYPE_LABEL[type]} – 2026
            </p>
          </div>

          <div className="w-6" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="pt-24 px-4">
        <div className="grid grid-cols-3 gap-4">
          {RASIS.map((r) => (
            <button
              key={r.key}
              onClick={() =>
                navigate(`/rashiphalalu/${type}/${r.key}`)
              }
              className="bg-white rounded-xl shadow-md border border-orange-200 p-4 text-center font-bold text-gray-800 hover:bg-orange-50 transition"
            >
              {r.label}
            </button>
          ))}
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
