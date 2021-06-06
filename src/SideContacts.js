import React from "react";

const SideContacts = (props) => {
  return (
    <>
      <p>Contacts:</p>
      <div className="side-contacts-container">
        {props.contacts &&
          props.contacts.map((contact) => (
            <div className="side-contact-container" key={contact.id}>
              <div
                className={
                  props.roomId === contact.roomId
                    ? "side-contact active"
                    : "side-contact"
                }
              >
                <button
                  className="side-cart"
                  onClick={() => {
                    props.setChatRoomId(contact.roomId);
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
                    <p>{contact.email}</p>
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
