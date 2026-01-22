import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { teluguMonths, teluguDays } from '../../services/api';
import { usePanchangam } from '../../hooks/usePanchangam';
import Loading from '../../components/base/Loading';

export default function DayDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date') || new Date().toISOString().split('T')[0];
  
  const { data, loading, error } = usePanchangam(dateParam);
  const dateObj = new Date(dateParam);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const day = dateObj.getDate();
  const dayOfWeek = dateObj.getDay();

  if (!dateParam || !searchParams.get('date')) {
    setTimeout(() => navigate('/'), 0);
    return null;
  }

  if (loading) {
    return <Loading />;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center px-4">
        <div className="text-center">
          <i className="ri-error-warning-line text-6xl text-red-500 mb-4"></i>
          <p className="text-gray-700 mb-4">{error || 'డేటా లోడ్ చేయడంలో విఫలమైంది'}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-orange-600 text-white rounded-lg"
          >
            వెనక్కి వెళ్ళు
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50 pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-4 shadow-lg z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
          >
            <i className="ri-arrow-left-line text-xl"></i>
          </button>
          <div className="text-center flex-1">
            <h1 className="text-lg font-bold">పంచాంగం వివరాలు</h1>
            <p className="text-xs opacity-90">Telugu Calendar by JKV Janardhan</p>
          </div>
          <div className="w-9"></div>
        </div>
      </div>

      <div className="pt-20 px-4 py-5">
        {/* Date Header Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4 border border-orange-100">
          <div className="bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 text-white px-6 py-6 text-center">
            <div className="text-6xl font-bold mb-2">{day}</div>
            <div className="text-xl font-semibold mb-1">{teluguMonths[month]} {year}</div>
            <div className="text-sm opacity-90">{teluguDays[dayOfWeek]}</div>
            {data.cached && (
              <div className="mt-3 inline-flex items-center space-x-1.5 bg-white/20 px-3 py-1 rounded-full text-xs">
                <i className="ri-archive-line"></i>
                <span>కాష్ చేసిన డేటా</span>
              </div>
            )}
          </div>
        </div>

        {/* Festivals */}
        {data.festivals && data.festivals.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl shadow-md p-5 mb-4 border border-yellow-200">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-10 h-10 flex items-center justify-center bg-yellow-100 rounded-full">
                <i className="ri-cake-3-line text-xl text-yellow-700"></i>
              </div>
              <h2 className="text-base font-bold text-gray-800">పండుగలు</h2>
            </div>
            <div className="space-y-2">
              {data.festivals.map((festival, idx) => (
                <div key={idx} className="flex items-center space-x-2 bg-white/60 rounded-lg p-3">
                  <i className="ri-sparkling-line text-yellow-600"></i>
                  <span className="text-sm font-medium text-gray-800">{festival}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Panchangam Details */}
        <div className="bg-white rounded-2xl shadow-lg p-5 mb-4 border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 flex items-center justify-center bg-orange-100 rounded-full">
              <i className="ri-book-open-line text-xl text-orange-700"></i>
            </div>
            <h2 className="text-base font-bold text-gray-800">పంచాంగం</h2>
          </div>

          <div className="space-y-4">
            <PanchangamRow icon="ri-calendar-check-line" label="తిథి" value={data.panchangam.తిథి} color="orange" />
            <PanchangamRow icon="ri-star-line" label="నక్షత్రం" value={data.panchangam.నక్షత్రం} color="purple" />
            <PanchangamRow icon="ri-yoga-line" label="యోగం" value={data.panchangam.యోగం} color="green" />
            <PanchangamRow icon="ri-pulse-line" label="కరణం" value={data.panchangam.కరణం} color="blue" />
          </div>
        </div>

        {/* Inauspicious Times */}
        <div className="bg-white rounded-2xl shadow-lg p-5 mb-4 border border-red-100">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 flex items-center justify-center bg-red-100 rounded-full">
              <i className="ri-alert-line text-xl text-red-700"></i>
            </div>
            <h2 className="text-base font-bold text-gray-800">అశుభ కాలాలు</h2>
          </div>

          <div className="space-y-3">
            <TimeRow icon="ri-time-line" label="రాహుకాలం" value={data.panchangam.రాహుకాలం} bgColor="bg-red-50" textColor="text-red-700" />
            <TimeRow icon="ri-time-line" label="యమగండం" value={data.panchangam.యమగండం} bgColor="bg-orange-50" textColor="text-orange-700" />
            <TimeRow icon="ri-time-line" label="గులిక కాలం" value={data.panchangam.గులిక} bgColor="bg-yellow-50" textColor="text-yellow-700" />
            {data.panchangam.దుర్మహూర్తం && (
              <TimeRow icon="ri-time-line" label="దుర్ముహూర్తం" value={data.panchangam.దుర్మహూర్తం} bgColor="bg-red-50" textColor="text-red-700" />
            )}
          </div>
        </div>

        {/* Auspicious Times */}
        {data.panchangam.అభిజిత్ && (
          <div className="bg-white rounded-2xl shadow-lg p-5 mb-4 border border-green-100">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full">
                <i className="ri-check-double-line text-xl text-green-700"></i>
              </div>
              <h2 className="text-base font-bold text-gray-800">శుభ కాలం</h2>
            </div>
            <TimeRow icon="ri-time-line" label="అభిజిత్ ముహూర్తం" value={data.panchangam.అభిజిత్} bgColor="bg-green-50" textColor="text-green-700" />
          </div>
        )}

        {/* Sun & Moon */}
        <div className="bg-white rounded-2xl shadow-lg p-5 mb-4 border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 flex items-center justify-center bg-yellow-100 rounded-full">
              <i className="ri-sun-line text-xl text-yellow-700"></i>
            </div>
            <h2 className="text-base font-bold text-gray-800">సూర్య చంద్ర వివరాలు</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-100">
              <div className="flex items-center space-x-2 mb-2">
                <i className="ri-sun-line text-orange-600"></i>
                <p className="text-xs text-gray-600">సూర్యోదయం</p>
              </div>
              <p className="text-xl font-bold text-orange-700">{data.sun.sunrise}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center space-x-2 mb-2">
                <i className="ri-moon-line text-blue-600"></i>
                <p className="text-xs text-gray-600">సూర్యాస్తమయం</p>
              </div>
              <p className="text-xl font-bold text-blue-700">{data.sun.sunset}</p>
            </div>
          </div>

          {data.moon && (
            <div className="grid grid-cols-2 gap-3 mt-3">
              {data.moon.moonrise && (
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <p className="text-xs text-gray-600 mb-2">చంద్రోదయం</p>
                  <p className="text-lg font-bold text-purple-700">{data.moon.moonrise}</p>
                </div>
              )}
              {data.moon.moonset && (
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                  <p className="text-xs text-gray-600 mb-2">చంద్రాస్తమయం</p>
                  <p className="text-lg font-bold text-indigo-700">{data.moon.moonset}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Muhurtham */}
        {data.muhurtham && Object.keys(data.muhurtham).length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-5 mb-4 border border-green-100">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full">
                <i className="ri-time-line text-xl text-green-700"></i>
              </div>
              <h2 className="text-base font-bold text-gray-800">ముహూర్తాలు</h2>
            </div>
            <div className="space-y-3">
              {Object.entries(data.muhurtham).map(([key, value], idx) => (
                <TimeRow key={idx} icon="ri-check-line" label={key} value={value} bgColor="bg-green-50" textColor="text-green-700" />
              ))}
            </div>
          </div>
        )}
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
          <button
            onClick={() => navigate(`/month?year=${year}&month=${month}`)}
            className="flex flex-col items-center justify-center space-y-0.5 hover:bg-gray-50 transition-colors"
          >
            <i className="ri-calendar-line text-xl text-gray-600"></i>
            <span className="text-[0.625rem] text-gray-600">క్యాలెండర్</span>
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

      {/* Footer */}
      <div className="text-center py-6">
        <p className="text-xs text-gray-400">Telugu Calendar by JKV Janardhan</p>
      </div>
    </div>
  );
}

function PanchangamRow({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  const colorMap: { [key: string]: { bg: string; text: string; icon: string } } = {
    orange: { bg: 'bg-orange-50', text: 'text-orange-700', icon: 'text-orange-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', icon: 'text-purple-600' },
    green: { bg: 'bg-green-50', text: 'text-green-700', icon: 'text-green-600' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'text-blue-600' },
  };

  const colors = colorMap[color] || colorMap.orange;

  return (
    <div className={`${colors.bg} rounded-xl p-4 border border-${color}-100`}>
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 flex items-center justify-center">
          <i className={`${icon} text-xl ${colors.icon}`}></i>
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-600 mb-0.5">{label}</p>
          <p className={`text-sm font-semibold ${colors.text}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}

function TimeRow({ icon, label, value, bgColor, textColor }: { icon: string; label: string; value: string; bgColor: string; textColor: string }) {
  return (
    <div className={`${bgColor} rounded-xl p-3.5 flex items-center justify-between`}>
      <div className="flex items-center space-x-2.5">
        <i className={`${icon} text-lg ${textColor}`}></i>
        <span className="text-sm font-medium text-gray-800">{label}</span>
      </div>
      <span className={`text-sm font-bold ${textColor}`}>{value}</span>
    </div>
  );
}
