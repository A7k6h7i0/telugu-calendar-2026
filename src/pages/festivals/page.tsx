import { useNavigate, useSearchParams } from "react-router-dom";
import { teluguMonths } from "../../services/api";

import {
  january2026,
  february2026,
  march2026,
  april2026,
  may2026,
  june2026,
  july2026,
  august2026,
  september2026,
  october2026,
  november2026,
  december2026,
} from "../../data/calendar-2026";

const MONTHS_2026 = [
  january2026,
  february2026,
  march2026,
  april2026,
  may2026,
  june2026,
  july2026,
  august2026,
  september2026,
  october2026,
  november2026,
  december2026,
];

export default function FestivalsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get selected month from URL parameter, default to current month
  const urlMonthIndex = searchParams.get("month");
  const selectedMonthIndex = urlMonthIndex ? parseInt(urlMonthIndex, 10) : new Date().getMonth();

  // Get the selected month data
  const selectedMonth = MONTHS_2026[selectedMonthIndex];

  // Group festivals only for the selected month
  const monthFestivals: { date: number; name: string }[] = [];

  selectedMonth.days.forEach((day) => {
    if (day.festivals?.length) {
      day.festivals.forEach((f: string) => monthFestivals.push({ date: day.date, name: f }));
    }
  });

  const goHomeWithMonth = () => {
    navigate(`/?month=${selectedMonthIndex}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pb-24">
      {/* HEADER */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-4 shadow-xl z-10">
        <div className="flex items-center justify-between">
          <button onClick={goHomeWithMonth} className="text-xl font-bold">
            ◀
          </button>

          <div className="text-center">
            <h1 className="text-xl font-bold">{teluguMonths[selectedMonthIndex]} పండుగలు మరియు ముఖ్యమైన దినాలు</h1>
            <p className="text-xs opacity-90">{selectedMonth.samvatsaram} సంవత్సరం</p>
          </div>

          <div className="w-6"></div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="pt-20 px-4">
        {monthFestivals.length > 0 ? (
          <div className="space-y-3">
            {monthFestivals.map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4 border-2 border-orange-200 active:scale-98 transition-transform"
              >
                <div className="text-3xl">🪔</div>
                <div className="flex-1">
                  <p className="font-bold text-base text-gray-800">{f.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {f.date} {teluguMonths[selectedMonthIndex]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">ఈ నెలలో పండుగలు లేవు</p>
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-4 left-4 right-4 bg-white rounded-xl shadow-xl flex justify-around py-3 border-2 border-orange-300">
        <button
          onClick={goHomeWithMonth}
          className="font-semibold text-gray-700 text-base active:scale-95 transition-transform"
        >
          హోమ్
        </button>

        <button className="font-bold text-orange-600 text-base">పండుగలు</button>

        <button onClick={() => navigate(`/rashiphalalu?month=${selectedMonthIndex}`)}>
          రాశిఫలాలు
        </button>
      </div>
    </div>
  );
}
