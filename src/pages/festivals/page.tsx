import { useNavigate } from "react-router-dom";
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

  const groupedFestivals: Record<number, { date: number; name: string }[]> = {};

  MONTHS_2026.forEach((month, mIndex) => {
    month.days.forEach((day) => {
      if (day.festivals?.length) {
        if (!groupedFestivals[mIndex]) groupedFestivals[mIndex] = [];
        day.festivals.forEach((f: string) =>
          groupedFestivals[mIndex].push({ date: day.date, name: f })
        );
      }
    });
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pb-24">
      {/* HEADER */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-4 shadow-xl z-10">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate("/")} className="text-xl">◀</button>
          <div className="text-center">
            <h1 className="text-lg font-bold">పండుగలు – 2026</h1>
            <p className="text-xs opacity-80">విశ్వావసు సంవత్సరం</p>
          </div>
          <div className="w-6"></div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="pt-24 px-4 space-y-8">
        {Object.keys(groupedFestivals).map((key) => {
          const monthIndex = Number(key);
          return (
            <div key={monthIndex}>
              <h2 className="text-lg font-bold mb-3 text-orange-700">
                {teluguMonths[monthIndex]}
              </h2>

              <div className="space-y-3">
                {groupedFestivals[monthIndex].map((f, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4 border border-orange-200"
                  >
                    <div className="text-2xl">🪔</div>
                    <div>
                      <p className="font-bold">{f.name}</p>
                      <p className="text-xs text-gray-500">
                        {f.date} {teluguMonths[monthIndex]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-4 left-4 right-4 bg-white/95 rounded-xl shadow-xl flex justify-around py-3">
        <button onClick={() => navigate("/")}>హోమ్</button>
        <button>పంచాంగం</button>
        <button className="font-bold text-orange-600">పండుగలు</button>
      </div>
    </div>
  );
}
