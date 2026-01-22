import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { teluguMonths, teluguDays } from '../../services/api';
import { usePanchangam } from '../../hooks/usePanchangam';

export default function MonthViewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const yearParam = searchParams.get('year');
  const monthParam = searchParams.get('month');
  
  const [year, setYear] = useState(yearParam ? parseInt(yearParam) : new Date().getFullYear());
  const [month, setMonth] = useState(monthParam ? parseInt(monthParam) : new Date().getMonth());
  
  const today = new Date();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
  const currentDate = today.getDate();

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    navigate(`/day?date=${dateStr}`);
  };

  const getDateStatus = (day: number) => {
    const dayOfWeek = new Date(year, month, day).getDay();
    if (dayOfWeek === 0) return 'festival';
    if (dayOfWeek === 6) return 'auspicious';
    return 'normal';
  };

  const getStatusColor = (status: string, isToday: boolean) => {
    if (isToday) return 'bg-gradient-to-br from-orange-600 to-red-600 text-white';
    if (status === 'festival') return 'bg-red-50 border-red-200 text-red-700';
    if (status === 'auspicious') return 'bg-green-50 border-green-200 text-green-700';
    return 'bg-white border-gray-200 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50 pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-4 shadow-lg z-10">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate('/')}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
          >
            <i className="ri-arrow-left-line text-xl"></i>
          </button>
          <div className="text-center flex-1">
            <h1 className="text-lg font-bold">క్యాలెండర్</h1>
            <p className="text-xs opacity-90">Telugu Calendar by JKV Janardhan</p>
          </div>
          <div className="w-9"></div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevMonth}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <i className="ri-arrow-left-s-line text-xl"></i>
          </button>
          <div className="text-center">
            <p className="text-2xl font-bold">{teluguMonths[month]}</p>
            <p className="text-sm opacity-90">{year}</p>
          </div>
          <button
            onClick={handleNextMonth}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <i className="ri-arrow-right-s-line text-xl"></i>
          </button>
        </div>
      </div>

      <div className="pt-36 px-4">
        {/* Legend */}
        <div className="bg-white rounded-xl shadow-sm p-3 mb-4 border border-gray-100">
          <div className="flex items-center justify-around text-xs">
            <div className="flex items-center space-x-1.5">
              <div className="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
              <span className="text-gray-600">శుభ</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-4 h-4 rounded bg-red-100 border border-red-300"></div>
              <span className="text-gray-600">పండుగ</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-4 h-4 rounded bg-white border-2 border-gray-300"></div>
              <span className="text-gray-600">సాధారణ</span>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-3">
            {['ఆది', 'సోమ', 'మంగళ', 'బుధ', 'గురు', 'శుక్ర', 'శని'].map((day, idx) => (
              <div key={idx} className="text-center">
                <span className={`text-xs font-semibold ${idx === 0 ? 'text-red-600' : 'text-gray-600'}`}>
                  {day}
                </span>
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="aspect-square"></div>;
              }

              const isToday = isCurrentMonth && day === currentDate;
              const status = getDateStatus(day);
              const colorClass = getStatusColor(status, isToday);

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`aspect-square rounded-lg border flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 ${colorClass}`}
                >
                  <span className="text-base font-bold">{day}</span>
                  {status === 'festival' && !isToday && (
                    <i className="ri-cake-line text-xs mt-0.5"></i>
                  )}
                  {status === 'auspicious' && !isToday && (
                    <i className="ri-star-line text-xs mt-0.5"></i>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Info */}
        <div className="mt-4 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl p-4 border border-orange-200">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full">
              <i className="ri-information-line text-xl text-orange-600"></i>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800 mb-1">మరింత వివరాలు చూడండి</p>
              <p className="text-xs text-gray-600">పూర్తి పంచాంగం వివరాలు చూడటానికి తేదీపై క్లిక్ చేయండి</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="grid grid-cols-3 h-16">
          <button
            onClick={() => navigate('/')}
            className="flex flex-col items-center justify-center space-y-0.5 hover:bg-gray-50 transition-colors"
          >
            <i className="ri-home-5-line text-xl text-gray-600"></i>
            <span className="text-[0.625rem] text-gray-600">హోమ్</span>
          </button>
          <button className="flex flex-col items-center justify-center space-y-0.5 bg-orange-50 border-t-2 border-orange-600">
            <i className="ri-calendar-fill text-xl text-orange-600"></i>
            <span className="text-[0.625rem] font-medium text-orange-600">క్యాలెండర్</span>
          </button>
          <button
            onClick={() => navigate('/festivals')}
            className="flex flex-col items-center justify-center space-y-0.5 hover:bg-gray-50 transition-colors"
          >
            <i className="ri-sparkling-2-line text-xl text-gray-600"></i>
            <span className="text-[0.625rem] text-gray-600">పండుగలు</span>
          </button>
        </div>
      </div>
    </div>
  );
}
