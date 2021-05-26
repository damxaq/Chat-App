// add settings
// add icon next to msg, but only first in a row, if no photo then first letters of name
// make sign in buttons pretty
// add images
// add emoji
// add delay to send again button

import "./App.css";

import Authentication from "./Authentication";
import RegisterModal from "./RegisterModal";
import SignInModal from "./SignInModal";
import VerificationModal from "./VerificationModal";
import ChatRoom from "./ChatRoom";

import { useState, useEffect } from "react";

import { AiFillMessage } from "react-icons/ai";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";

const config = {
  // move api key to env, and config to separate file
  apiKey: "AIzaSyCyPX4xnNg9Vo4CZa94bYaz-U38EaxWfIA",
  authDomain: "chat-app-627c6.firebaseapp.com",
  projectId: "chat-app-627c6",
  storageBucket: "chat-app-627c6.appspot.com",
  messagingSenderId: "757724613437",
  appId: "1:757724613437:web:da90b14bcfa92476dd5354",
  measurementId: "G-7QYM9E34V2",
  databaseUrl: "https://chat-app-627c6-default-rtdb.firebaseio.com/",
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
} else {
  firebase.app();
}

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [userVerified, setUserVerified] = useState(false);

  console.log(user);

  const verificationTimestamp = window.localStorage.getItem(
    "verificationTimestamp"
  );

  const sendVerificationEmail = () => {
    const newTime = Math.floor(new Date().getTime() / 1000.0);
    if (verificationTimestamp) {
      console.log(newTime - verificationTimestamp);
    }
    if (
      user &&
      user.emailVerified === false &&
      (verificationTimestamp === null || newTime - verificationTimestamp > 120)
    ) {
      window.localStorage.setItem("verificationTimestamp", newTime);

      user
        .sendEmailVerification()
        .then(function () {
          console.log("verification sent");
        })
        .catch(function (error) {
          console.log("verification error", error);
        });
    }
  };

  useEffect(() => {
    // TODO this can be moved to register
    if (!user || !user.emailVerified) sendVerificationEmail();
  }, [user]);

  useEffect(() => {
    if (!userVerified && user && user.emailVerified) {
      setUserVerified(true);
    }
  }, [user, setUserVerified]);

  useEffect(() => {
    if (user) {
      if (isRegisterModalOpen) setIsRegisterModalOpen(false);
      if (isSignInModalOpen) setIsSignInModalOpen(false);
    }
  }, [user, setIsRegisterModalOpen]);

  return (
    <div className="App">
      <header>
        <i>
          <AiFillMessage style={{ color: "rebeccapurple", fontSize: "2rem" }} />
        </i>
        MyChat
        <Authentication
          user={user}
          auth={auth}
          setIsRegisterModalOpen={setIsRegisterModalOpen}
          setIsSignInModalOpen={setIsSignInModalOpen}
          setUserVerified={setUserVerified}
        />
      </header>
      <section>
        {isSignInModalOpen && <SignInModal auth={auth} user={user} />}
        {isRegisterModalOpen && <RegisterModal />}
        {user && !user.emailVerified && <VerificationModal />}
        {user && userVerified && <ChatRoom firestore={firestore} auth={auth} />}
      </section>
    </div>
  );
}

export default App;
