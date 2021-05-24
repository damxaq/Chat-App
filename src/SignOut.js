import React from "react";

const SignOut = (props) => {
  const auth = props.auth;
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign out</button>
  );
};

export default SignOut;
