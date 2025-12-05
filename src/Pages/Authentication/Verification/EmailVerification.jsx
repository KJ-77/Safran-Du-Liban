import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, ArrowLeft, PaperPlaneTilt } from "@phosphor-icons/react";
import usePost from "Hooks/usePost";
import { useAuth } from "context/AuthContext";

const EmailVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRefs = useRef([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { updateVerification, user } = useAuth();

  // Get email from navigation state or user context
  const userEmail = location.state?.email || user?.email;

  const {
    loading: verifyLoading,
    error: verifyError,
    postData: verifyOtp,
  } = usePost();
  const {
    loading: resendLoading,
    error: resendError,
    postData: resendCode,
  } = usePost();

  // Redirect if no email available or user not logged in
  useEffect(() => {
    if (!userEmail || !user) {
      navigate("/register");
    }
  }, [userEmail, user, navigate]);

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    // Focus the next empty input or last input
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) return;

    try {
      const response = await verifyOtp("/auth/verify-email", {
        email: userEmail,
        code: otpCode,
      });

      if (response.success) {
        setIsSuccess(true);
        updateVerification(true);

        // Redirect to profile after 2 seconds
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      }
    } catch (error) {
      console.error("Verification failed:", error);
    }
  };

  // Resend verification code
  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    try {
      const response = await resendCode("/auth/send-verification", {
        email: userEmail,
      });

      if (response.success) {
        setResendCooldown(60); // 60 seconds cooldown
        setOtp(["", "", "", "", "", ""]); // Clear current OTP
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error("Resend failed:", error);
    }
  };

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Auto-verify when all 6 digits are entered
  useEffect(() => {
    if (otp.every((digit) => digit !== "") && !verifyLoading) {
      handleVerifyOtp();
    }
  }, [otp]);

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle size={48} className="text-green-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Email Verified!
            </h2>
            <p className="text-gray-600 mb-6">
              Your email has been successfully verified. You can now access all
              our premium saffron products.
            </p>
            <div className="animate-pulse text-primary text-sm">
              Redirecting to your profile...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          {/* Header */}
          <div className="text-center mb-8 relative">
            <button
              onClick={() => navigate(-1)}
              className="absolute -top-2 -left-2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Enter Verification Code
            </h2>
            <p className="text-gray-600 mb-2">We've sent a 6-digit code to:</p>
            <p className="text-primary font-semibold">{userEmail}</p>
          </div>

          {/* OTP Input */}
          <div className="flex justify-center space-x-3 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-xl font-bold border-2 rounded-xl focus:border-primary focus:outline-none transition-colors"
                disabled={verifyLoading}
              />
            ))}
          </div>

          {/* Error Messages */}
          {verifyError && (
            <div className="text-red-500 text-sm text-center mb-4">
              {verifyError.message}
            </div>
          )}

          {resendError && (
            <div className="text-red-500 text-sm text-center mb-4">
              {resendError.message}
            </div>
          )}

          {/* Loading State */}
          {verifyLoading && (
            <div className="text-center mb-4">
              <div className="inline-block animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
              <p className="text-sm text-gray-600 mt-2">Verifying...</p>
            </div>
          )}

          {/* Resend Button */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResendCode}
              disabled={resendCooldown > 0 || resendLoading}
              className="inline-flex items-center space-x-2 px-4 py-2 text-primary hover:bg-primary/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperPlaneTilt size={16} />
              <span>
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : resendLoading
                  ? "Sending..."
                  : "Resend Code"}
              </span>
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-600 text-center">
              Enter the 6-digit code sent to your email. The code will expire in
              30 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
