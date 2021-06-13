import React from "react";
import { useGlobalContext } from "./App";

import LastMsgInfo from "./LastMsgInfo";
import { MdDelete } from "react-icons/md";
import { MdAddCircleOutline } from "react-icons/md";
import { TiTickOutline } from "react-icons/ti";

const Contact = ({
  contact,
  removeContact,
  search,
  addUserToContacts,
  profileData,
}) => {
  const { setIsContactModalOpen, setChatRoomId } = useGlobalContext();

  const handleRemoveContact = (contact) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${contact.name} from your contacts?`
      )
    ) {
      removeContact(contact.id);
    }
  };

  return (
    <>
      <div className="contact-container">
        <div className="contact">
          <button
            className="cart"
            onClick={() => {
              if (!search) {
                setChatRoomId(contact.roomId);
                setIsContactModalOpen(false);
              }
            }}
          >
            <div className="contact-image-container">
              {contact.avatar ? (
                <img src={contact.avatar} alt={contact.name} />
              ) : (
                <div className="avatar-placeholder">
                  {contact.name.slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
            <div className="contact-text">
              <p>{contact.name}</p>
              {search ? (
                <p>{contact.email}</p>
              ) : (
                <LastMsgInfo roomId={contact.roomId} />
              )}
            </div>
          </button>
          {search ? (
            <div className="add-button-container">
              {profileData[0].contacts.find(
                (profileContact) => profileContact.email === contact.email
              ) ? (
                <div className="contact-exist">
                  <TiTickOutline />
                </div>
              ) : (
                <button onClick={() => addUserToContacts()}>
                  <MdAddCircleOutline className="add-button" />
                </button>
              )}
            </div>
          ) : (
            <div className="delete-button-container">
              <button onClick={() => handleRemoveContact(contact)}>
                <MdDelete className="delete-button" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Contact;
