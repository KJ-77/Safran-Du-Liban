import React, { useEffect } from "react";
import { useState } from "react";
import { Eye, EyeClosed } from "@phosphor-icons/react";

const PasswordInput = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    label,
    isWhite,
    name,
    id,
    placeholder,
    value,
    onChange = () => {},
    onBlur = () => {},
    onFocus = () => {},
    isFocus,
    hasError = false,
    errorMessage = "error",
  } = props;

  const handlePassword = () => {
    setShowPassword((cur) => !cur);
  };

  return (
    <div className={`flex gap-y-1 flex-col  w-full`}>
      <label htmlFor={id} className="text- capitalize">
        {label}
      </label>
      <div
        className={`flex ${
          isWhite ? "bg-white" : "bg-transparent"
        } items-center border ${
          hasError ? "border-red-500" : "border-primary"
        } px-2 py-3 rounded-md`}
      >
        <input
          className="bg-transparent  w-full focus:outline-none"
          id={id}
          type={`${showPassword ? "text" : "password"}`}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
        />
        <span className="cursor-pointer" onClick={() => handlePassword()}>
          {!showPassword && (
            <Eye width={"1rem"} height={"1rem"} color={"#333"} />
          )}
          {showPassword && (
            <EyeClosed width={"1rem"} height={"1rem"} color={"#333"} />
          )}
        </span>
      </div>
      <p className={`text-sm text-red-500 ${hasError ? "block " : "hidden"}`}>
        {errorMessage}
      </p>
    </div>
  );
};

export default PasswordInput;
