import React from "react";

function FormInput({
  label,
  required,
  value,
  setState,
  placeholder,
  type = "text",
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
        <input
          value={value}
          onChange={(e) =>
            setState((prevState) => ({
              ...prevState,
              [label]: e.target.value,
            }))
          }
          type={type}
          name={label}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder={placeholder}
          required={required}
        />
      </div>
    </div>
  );
}

export default FormInput;
