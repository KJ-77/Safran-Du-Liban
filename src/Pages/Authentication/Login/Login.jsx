import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "form/Inputs/Input";
import PasswordInput from "form/Inputs/PasswordInput";
import useInput from "form/Hooks/user-input";
import usePost from "Hooks/usePost";
import { useAuth } from "context/AuthContext";
import Container from "Components/Container/Container";

const Login = () => {
  const email = useInput((val) => val.includes("@"));
  const password = useInput((val) => val.length >= 8);
  const { data, loading, error, postData } = usePost();
  const [submitted, setSubmitted] = useState(false);
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/profile");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!email.isValid || !password.isValid) return;
    try {
      const response = await postData("/auth/login", {
        email: email.value,
        password: password.value,
      });

      // Login successful

      // Save user data and token using context
      login(response);

      // Redirect to home page after successful login
      navigate("/");
    } catch (err) {
      // error handled by hook
    }
  };

  return (
    <Container>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm mx-auto py-secondary lg:py-primary"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <Input
          label="Email"
          type="email"
          name="email"
          id="login-email"
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
          id="login-password"
          placeholder="Enter your password"
          value={password.value}
          onChange={password.inputChangeHandler}
          onBlur={password.inputBlurHandler}
          hasError={submitted && password.HasError}
          errorMessage="Password must be at least 8 characters."
        />
        <button
          type="submit"
          className="bg-primary text-white py-2 rounded-md mt-4"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && (
          <p className="text-red-500 text-center text-sm">{error.message}</p>
        )}
        <p className="text-center mt-2 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary underline">
            Register
          </Link>
        </p>
      </form>
    </Container>
  );
};

export default Login;
