import React from "react";
import { useGlobalContext } from "./App";

import LastMsgInfo from "./LastMsgInfo";

const SideContacts = ({ contacts }) => {
  const { setChatRoomId, chatRoomId } = useGlobalContext();
  // TODO Side contacts are looping through messages from other rooms when changing room
  console.log("--------------------------------");
  console.log("chatRoomId", chatRoomId);

  return (
    <>
      <p>Contacts:</p>
      <div className="side-contacts-container">
        {contacts &&
          contacts.map((contact) => (
            <div className="side-contact-container" key={contact.id}>
              <div
                className={
                  chatRoomId === contact.roomId
                    ? "side-contact active"
                    : "side-contact"
                }
              >
                <button
                  className="side-cart"
                  onClick={() => {
                    setChatRoomId(contact.roomId);
                  }}
                >
                  <div className="side-contact-text">
                    <div className="side-contact-first-row">
                      <div className="side-contact-image-container">
                        {contact.avatar ? (
                          <img src={contact.avatar} alt={contact.name} />
                        ) : (
                          <div className="side-avatar-placeholder">
                            {contact.name.slice(0, 1).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <p>{contact.name}</p>
                    </div>
                    <LastMsgInfo roomId={contact.roomId} />
                  </div>
                </button>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default SideContacts;
