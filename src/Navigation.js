import React from "react";
import { useGlobalContext } from "./App";

import { AiOutlineSetting } from "react-icons/ai";
import { RiContactsBook2Line } from "react-icons/ri";

const Navigation = () => {
  const {
    setIsSettingModalOpen,
    setIsContactModalOpen,
    isSettingModalOpen,
    isContactModalOpen,
    user,
    chatRoomId,
    setChatRoomId,
  } = useGlobalContext();

  return (
    <div className="navigation-container">
      {user && user.emailVerified && (
        <div>
          <button
            className={isSettingModalOpen ? "active" : ""}
            onClick={() => {
              setIsContactModalOpen(false);
              setIsSettingModalOpen(true);
              if (chatRoomId) setChatRoomId(null);
            }}
          >
            <div className="nav-button-holder">
              <AiOutlineSetting className="nav-button-holder-icon" />
              <span>Settings</span>
            </div>
          </button>
          <button
            className={isContactModalOpen ? "active" : ""}
            onClick={() => {
              setIsSettingModalOpen(false);
              setIsContactModalOpen(true);
              if (chatRoomId) setChatRoomId(null);
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
