"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const EnhancedDatePicker = ({ value, onChange, name, id, className }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState("days"); // 'days', 'months', 'years'
  const [yearRange, setYearRange] = useState([]);
  const calendarRef = useRef(null);
  const inputRef = useRef(null);

  // Format date as YYYY-MM-DD
  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Format date as DD/MM/YYYY for display
  const formatDateForDisplay = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Parse YYYY-MM-DD to Date object
  const parseDate = (dateString) => {
    if (!dateString || dateString.length === 0) return null;
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  // Check if two dates are the same day
  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  // Initialize selected date from value prop if it exists
  useEffect(() => {
    if (value && value.length > 0) {
      const date = parseDate(value);
      if (date && !isNaN(date.getTime())) {
        setSelectedDate(date);
        setCurrentMonth(date);
      }
    }
  }, [value]);

  // Generate year range whenever the view changes to years
  useEffect(() => {
    if (viewMode === "years") {
      const year = currentMonth.getFullYear();
      const startYear = Math.floor(year / 10) * 10 - 1;
      const years = [];
      for (let i = 0; i < 12; i++) {
        years.push(startYear + i);
      }
      setYearRange(years);
    }
  }, [viewMode, currentMonth]);

  // Click outside handler to close calendar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowCalendar(false);
        setViewMode("days"); // Reset view mode when closing
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
    setViewMode("days"); // Reset view mode

    // Format date to yyyy-MM-dd for the input value
    const formattedDate = formatDateForInput(date);

    // Trigger onChange with the event-like object
    if (onChange) {
      const syntheticEvent = {
        target: {
          name: name,
          value: formattedDate,
        },
      };
      onChange(syntheticEvent);
    }
  };

  // Handle month selection
  const handleMonthSelect = (monthIndex) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(monthIndex);
    setCurrentMonth(newDate);
    setViewMode("days");
  };

  // Handle year selection
  const handleYearSelect = (year) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(year);
    setCurrentMonth(newDate);
    setViewMode("months");
  };

  // Navigate to previous set (month/year/decade)
  const handlePrevious = () => {
    const newDate = new Date(currentMonth);
    if (viewMode === "days") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewMode === "months") {
      newDate.setFullYear(newDate.getFullYear() - 1);
    } else if (viewMode === "years") {
      newDate.setFullYear(newDate.getFullYear() - 10);
    }
    setCurrentMonth(newDate);
  };

  // Navigate to next set (month/year/decade)
  const handleNext = () => {
    const newDate = new Date(currentMonth);
    if (viewMode === "days") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewMode === "months") {
      newDate.setFullYear(newDate.getFullYear() + 1);
    } else if (viewMode === "years") {
      newDate.setFullYear(newDate.getFullYear() + 10);
    }
    setCurrentMonth(newDate);
  };

  // Format header depending on view mode
  const formatHeader = () => {
    if (viewMode === "days") {
      const monthNames = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ];
      return `${
        monthNames[currentMonth.getMonth()]
      } ${currentMonth.getFullYear()}`;
    } else if (viewMode === "months") {
      return currentMonth.getFullYear().toString();
    } else if (viewMode === "years") {
      return `${yearRange[1]}-${yearRange[yearRange.length - 2]}`;
    }
    return "";
  };

  // Generate days for the current month view
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Day of the week for the first day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();

    // Total days in the month
    const daysInMonth = lastDay.getDate();

    // Calculate days from previous month to show
    const prevMonthDays = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Adjust for Monday as first day

    // Calculate days from next month to show
    const totalCells = Math.ceil((daysInMonth + prevMonthDays) / 7) * 7;
    const nextMonthDays = totalCells - (daysInMonth + prevMonthDays);

    // Days from previous month
    let days = [];
    const prevMonth = new Date(year, month, 0);
    const prevMonthLastDay = prevMonth.getDate();

    for (let i = prevMonthDays - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
        isPrevMonth: true,
      });
    }

    // Days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Days from next month
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        isNextMonth: true,
      });
    }

    return days;
  };

  // Month names
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  // Week days header
  const weekDays = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

  return (
    <div className="relative w-full">
      <div className="relative">
        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          id={id}
          name={name}
          value={selectedDate ? formatDateForDisplay(selectedDate) : ""}
          onChange={() => {}} // Read-only for clicks
          onClick={() => setShowCalendar(true)}
          className={`w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer ${
            className || ""
          }`}
          placeholder="Pilih tanggal"
          readOnly
        />

        {/* Hidden input with actual value in YYYY-MM-DD format for form submission */}
        <input
          type="hidden"
          name={name}
          value={selectedDate ? formatDateForInput(selectedDate) : ""}
        />
      </div>

      {showCalendar && (
        <div
          ref={calendarRef}
          className="absolute z-10 mt-1 p-2 bg-white shadow-lg rounded-lg border border-gray-200 w-72"
        >
          {/* Calendar header */}
          <div className="flex justify-between items-center mb-2">
            <button
              type="button"
              onClick={handlePrevious}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (viewMode === "days") setViewMode("months");
                else if (viewMode === "months") setViewMode("years");
              }}
              className="text-sm font-medium hover:bg-gray-100 px-2 py-1 rounded"
            >
              {formatHeader()}
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Days View */}
          {viewMode === "days" && (
            <>
              {/* Week days */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-medium text-gray-500 py-1"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth().map((day, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDateSelect(day.date)}
                    className={`
                      p-2 text-sm rounded-full w-8 h-8 flex items-center justify-center
                      ${!day.isCurrentMonth ? "text-gray-400" : "text-gray-700"}
                      ${
                        selectedDate && isSameDay(day.date, selectedDate)
                          ? "bg-blue-500 text-white"
                          : "hover:bg-gray-100"
                      }
                    `}
                  >
                    {day.date.getDate()}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Months View */}
          {viewMode === "months" && (
            <div className="grid grid-cols-3 gap-2">
              {monthNames.map((month, index) => (
                <button
                  key={month}
                  type="button"
                  onClick={() => handleMonthSelect(index)}
                  className={`
                    p-2 text-sm rounded-lg flex items-center justify-center
                    ${
                      index === currentMonth.getMonth()
                        ? "bg-blue-100 font-medium"
                        : "hover:bg-gray-100"
                    }
                  `}
                >
                  {month}
                </button>
              ))}
            </div>
          )}

          {/* Years View */}
          {viewMode === "years" && (
            <div className="grid grid-cols-3 gap-2">
              {yearRange.map((year, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleYearSelect(year)}
                  className={`
                    p-2 text-sm rounded-lg flex items-center justify-center
                    ${
                      index === 0 || index === 11
                        ? "text-gray-400"
                        : "text-gray-700"
                    }
                    ${
                      year === currentMonth.getFullYear()
                        ? "bg-blue-100 font-medium"
                        : "hover:bg-gray-100"
                    }
                  `}
                >
                  {year}
                </button>
              ))}
            </div>
          )}

          {/* Today button */}
          <div className="mt-2 text-center">
            <button
              type="button"
              onClick={() => handleDateSelect(new Date())}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Hari Ini
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedDatePicker;
