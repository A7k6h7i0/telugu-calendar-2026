import { useNavigate, useParams } from "react-router-dom";
import { RASI_LIST } from "../../data/rashiphalalu";

const RASI_ICONS: Record<string, string> = {
  mesham: "/assets/mesham.jpg",
  vrushabham: "/assets/vrushaba.jpg",
  mithunam: "/assets/mithunam.jpg",
  karkatakam: "/assets/karkatam.jpg",
  simham: "/assets/simham.jpg",
  kanya: "/assets/kanya.jpg",
  thula: "/assets/thula.jpg",
  vruschikam: "/assets/vruschikam.jpg",
  dhanassu: "/assets/dhanassu.jpg",
  makaram: "/assets/makaram.jpg",
  kumbham: "/assets/kumbham.jpg",
  meenam: "/assets/meenam.jpg",
};

export default function RasiSelectionPage() {
  const navigate = useNavigate();
  const { type = "daily" } = useParams<{ type: string }>();

  const TYPE_LABEL: Record<string, string> = {
    daily: "దిన ఫలాలు",
    dhinaphalalu: "దిన ఫలాలు",
    weekly: "వార ఫలాలు",
    varaphalalu: "వార ఫలాలు",
    monthly: "మాస ఫలాలు",
    masaphalalu: "మాస ఫలాలు",
    yearly: "సంవత్సర ఫలాలు",
    samvatsaraphalalu: "సంవత్సర ఫలాలు",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pb-24">
      {/* HEADER */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-xl">
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={() => navigate(-1)} className="text-xl font-bold">
            ◀
          </button>

          <div className="text-center">
            <h1 className="text-lg font-bold">రాశి ఎంపిక</h1>
            <p className="text-xs opacity-90">{TYPE_LABEL[type]} – 2026</p>
          </div>

          <div className="w-6" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="pt-24 px-4">
        <div className="grid grid-cols-3 gap-4">
          {RASI_LIST.map((rasi) => (
            <button
              key={rasi.key}
              onClick={() => navigate(`/rashiphalalu/${type}/${rasi.key}`)}
              className="bg-white rounded-xl shadow-md border border-orange-200 py-4 flex flex-col items-center justify-center hover:bg-orange-50 transition"
            >
              {/* ICON */}
              <div className="mb-2 h-12 w-12 rounded-full bg-white ring-1 ring-orange-200 shadow-sm flex items-center justify-center overflow-hidden">
                <img
                  src={RASI_ICONS[rasi.key]}
                  alt={`${rasi.name} icon`}
                  className="h-full w-full object-cover rounded-full"
                  loading="lazy"
                />
              </div>

              {/* NAME */}
              <div className="font-bold text-gray-800 text-sm">{rasi.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-4 left-4 right-4 bg-white rounded-xl shadow-xl flex justify-around py-3 border border-orange-200">
        <button onClick={() => navigate("/")}>హోమ్</button>
        <button onClick={() => navigate("/festivals")}>పండుగలు</button>
        <button className="font-bold text-orange-600">రాశి ఫలాలు</button>
      </div>
    </div>
  );
}
