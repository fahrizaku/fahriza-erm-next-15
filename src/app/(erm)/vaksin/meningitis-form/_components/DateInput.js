// components/DateInput.js
import { Calendar } from "lucide-react";

export const DateInput = ({
  label,
  name,
  value,
  onChange,
  placeholder = "dd/mm/yyyy",
  helpText,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          maxLength="10"
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 pr-10 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400"
        />
        <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
      </div>
      {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
    </div>
  );
};
