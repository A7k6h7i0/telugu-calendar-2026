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

const WEEK_DAYS = [
  { english: "SUN", telugu: "ఆది" },
  { english: "MON", telugu: "సోమ" },
  { english: "TUE", telugu: "మంగళ" },
  { english: "WED", telugu: "బుధ" },
  { english: "THU", telugu: "గురు" },
  { english: "FRI", telugu: "శుక్ర" },
  { english: "SAT", telugu: "శని" },
];

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

  // Helper function to check if date has Pournami or Amavasya
  const getMoonPhase = (date: number) => {
    const dayData = currentMonth.days.find((d) => d.date === date);
    if (!dayData) return null;

    // Check tithi for Pournami
    const hasPournami =
      dayData.panchangam.tithi.includes("పౌర్ణమి") ||
      dayData.panchangam.tithi.includes("పౌర్ణిమ") ||
      dayData.panchangam.tithi.toLowerCase().includes("pournami") ||
      dayData.festivals.some(
        (f) =>
          f.includes("పౌర్ణమి") ||
          f.includes("పౌర్ణిమ") ||
          f.toLowerCase().includes("pournami")
      );

    const hasAmavasya =
      dayData.panchangam.tithi.includes("అమావాస్య") ||
      dayData.panchangam.tithi.toLowerCase().includes("amavasya") ||
      dayData.festivals.some(
        (f) =>
          f.includes("అమావాస్య") || f.toLowerCase().includes("amavasya")
      );

    if (hasPournami) return "pournami";
    if (hasAmavasya) return "amavasya";
    return null;
  };

  // Helper function to check if date has Ekadashi
  const hasEkadashi = (date: number) => {
    const dayData = currentMonth.days.find((d) => d.date === date);
    if (!dayData) return false;

    return (
      dayData.panchangam.tithi.includes("ఏకాదశి") ||
      dayData.panchangam.tithi.toLowerCase().includes("ekadashi") ||
      dayData.festivals.some(
        (f) =>
          f.includes("ఏకాదశి") || f.toLowerCase().includes("ekadashi")
      )
    );
  };

  // Build calendar grid properly aligned to weekdays
  const buildCalendarGrid = () => {
    const firstDay = currentMonth.days[0];
    const startDayIndex = WEEK_DAYS.findIndex(
      (day) => day.telugu === firstDay.day
    );

    // Create 6 weeks (42 cells) to cover all possibilities
    const grid = Array(42).fill(null);

    currentMonth.days.forEach((day, index) => {
      grid[startDayIndex + index] = day;
    });

    return grid;
  };

  const calendarGrid = buildCalendarGrid();

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="min-h-screen bg-gradient-to-br from-slate-700 via-slate-600 to-gray-700 pb-24"
    >
      {/* HEADER - Mobile First */}
      <div className="sticky top-0 z-20 bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg">
        <div className="text-center pt-4 pb-2">
          <h1 className="text-3xl font-extrabold tracking-wide leading-tight">
            తెలుగు క్యాలెండర్ <br />
            TELUGU CALENDER
          </h1>
          <p className="text-base font-serif font-bold mt-1.5 tracking-widest" style={{ letterSpacing: '0.15em' }}>
            by JKV JANARDHAN
          </p>
        </div>

        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={goPrevMonth}
            className="text-2xl font-bold active:scale-90 transition-transform px-2"
          >
            ◀
          </button>

          <div className="text-center">
            <div className="text-lg font-bold">{currentMonth.month} – 2026</div>
            <div className="text-xs opacity-90">
              {currentMonth.samvatsaram} సంవత్సరం
            </div>
          </div>

          <button
            onClick={goNextMonth}
            className="text-2xl font-bold active:scale-90 transition-transform px-2"
          >
            ▶
          </button>
        </div>
      </div>

      {/* CALENDAR GRID - Mobile Optimized with Updated Background */}
      <div className="mx-3 mt-4 rounded-2xl bg-gradient-to-br from-orange-300 via-amber-200 to-yellow-200 shadow-lg p-3 border-4 border-orange-500">
        {/* WEEK DAYS HEADER - Styled with English above Telugu */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEK_DAYS.map((day, i) => (
            <div
              key={day.telugu}
              className={`
                text-center font-extrabold py-1.5 rounded-md flex flex-col items-center justify-center
                ${i === 0 
                  ? "bg-red-500 text-white" 
                  : "bg-amber-200 text-gray-800"
                }
              `}
            >
              <div className="text-xs font-bold leading-tight">
                {day.english}
              </div>
              <div className={`leading-tight ${day.telugu === "మంగళ" ? "text-[10px]" : "text-xs"}`}>
                {day.telugu}
              </div>
            </div>
          ))}
        </div>

        {/* DATES GRID - Properly Aligned with Rectangular Boxes */}
        <div className="grid grid-cols-7 gap-1">
          {calendarGrid.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const isSelected = day.date === selectedDate;
            const isSun = day.day === "ఆది";
            const isToday =
              is2026 &&
              monthIndex === todayMonthIndex &&
              day.date === todayDate;
            const moonPhase = getMoonPhase(day.date);
            const isEkadashi = hasEkadashi(day.date);

            return (
              <button
                key={`${day.date}-${index}`}
                onClick={() => setSelectedDate(day.date)}
                className={`
                  relative aspect-square rounded-lg flex items-center justify-center
                  text-lg font-extrabold transition-all shadow-md
                  active:scale-95
                  ${
                    isSelected
                      ? "bg-orange-500 text-white scale-105 shadow-lg"
                      : "bg-gradient-to-br from-gray-600 to-gray-700 text-white"
                  }
                  ${isSun && !isSelected ? "!text-red-400" : ""}
                  ${isToday ? "ring-4 ring-yellow-400 ring-offset-2" : ""}
                `}
              >
                {day.date}
                
                {/* Moon Phase Indicator - Larger Size */}
                {moonPhase && (
                  <div className="absolute top-0.5 right-0.5">
                    {moonPhase === "pournami" ? (
                      <div className="w-3.5 h-3.5 rounded-full bg-white shadow-md border border-yellow-300"></div>
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full bg-black border-2 border-white shadow-md"></div>
                    )}
                  </div>
                )}
                
                {/* Ekadashi Indicator - Lord Shiva Trishul */}
                {isEkadashi && (
                  <div className="absolute top-0.5 left-0.5">
                    <span className="text-base drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.8))' }}>
                      🔱
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* DETAILS CARD - Mobile Optimized */}
      {selectedDayData && (
        <div className="mx-3 mt-4 rounded-2xl bg-white shadow-lg p-4 border-2 border-orange-300">
          <div className="text-center font-bold text-xl mb-3 text-orange-700">
            {selectedDayData.date} – {selectedDayData.day}
          </div>

          {/* FESTIVALS */}
          {selectedDayData.festivals.length > 0 && (
            <div className="mb-4 flex flex-wrap justify-center gap-2">
              {selectedDayData.festivals.map((festival, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold border border-orange-300"
                >
                  {festival}
                </span>
              ))}
            </div>
          )}

          {/* PANCHANG DETAILS */}
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-800 mb-4">
            <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
              <p className="text-xs text-gray-600 mb-1">తిథి</p>
              <p className="font-bold text-gray-800">
                {selectedDayData.panchangam.tithi}
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
              <p className="text-xs text-gray-600 mb-1">నక్షత్రం</p>
              <p className="font-bold text-gray-800">
                {selectedDayData.panchangam.nakshatram}
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
              <p className="text-xs text-gray-600 mb-1">రాహుకాలం</p>
              <p className="font-bold text-gray-800">
                {selectedDayData.panchangam.rahukalam}
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
              <p className="text-xs text-gray-600 mb-1">యమగండం</p>
              <p className="font-bold text-gray-800">
                {selectedDayData.panchangam.yamagandam}
              </p>
            </div>
          </div>

          {/* SUNRISE / SUNSET */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-gradient-to-br from-orange-100 to-orange-50 border-2 border-orange-300 p-3 text-center">
              <p className="text-xs text-gray-600 mb-1 font-semibold">
                సూర్యోదయం
              </p>
              <p className="text-xl font-extrabold text-orange-700">06:05</p>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-orange-100 to-orange-50 border-2 border-orange-300 p-3 text-center">
              <p className="text-xs text-gray-600 mb-1 font-semibold">
                సూర్యాస్తమయం
              </p>
              <p className="text-xl font-extrabold text-orange-700">06:30</p>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM NAV - Mobile First */}
      <div className="fixed bottom-3 left-3 right-3 bg-white rounded-xl shadow-lg flex justify-around py-3 border-2 border-orange-300">
        <button className="font-bold text-orange-600 text-base active:scale-95 transition-transform">
          హోమ్
        </button>
        <button
          onClick={() => navigate(`/festivals?month=${monthIndex}`)}
          className="font-semibold text-gray-700 text-base active:scale-95 transition-transform"
        >
          పండుగలు
        </button>
        <button className="font-semibold text-gray-700 text-base active:scale-95 transition-transform">
          పంచాంగం
        </button>
      </div>
    </div>
  );
}
