import React from "react";
import SignOut from "./SignOut";

const Authentication = (props) => {
  const user = props.user;
  const auth = props.auth;

  return (
    <div>
      {/* TODO signout can be in app comp */}
      {user && user.emailVerified ? (
        <SignOut auth={auth} />
      ) : (
        <div>
          <button
            onClick={() => {
              props.setIsRegisterModalOpen(false);
              props.setIsSignInModalOpen(true);
            }}
          >
            Sign In
          </button>
          <button
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
