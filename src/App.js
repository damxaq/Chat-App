import React, { useState, useEffect, useContext } from "react";
import "./App.css";

import Authentication from "./Authentication";
import Navigation from "./Navigation";
import RegisterModal from "./RegisterModal";
import SignInModal from "./SignInModal";
import VerificationModal from "./VerificationModal";
import UserPage from "./UserPage";

import { AiFillMessage } from "react-icons/ai";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import config from "./firebaseConfig";

const CryptoJS = require("crypto-js");

// Encrytption key
const CRYPTO_KEY = process.env.REACT_APP_SECRET_MYCHAT_CRYPTO_KEY;

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

  const encrypt = (text) => {
    return CryptoJS.AES.encrypt(JSON.stringify(text), CRYPTO_KEY).toString();
  };

  const decrypt = (text) => {
    if (text) {
      try {
        const bytes = CryptoJS.AES.decrypt(text, CRYPTO_KEY);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      } catch (error) {
        console.log("decryption error", error);
        return text;
      }
    }
    return "";
  };

  // Sending verification email, and preventing from repeating the process more often than 2 minutes, until the account is verified
  const sendVerificationEmail = () => {
    const newTime = Math.floor(new Date().getTime() / 1000.0);
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
      // Reseting state values after signing out
      setIsSignInModalOpen(true);
      setIsSettingModalOpen(false);
      setIsContactModalOpen(false);
      setChatRoomId(null);
    }
  }, [user]);

  useEffect(() => {
    if (!user || !user.emailVerified) sendVerificationEmail();
  }, [user]);

  useEffect(() => {
    if (!userVerified && user && user.emailVerified) {
      // Final signing up of verified account
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
        encrypt,
        decrypt,
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
        <section className="app-section">
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
