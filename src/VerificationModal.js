import React from "react";
import { SiMinutemailer } from "react-icons/si";
import { BiRefresh } from "react-icons/bi";

const VerificationModal = () => {
  return (
    <div className="verification-container">
      <div>
        <SiMinutemailer className="verification-icon" />
      </div>
      <h3>Check your Email</h3>
      <p>
        We sent you a verification email. Open it and click the confirmation
        link to verify your account.
      </p>
      <button
        onClick={() => {
          window.location.reload();
        }}
      >
        <i>
          <BiRefresh />
        </i>
        Refresh
      </button>
    </div>
  );
};

export default VerificationModal;
