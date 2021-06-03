import React from "react";

import { FiLogOut } from "react-icons/fi";

const Authentication = (props) => {
  const user = props.user;
  const auth = props.auth;

  return (
    <div className="signup-buttons-container">
      {user && user.emailVerified ? (
        <div>
          <button
            onClick={() => {
              auth.signOut();
              props.setIsSignInModalOpen(true);
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
            className={props.isSignInModalOpen ? "active" : ""}
            onClick={() => {
              props.setIsRegisterModalOpen(false);
              props.setIsSignInModalOpen(true);
            }}
          >
            Sign In
          </button>
          <button
            className={props.isRegisterModalOpen ? "active" : ""}
            onClick={() => {
              props.setIsSignInModalOpen(false);
              props.setIsRegisterModalOpen(true);
              props.setUserVerified(false);
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
