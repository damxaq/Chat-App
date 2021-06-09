import React from "react";
import { useGlobalContext } from "./App";

import { FiLogOut } from "react-icons/fi";

const Authentication = () => {
  const {
    user,
    auth,
    setIsRegisterModalOpen,
    setIsSignInModalOpen,
    setUserVerified,
    isRegisterModalOpen,
    isSignInModalOpen,
  } = useGlobalContext();

  return (
    <div className="signup-buttons-container">
      {user && user.emailVerified ? (
        <div>
          <button
            onClick={() => {
              auth.signOut();
              setIsSignInModalOpen(true);
            }}
          >
            <div className="nav-button-holder">
              <FiLogOut className="nav-button-holder-icon" />
              <span>Sign out</span>
            </div>
          </button>
        </div>
      ) : (
        <div>
          <button
            className={isSignInModalOpen ? "active signin" : "signin"}
            onClick={() => {
              setIsRegisterModalOpen(false);
              setIsSignInModalOpen(true);
            }}
          >
            Sign In
          </button>
          <button
            className={isRegisterModalOpen ? "active" : ""}
            onClick={() => {
              setIsSignInModalOpen(false);
              setIsRegisterModalOpen(true);
              setUserVerified(false);
            }}
          >
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
};

export default Authentication;
