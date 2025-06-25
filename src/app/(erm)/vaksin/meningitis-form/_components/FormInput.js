// components/FormInput.js
import { forwardRef } from "react";

export const FormInput = forwardRef(
  (
    {
      label,
      name,
      value,
      onChange,
      placeholder,
      type = "text",
      required = false,
    },
    ref
  ) => {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
          ref={ref}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400 capitalize"
          style={{ textTransform: "capitalize" }}
          required={required}
        />
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

// components/FormSelect.js
export const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400 capitalize"
        style={{ textTransform: "capitalize" }}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// components/FormTextarea.js
export const FormTextarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400 capitalize"
        style={{ textTransform: "capitalize" }}
      />
    </div>
  );
};
