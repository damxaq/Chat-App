// add encrypting
// profileData is wiped out when there is problem with loading site
// comments

import "./App.css";

import Authentication from "./Authentication";
import Navigation from "./Navigation";
import RegisterModal from "./RegisterModal";
import SignInModal from "./SignInModal";
import VerificationModal from "./VerificationModal";
import UserPage from "./UserPage";

import React, { useState, useEffect, useContext } from "react";

import { AiFillMessage } from "react-icons/ai";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";

const config = {
  //TODO move api key to env, and config to separate file
  apiKey: "AIzaSyCyPX4xnNg9Vo4CZa94bYaz-U38EaxWfIA",
  authDomain: "chat-app-627c6.firebaseapp.com",
  projectId: "chat-app-627c6",
  storageBucket: "chat-app-627c6.appspot.com",
  messagingSenderId: "757724613437",
  appId: "1:757724613437:web:da90b14bcfa92476dd5354",
  measurementId: "G-7QYM9E34V2",
  databaseUrl: "https://chat-app-627c6-default-rtdb.firebaseio.com/",
};

// Initialazing firebase connection
if (!firebase.apps.length) {
  firebase.initializeApp(config);
  firebase
    .firestore()
    .enablePersistence()
    .catch((err) => {
      console.log("failed persistence", err);
    });
} else {
  firebase.app();
}

const auth = firebase.auth();
const firestore = firebase.firestore();

const AppContext = React.createContext();

function App() {
  const [user] = useAuthState(auth);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [userVerified, setUserVerified] = useState(false);
  const [chatRoomId, setChatRoomId] = useState(null);

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
    if (!user) {
      setIsSignInModalOpen(true);
      setIsSettingModalOpen(false);
      setIsContactModalOpen(false);
      setChatRoomId(null);
    }
  }, [user]);

  useEffect(() => {
    // TODO this can be moved to register
    if (!user || !user.emailVerified) sendVerificationEmail();
  }, [user]);

  useEffect(() => {
    if (!userVerified && user && user.emailVerified) {
      setUserVerified(true);
      setIsContactModalOpen(true);
    }
  }, [user, setUserVerified, setIsContactModalOpen]);

  useEffect(() => {
    if (user) {
      if (isRegisterModalOpen) setIsRegisterModalOpen(false);
      if (isSignInModalOpen) setIsSignInModalOpen(false);
    }
  }, [user, setIsRegisterModalOpen]);

  return (
    <AppContext.Provider
      value={{
        isRegisterModalOpen,
        setIsRegisterModalOpen,
        isSignInModalOpen,
        setIsSignInModalOpen,
        isSettingModalOpen,
        setIsSettingModalOpen,
        isContactModalOpen,
        setIsContactModalOpen,
        user,
        auth,
        userVerified,
        setUserVerified,
        chatRoomId,
        setChatRoomId,
        firestore,
      }}
    >
      <div className="App">
        <header>
          {user && userVerified && <Navigation />}

          <h3 className="logo">
            <AiFillMessage className="logo-icon" />
            <i>MyChat</i>
          </h3>
          <Authentication />
        </header>
        <section>
          {isSignInModalOpen && <SignInModal auth={auth} user={user} />}
          {isRegisterModalOpen && <RegisterModal />}
          {user && !user.emailVerified && <VerificationModal />}
          {user && userVerified && <UserPage />}
        </section>
      </div>
    </AppContext.Provider>
  );
}

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, App };
