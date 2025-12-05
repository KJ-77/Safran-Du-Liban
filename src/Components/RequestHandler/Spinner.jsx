import React from "react";

const Spinner = ({ isWhite }) => {
  return (
    <svg
      className={`animate-spin h-6 w-6 ${
        isWhite ? "text-white" : "text-primary"
      }`}
      viewBox="0 0 24 24"
    >
      <circle
        className="fill-lightGreen opacity-50"
        cx="12"
        cy="12"
        r="10"
      ></circle>
      <path
        className="fill-current text-primary"
        d="M22 12c0-5.523-4.477-10-10-10"
      >
        <animateTransform
          attributeType="xml"
          attributeName="transform"
          type="rotate"
          from="0 12 12"
          to="360 12 12"
          dur="0.8s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
};

export default Spinner;
