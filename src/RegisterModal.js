import React from "react";

const RegisterModal = () => {
  const registerAccount = (e) => {
    e.preventDefault();
    console.log("yeahhhh", e);
  };

  return (
    <div className="register-container">
      <form onSubmit={registerAccount} className="register-form">
        <input
          type="text"
          name="email"
          id="email"
          minLength="5"
          required
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          id="password"
          minLength="6"
          required
          placeholder="Password"
        />
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          minLength="6"
          required
          placeholder="Confirm Password"
        />

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default RegisterModal;
