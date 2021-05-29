import React from "react";
import firebase from "firebase/app";

const SignInModal = (props) => {
  const auth = props.auth;

  const signIn = (e) => {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    console.log(email, password);

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
      <h3>OR</h3>
      {/* TODO open gugel on same page */}
      <div className="google-btn" onClick={signInWithGoogle}>
        <div className="google-icon-wrapper">
          <img
            className="google-icon"
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
          />
        </div>
        <p className="btn-text">
          <b>Sign in with google</b>
        </p>
      </div>
    </div>
  );
};

export default SignInModal;
