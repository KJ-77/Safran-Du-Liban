import React from "react";
import { X, EnvelopeSimple, CheckCircle } from "@phosphor-icons/react";

const EmailVerificationModal = ({
  isOpen,
  onClose,
  onVerifyNow,
  userEmail,
}) => {
  if (!isOpen) return null;

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-primary/10 p-4 rounded-full">
            <EnvelopeSimple size={48} className="text-primary" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Verify Your Email
          </h2>
          <p className="text-gray-600 mb-2">
            We've sent a verification code to:
          </p>
          <p className="text-primary font-semibold mb-6">{userEmail}</p>
          <p className="text-sm text-gray-500 mb-8">
            To complete your registration and start purchasing our premium
            saffron products, please verify your email address.
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8">
          <div className="flex items-start space-x-3">
            <CheckCircle
              size={20}
              className="text-green-500 mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Unlock Premium Features
              </p>
              <p className="text-xs text-gray-600">
                Access our exclusive saffron collection and make purchases
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onVerifyNow}
            className="flex-1 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-medium"
          >
            Verify Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;
