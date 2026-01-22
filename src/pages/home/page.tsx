import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

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

const WEEK_DAYS = ["ఆది", "సోమ", "మంగళ", "బుధ", "గురు", "శుక్ర", "శని"];

export default function HomePage() {
  const navigate = useNavigate();
  const touchStartX = useRef<number | null>(null);

  const today = new Date();
  const is2026 = today.getFullYear() === 2026;
  const todayMonthIndex = is2026 ? today.getMonth() : 0;
  const todayDate = today.getDate();

  const [monthIndex, setMonthIndex] = useState(todayMonthIndex);
  const currentMonth = MONTHS_2026[monthIndex];

  const [selectedDate, setSelectedDate] = useState(
    is2026 && monthIndex === todayMonthIndex
      ? todayDate
      : currentMonth.days[0].date
  );

  const selectedDayData = currentMonth.days.find(
    (d) => d.date === selectedDate
  );

  /* ---------- MONTH ROTATION ---------- */
  const goPrevMonth = () => {
    const prev = (monthIndex + 11) % 12;
    setMonthIndex(prev);
    setSelectedDate(MONTHS_2026[prev].days[0].date);
  };

  const goNextMonth = () => {
    const next = (monthIndex + 1) % 12;
    setMonthIndex(next);
    setSelectedDate(MONTHS_2026[next].days[0].date);
  };

  /* ---------- SWIPE ---------- */
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) goNextMonth();
    if (diff < -50) goPrevMonth();
    touchStartX.current = null;
  };

  const startIndex = WEEK_DAYS.indexOf(currentMonth.days[0].day);

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pb-28"
    >
      {/* HEADER */}
      <div className="sticky top-0 z-20 bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-xl">
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={goPrevMonth} className="text-xl">◀</button>

          <div className="text-center">
            <div className="text-lg font-bold">
              {currentMonth.month} – 2026
            </div>
            <div className="text-xs opacity-90">
              {currentMonth.samvatsaram} సంవత్సరం
            </div>
          </div>

          <button onClick={goNextMonth} className="text-xl">▶</button>
        </div>
      </div>

      {/* WEEK DAYS */}
      <div className="grid grid-cols-7 text-center text-xs py-3 font-semibold text-gray-700">
        {WEEK_DAYS.map((d, i) => (
          <div key={d} className={i === 0 ? "text-red-500" : ""}>
            {d}
          </div>
        ))}
      </div>

      {/* CALENDAR GRID */}
      <div className="mx-4 rounded-3xl bg-white shadow-xl p-4 border border-orange-200">
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: startIndex }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {currentMonth.days.map((day) => {
            const isSelected = day.date === selectedDate;
            const isSun = day.day === "ఆది";
            const isToday =
              is2026 &&
              monthIndex === todayMonthIndex &&
              day.date === todayDate;

            return (
              <button
                key={day.date}
                onClick={() => setSelectedDate(day.date)}
                className={`
                  relative aspect-square rounded-xl flex items-center justify-center
                  text-sm font-bold transition-all border
                  ${
                    isSelected
                      ? "bg-orange-500 text-white border-orange-600 shadow-lg"
                      : "bg-orange-50 border-orange-200"
                  }
                  ${isSun ? "text-red-500" : "text-gray-800"}
                  ${isToday ? "ring-2 ring-yellow-400" : ""}
                `}
              >
                {day.date}
              </button>
            );
          })}
        </div>
      </div>

      {/* DETAILS CARD */}
      {selectedDayData && (
        <div className="mx-4 mt-5 rounded-3xl bg-white shadow-xl p-5 border border-orange-200">
          <div className="text-center font-bold text-lg mb-4 text-orange-700">
            {selectedDayData.date} – {selectedDayData.day}
          </div>

          {/* 🌅 SUNRISE / SUNSET */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="rounded-2xl bg-orange-50 border border-orange-200 p-4 text-center">
              <p className="text-xs text-gray-500">సూర్యోదయం</p>
              <p className="text-lg font-bold text-orange-600">06:05</p>
            </div>
            <div className="rounded-2xl bg-orange-50 border border-orange-200 p-4 text-center">
              <p className="text-xs text-gray-500">సూర్యాస్తమయం</p>
              <p className="text-lg font-bold text-orange-600">06:30</p>
            </div>
          </div>

          {/* FESTIVALS */}
          {selectedDayData.festivals.length > 0 && (
            <div className="mb-4 flex flex-wrap justify-center gap-2">
              {selectedDayData.festivals.map((festival, i) => (
                <span
                  key={i}
                  className="px-4 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold"
                >
                  {festival}
                </span>
              ))}
            </div>
          )}

          {/* PANCHANG DETAILS */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
            <div>
              <p className="text-xs text-gray-500">తిథి</p>
              <p className="font-semibold">{selectedDayData.panchangam.tithi}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">నక్షత్రం</p>
              <p className="font-semibold">{selectedDayData.panchangam.nakshatram}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">రాహుకాలం</p>
              <p className="font-semibold">{selectedDayData.panchangam.rahukalam}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">యమగండం</p>
              <p className="font-semibold">{selectedDayData.panchangam.yamagandam}</p>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM NAV */}
      <div className="fixed bottom-4 left-4 right-4 bg-white rounded-xl shadow-xl flex justify-around py-3 border border-orange-200">
        <button className="font-bold text-orange-600">హోమ్</button>
        <button onClick={() => navigate("/festivals")}>పండుగలు</button>
        <button>పంచాంగం</button>
      </div>
    </div>
  );
}
