import React from "react";
import firebase from "firebase/app";

const RegisterModal = (props) => {
  const auth = props.auth;

  const actionCodeSettings = {
    url:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/"
        : "chat-app-627c6.firebaseapp.com",
    handleCodeInApp: true,
  };

  if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
    let email = window.localStorage.getItem("emailForSignIn");
    console.log("issigninnignging");
    if (!email) {
      email = window.prompt("Please provide your email for confirmation");
    }
    firebase
      .auth()
      .signInWithEmailLink(email, window.location.href)
      .then((result) => {
        console.log("rezult");
        window.localStorage.removeItem("emailForSignIn");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const registerAccount = (e) => {
    e.preventDefault();
    console.log("yeahhhh", e);
    const email = e.target[0].value;
    const password = e.target[1].value;

    console.log(email, password);

    if (email && password) {
      firebase
        .auth()
        .sendSignInLinkToEmail(email, actionCodeSettings)
        .then(() => {
          window.localStorage.setItem("emailForSignIn", email);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage);
        });

      //   firebase
      //     .auth()
      //     .createUserWithEmailAndPassword(email, password)
      //     .catch(function (error) {
      //       console.log(error.code);
      //       console.log(error.message);
      //     });
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
