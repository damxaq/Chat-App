import React, { useState } from "react";
import firebase from "firebase/app";

const SignInModal = ({ auth }) => {
  const [showFormError, setShowFormError] = useState(false);

  const signIn = (e) => {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    if (email && password) {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          console.log(userCredential);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          setShowFormError(true);
        });
    }
  };

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <div className="register-container">
      <form onSubmit={signIn} className="register-form">
        <input
          type="text"
          name="email"
          id="email"
          minLength="4"
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
        {showFormError && <div>Wrong email or password!</div>}

        <button type="submit" className="sign-form-button">
          Sign In
        </button>
      </form>
      <h3>OR</h3>
      <div className="google-btn" onClick={signInWithGoogle}>
        <div className="google-icon-wrapper">
          <img className="google-icon" src="../google.svg" alt="google" />
        </div>
        <p className="btn-text">
          <b>Sign in with google</b>
        </p>
      </div>
    </div>
  );
};

export default SignInModal;
