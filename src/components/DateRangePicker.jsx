// components/shared/DateRangePicker.jsx
import React, { useState } from 'react';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isToday } from 'date-fns';
import { uz } from 'date-fns/locale';

const DateRangePicker = ({ onChange, initialStartDate, initialEndDate }) => {
  const [startDate, setStartDate] = useState(initialStartDate ? new Date(initialStartDate) : subDays(new Date(), 7));
  const [endDate, setEndDate] = useState(initialEndDate ? new Date(initialEndDate) : new Date());
  const [view, setView] = useState('range'); // 'range', 'week', 'month', 'custom'
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateSelect = (type, date) => {
    if (type === 'start') {
      const newStartDate = date;
      setStartDate(newStartDate);
      if (newStartDate > endDate) {
        setEndDate(newStartDate);
        onChange(format(newStartDate, 'yyyy-MM-dd'), format(newStartDate, 'yyyy-MM-dd'));
      } else {
        onChange(format(newStartDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'));
      }
    } else {
      const newEndDate = date;
      setEndDate(newEndDate);
      if (newEndDate < startDate) {
        setStartDate(newEndDate);
        onChange(format(newEndDate, 'yyyy-MM-dd'), format(newEndDate, 'yyyy-MM-dd'));
      } else {
        onChange(format(startDate, 'yyyy-MM-dd'), format(newEndDate, 'yyyy-MM-dd'));
      }
    }
  };

  const handleQuickSelect = (type) => {
    const today = new Date();
    let newStartDate, newEndDate;

    switch (type) {
      case 'today':
        newStartDate = today;
        newEndDate = today;
        break;
      case 'yesterday':
        newStartDate = subDays(today, 1);
        newEndDate = newStartDate;
        break;
      case 'thisWeek':
        newStartDate = startOfWeek(today, { weekStartsOn: 1 });
        newEndDate = endOfWeek(today, { weekStartsOn: 1 });
        break;
      case 'lastWeek':
        newStartDate = startOfWeek(subDays(today, 7), { weekStartsOn: 1 });
        newEndDate = endOfWeek(subDays(today, 7), { weekStartsOn: 1 });
        break;
      case 'thisMonth':
        newStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
        newEndDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'lastMonth':
        newStartDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        newEndDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      default:
        return;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
    onChange(format(newStartDate, 'yyyy-MM-dd'), format(newEndDate, 'yyyy-MM-dd'));
  };

  const generateWeekDays = () => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    return eachDayOfInterval({
      start: weekStart,
      end: addDays(weekStart, 6)
    });
  };

  const weekDays = generateWeekDays();

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900 flex items-center">
          <CalendarIcon className="h-4 w-4 mr-2" />
          Sana oralig'i
        </h3>
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {showCalendar ? 'Yopish' : 'Tanlash'}
        </button>
      </div>

      {/* Sana ko'rsatkichlari */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="px-3 py-2 border rounded-md text-sm">
            {format(startDate, 'dd.MM.yyyy', { locale: uz })}
          </div>
          <span className="text-gray-400">-</span>
          <div className="px-3 py-2 border rounded-md text-sm">
            {format(endDate, 'dd.MM.yyyy', { locale: uz })}
          </div>
        </div>
        <div className="text-sm text-gray-600">
          {Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1} kun
        </div>
      </div>

      {/* Tezkor tanlov tugmalari */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => handleQuickSelect('today')}
          className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Bugun
        </button>
        <button
          onClick={() => handleQuickSelect('yesterday')}
          className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Kecha
        </button>
        <button
          onClick={() => handleQuickSelect('thisWeek')}
          className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Bu hafta
        </button>
        <button
          onClick={() => handleQuickSelect('lastWeek')}
          className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          O'tgan hafta
        </button>
        <button
          onClick={() => handleQuickSelect('thisMonth')}
          className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Bu oy
        </button>
      </div>

      {/* Kalendar ko'rinishi */}
      {showCalendar && (
        <div className="border rounded-lg p-4 mt-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => {
                setStartDate(subDays(startDate, 7));
                setEndDate(subDays(endDate, 7));
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            <div className="text-sm font-medium">
              {format(startDate, 'MMMM yyyy', { locale: uz })} - {format(endDate, 'MMMM yyyy', { locale: uz })}
            </div>
            <button
              onClick={() => {
                setStartDate(addDays(startDate, 7));
                setEndDate(addDays(endDate, 7));
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRightIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Hafta kunlari */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Haftalik sana tanlovi */}
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map(day => {
              const isSelected = day >= startDate && day <= endDate;
              const isCurrent = isToday(day);
              
              return (
                <button
                  key={day.toString()}
                  onClick={() => handleDateSelect('start', day)}
                  className={`
                    h-8 w-8 rounded-full text-sm flex items-center justify-center
                    ${isSelected ? 'bg-blue-600 text-white' : ''}
                    ${isCurrent && !isSelected ? 'bg-blue-100 text-blue-600' : ''}
                    ${!isSelected && !isCurrent ? 'hover:bg-gray-100 text-gray-700' : ''}
                  `}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>

          {/* Tanlash variantlari */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Boshlanish sanasi
              </label>
              <input
                type="date"
                value={format(startDate, 'yyyy-MM-dd')}
                onChange={(e) => handleDateSelect('start', new Date(e.target.value))}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tugash sanasi
              </label>
              <input
                type="date"
                value={format(endDate, 'yyyy-MM-dd')}
                onChange={(e) => handleDateSelect('end', new Date(e.target.value))}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* View tanlovi */}
      <div className="mt-4 pt-4 border-t">
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Ko'rinish turi
        </label>
        <div className="flex space-x-2">
          {[
            { value: 'daily', label: 'Kunlik' },
            { value: 'weekly', label: 'Haftalik' },
            { value: 'monthly', label: 'Oylik' },
            { value: 'summary', label: 'Yig\'ma' }
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setView(option.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                view === option.value
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;