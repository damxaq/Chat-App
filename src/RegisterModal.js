import React from "react";
import firebase from "firebase/app";

const RegisterModal = (props) => {
  const registerAccount = (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    const confPassowrd = e.target[2].value;

    console.log(email, password, confPassowrd);

    // TODO: show error if pass is wrong
    if (email && password && password === confPassowrd) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .catch(function (error) {
          console.log(error.code);
          console.log(error.message);
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

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default RegisterModal;
