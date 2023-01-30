import React from "react";
import { DebounceInput } from "react-debounce-input";

function FormInput({
  label,
  required,
  value,
  setState,
  placeholder,
  type = "text",
  maxLength,
}: {
  label: string;
  required: boolean;
  value: string;
  setState: React.Dispatch<
    React.SetStateAction<{
      name: string;
      email: string;
      title: string;
      website: string;
    }>
  >;
  placeholder: string;
  type?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <label htmlFor={label} className="block text-sm font-medium text-white">
        {`${
          label.charAt(0).toUpperCase() +
          label.slice(1) +
          (required ? " *" : "")
        }`}
      </label>
      <div className="mt-1">
        <DebounceInput
          value={value}
          type={type}
          name={label}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder={placeholder}
          required={required}
          debounceTimeout={300}
          maxLength={maxLength}
          onChange={(e) =>
            setState((prevState) => ({
              ...prevState,
              [label]: e.target.value,
            }))
          }
        />
      </div>
    </div>
  );
}

export default FormInput;
