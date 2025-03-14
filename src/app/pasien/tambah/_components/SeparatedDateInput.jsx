"use client";

import React, { useState, useEffect } from "react";

const SeparatedDateInput = ({ value, onChange, name, id, className }) => {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  // Indonesian month names
  const monthNames = [
    { value: "01", label: "Januari" },
    { value: "02", label: "Februari" },
    { value: "03", label: "Maret" },
    { value: "04", label: "April" },
    { value: "05", label: "Mei" },
    { value: "06", label: "Juni" },
    { value: "07", label: "Juli" },
    { value: "08", label: "Agustus" },
    { value: "09", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];

  // Initialize fields from value prop
  useEffect(() => {
    if (value && value.length > 0) {
      const [yearVal, monthVal, dayVal] = value.split("-");
      setYear(yearVal);
      setMonth(monthVal);
      setDay(dayVal);
    }
  }, [value]);

  // Generate array of days for the selected month
  const getDaysInMonth = (monthVal, yearVal) => {
    if (!monthVal || !yearVal) return 31;
    return new Date(parseInt(yearVal), parseInt(monthVal), 0).getDate();
  };

  // Get days options based on selected month and year
  const getDayOptions = () => {
    const daysInMonth = month && year ? getDaysInMonth(month, year) : 31;
    const days = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const dayValue = i.toString().padStart(2, "0");
      days.push({ value: dayValue, label: dayValue });
    }

    return days;
  };

  // Generate years array (e.g., from 1900 to current year)
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 1900;
    const years = [];

    for (let year = currentYear; year >= startYear; year--) {
      years.push(year.toString());
    }

    return years;
  };

  // Handle day selection change
  const handleDayChange = (e) => {
    const newDay = e.target.value;
    setDay(newDay);
    updateDateValue(newDay, month, year);
  };

  // Handle month selection change
  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    setMonth(newMonth);

    // Validate day when month changes
    if (day && year && newMonth) {
      const numDay = parseInt(day, 10);
      const maxDays = getDaysInMonth(newMonth, year);

      if (numDay > maxDays) {
        const newDay = maxDays.toString().padStart(2, "0");
        setDay(newDay);
        updateDateValue(newDay, newMonth, year);
      } else {
        updateDateValue(day, newMonth, year);
      }
    } else {
      updateDateValue(day, newMonth, year);
    }
  };

  // Handle year selection change
  const handleYearChange = (e) => {
    const newYear = e.target.value;
    setYear(newYear);

    // Validate day when year changes (for leap years)
    if (day && month && newYear) {
      const numDay = parseInt(day, 10);
      const maxDays = getDaysInMonth(month, newYear);

      if (numDay > maxDays) {
        const newDay = maxDays.toString().padStart(2, "0");
        setDay(newDay);
        updateDateValue(newDay, month, newYear);
      } else {
        updateDateValue(day, month, newYear);
      }
    } else {
      updateDateValue(day, month, newYear);
    }
  };

  // Update the complete date value and trigger onChange
  const updateDateValue = (dayVal, monthVal, yearVal) => {
    if (dayVal && monthVal && yearVal) {
      const formattedDate = `${yearVal}-${monthVal}-${dayVal}`;

      if (onChange) {
        const syntheticEvent = {
          target: {
            name: name,
            value: formattedDate,
          },
        };
        onChange(syntheticEvent);
      }
    } else if (onChange) {
      // Clear the value if any field is empty
      const syntheticEvent = {
        target: {
          name: name,
          value: "",
        },
      };
      onChange(syntheticEvent);
    }
  };

  return (
    <div className={`relative ${className || ""}`}>
      <div className="flex items-center space-x-2">
        {/* Year Dropdown - First position */}
        <div className="w-28">
          <select
            value={year}
            onChange={handleYearChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tahun</option>
            {getYearOptions().map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Month Dropdown - Second position */}
        <div className="w-40">
          <select
            value={month}
            onChange={handleMonthChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Bulan</option>
            {monthNames.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Day Dropdown - Last position */}
        <div className="w-20">
          <select
            value={day}
            onChange={handleDayChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={!month || !year}
          >
            <option value="">Hari</option>
            {getDayOptions().map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hidden input with the complete value in YYYY-MM-DD format */}
      <input
        type="hidden"
        id={id}
        name={name}
        value={day && month && year ? `${year}-${month}-${day}` : ""}
      />
    </div>
  );
};

export default SeparatedDateInput;
