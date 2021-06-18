import React, { useState } from "react";
import firebase from "firebase/app";

const RegisterModal = () => {
  const [showWrongPassword, setShowWrongPassword] = useState(false);
  const [showEmailExist, setShowEmailExist] = useState(false);
  const registerAccount = (e) => {
    if (showEmailExist) setShowEmailExist(false);
    if (showWrongPassword) setShowWrongPassword(false);
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    const confPassowrd = e.target[2].value;

    if (password && password !== confPassowrd) {
      setShowWrongPassword(true);
    }
    if (email && password && password === confPassowrd) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .catch(function (error) {
          console.log(error.code);
          console.log(error.message);
          setShowEmailExist(true);
        });
    }
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

        {showWrongPassword && <div>Password is not matching!</div>}
        {showEmailExist && <div>Email already exist!</div>}

        <button type="submit" className="sign-form-button">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default RegisterModal;
