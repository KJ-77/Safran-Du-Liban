import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "form/Inputs/Input";
import PasswordInput from "form/Inputs/PasswordInput";
import useInput from "form/Hooks/user-input";
import usePost from "Hooks/usePost";
import { useAuth } from "context/AuthContext";
import EmailVerificationModal from "Components/Modals/EmailVerificationModal";
import Container from "Components/Container/Container";

const Regitser = () => {
  const fullName = useInput((val) => val.trim().length > 0);
  const phoneNumber = useInput((val) => val.trim().length > 0);
  const email = useInput((val) => val.includes("@"));
  const password = useInput((val) => val.length >= 8);
  const confirmPassword = useInput(
    (val) => val === password.value && val.length >= 8
  );
  const { loading, error, postData } = usePost();
  const [submitted, setSubmitted] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const { register, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (isLoggedIn) {
      navigate("/profile");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (
      !fullName.isValid ||
      !phoneNumber.isValid ||
      !email.isValid ||
      !password.isValid ||
      !confirmPassword.isValid
    )
      return;
    try {
      const response = await postData("/auth/register", {
        fullName: fullName.value,
        phoneNumber: phoneNumber.value,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
      });

      // Registration successful

      // Save user data and token using context
      register(response);

      // Show verification modal instead of redirecting immediately
      setRegisteredEmail(email.value);
      setShowVerificationModal(true);
    } catch (err) {
      // error handled by hook
    }
  };

  // Handle modal actions
  const handleVerifyNow = () => {
    setShowVerificationModal(false);
    navigate("/verify-email", { state: { email: registeredEmail } });
  };

  const handleCloseModal = () => {
    setShowVerificationModal(false);
    navigate("/profile"); // Redirect to profile if they skip verification
  };

  return (
    <>
      <EmailVerificationModal
        isOpen={showVerificationModal}
        onClose={handleCloseModal}
        onVerifyNow={handleVerifyNow}
        userEmail={registeredEmail}
      />
      <Container>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full max-w-sm mx-auto py-secondary lg:py-primary  "
        >
          <h2 className="text-4xl text-secondary font-bold mb-4 text-center">
            Register
          </h2>
          <Input
            label="Full Name"
            type="text"
            name="fullName"
            id="register-fullName"
            placeholder="Enter your full name"
            value={fullName.value}
            onChange={fullName.inputChangeHandler}
            onBlur={fullName.inputBlurHandler}
            hasError={submitted && fullName.HasError}
            errorMessage="Full name is required."
          />
          <Input
            label="Phone Number"
            type="tel"
            name="phoneNumber"
            id="register-phoneNumber"
            placeholder="Enter your phone number"
            value={phoneNumber.value}
            onChange={phoneNumber.inputChangeHandler}
            onBlur={phoneNumber.inputBlurHandler}
            hasError={submitted && phoneNumber.HasError}
            errorMessage="Phone number is required."
          />
          <Input
            label="Email"
            type="email"
            name="email"
            id="register-email"
            placeholder="Enter your email"
            value={email.value}
            onChange={email.inputChangeHandler}
            onBlur={email.inputBlurHandler}
            hasError={submitted && email.HasError}
            errorMessage="Please enter a valid email."
          />
          <PasswordInput
            label="Password"
            name="password"
            id="register-password"
            placeholder="Enter your password"
            value={password.value}
            onChange={password.inputChangeHandler}
            onBlur={password.inputBlurHandler}
            hasError={submitted && password.HasError}
            errorMessage="Password must be at least 8 characters."
          />
          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            id="register-confirmPassword"
            placeholder="Confirm your password"
            value={confirmPassword.value}
            onChange={confirmPassword.inputChangeHandler}
            onBlur={confirmPassword.inputBlurHandler}
            hasError={submitted && confirmPassword.HasError}
            errorMessage="Passwords must match."
          />
          <button
            type="submit"
            className="bg-primary text-white py-2 rounded-md mt-4"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          {error && (
            <p className="text-red-500 text-center text-sm">{error.message}</p>
          )}
          <p className="text-center mt-2 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-primary underline">
              Login
            </Link>
          </p>
        </form>
      </Container>
    </>
  );
};

export default Regitser;
