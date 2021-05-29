import React from "react";

const Navigation = (props) => {
  const user = props.user;

  return (
    <div className="navigation-container">
      {user && user.emailVerified && (
        <div>
          <button
            className={props.isSettingModalOpen ? "active" : ""}
            onClick={() => {
              props.setIsContactModalOpen(false);
              props.setIsSettingModalOpen(true);
              if (props.chatRoomId) props.setChatRoomId(null);
            }}
          >
            Settings
          </button>
          <button
            className={props.isContactModalOpen ? "active" : ""}
            onClick={() => {
              props.setIsSettingModalOpen(false);
              props.setIsContactModalOpen(true);
              if (props.chatRoomId) props.setChatRoomId(null);
            }}
          >
            Contacts
          </button>
        </div>
      )}
    </div>
  );
};

export default Navigation;
