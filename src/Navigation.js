import React from "react";

import { AiOutlineSetting } from "react-icons/ai";
import { RiContactsBook2Line } from "react-icons/ri";

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
            <div className="nav-button-holder">
              <AiOutlineSetting className="nav-button-holder-icon" />
              <span>Settings</span>
            </div>
          </button>
          <button
            className={props.isContactModalOpen ? "active" : ""}
            onClick={() => {
              props.setIsSettingModalOpen(false);
              props.setIsContactModalOpen(true);
              if (props.chatRoomId) props.setChatRoomId(null);
            }}
          >
            <div className="nav-button-holder">
              <RiContactsBook2Line className="nav-button-holder-icon" />
              <span>Contacts</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default Navigation;
