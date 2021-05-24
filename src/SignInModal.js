import React from "react";
import firebase from "firebase/app";

const SignInModal = (props) => {
  const auth = props.auth;

  const signIn = (e) => {
    e.preventDefault();
    console.log("yeahhhh", e);
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
        <button type="submit">Sign In</button>
      </form>
      or sign up with google
      {/* TODO open gugel on same page */}
      <button onClick={signInWithGoogle}>Sign in</button>
    </div>
  );
};

export default SignInModal;
