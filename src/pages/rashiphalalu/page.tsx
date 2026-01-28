import { useNavigate, useSearchParams } from "react-router-dom";

const TYPES = [
  { key: "daily", label: "దిన ఫలాలు" },
  { key: "weekly", label: "వార ఫలాలు" },
  { key: "monthly", label: "మాస ఫలాలు" },
  { key: "yearly", label: "సంవత్సర ఫలాలు" },
];

export default function RashiphalaluHome() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ✅ read month (if coming from Home/Festivals), so Home can be restored
  const urlMonthIndex = searchParams.get("month");
  const selectedMonthIndex = urlMonthIndex ? parseInt(urlMonthIndex, 10) : new Date().getMonth();

  const goHomeWithMonth = () => {
    navigate(`/?month=${selectedMonthIndex}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pb-24">
      {/* HEADER – FIXED */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-xl">
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={goHomeWithMonth} className="text-xl font-bold">
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
        <div className="grid grid-cols-2 gap-4">
          {TYPES.map((t) => (
            <button
              key={t.key}
              onClick={() => navigate(`/rashiphalalu/${t.key}?month=${selectedMonthIndex}`)}
              className="bg-white rounded-2xl shadow-lg border border-orange-200 p-6 font-semibold text-orange-700 hover:bg-orange-50 transition"
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-4 left-4 right-4 bg-white rounded-xl shadow-xl flex justify-around py-3 border border-orange-200">
        <button onClick={goHomeWithMonth}>హోమ్</button>
        <button onClick={() => navigate(`/festivals?month=${selectedMonthIndex}`)}>పండుగలు</button>
        <button className="font-bold text-orange-600">రాశి ఫలాలు</button>
      </div>
    </div>
  );
}
