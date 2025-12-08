import React from "react";

const Input = (props) => {
  const {
    type,
    name,
    id,
    label,
    placeholder,
    value,
    onChange = () => {},
    onBlur = () => {},
    hasError = false,
    isDisabled,
    errorMessage = "error",
  } = props;

  return (
    <span className={"flex gap-y-1 flex-col  w-full"}>
      <label htmlFor={id} className="capitalize font-text ">
        {label}
      </label>
      <input
        className={`border ${
          hasError ? "border-red-500" : "border-primary"
        } font-text px-2 py-3 rounded-md`}
        id={id}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={isDisabled}
      />

      <p className={`text-xs text-red-500  ${hasError ? "block " : "hidden"}`}>
        {errorMessage}
      </p>
    </span>
  );
};

export default Input;
