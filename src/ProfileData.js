import React, { useState, useEffect } from "react";

import ChatRoom from "./ChatRoom";
import Settings from "./Settings";

import { useCollectionData } from "react-firebase-hooks/firestore";

import { MdDelete } from "react-icons/md";
import { MdAddCircleOutline } from "react-icons/md";
import { TiTickOutline } from "react-icons/ti";

import "firebase/firestore";

const ProfileData = (props) => {
  const firestore = props.firestore;
  const accountsRef = firestore.collection("accounts");
  const query = accountsRef.where("__name__", "==", props.user.uid);
  const [profileData] = useCollectionData(query, { idField: "id" });
  const profileRef = firestore.collection("accounts").doc(props.user.uid);
  const rooms = firestore.collection("rooms");
  const [contacts, setContacts] = useState([]);

  const [searchedUser, setSearchedUser] = useState(undefined);

  console.log("profileData", profileData);

  const addUserToContacts = async () => {
    if (
      !profileData[0].contacts.find(
        (contact) => contact.email === searchedUser.email
      )
    ) {
      const user1 = profileData[0].id;
      const user2 = searchedUser.id;
      const roomId = user1 > user2 ? user2 + user1 : user1 + user2;

      setSearchedUser(undefined);
      const newContact = { ...searchedUser };
      newContact.roomId = roomId;

      createRoom(roomId);
      await profileRef.update({
        contacts: [...profileData[0].contacts, newContact],
      });
    }
  };

  useEffect(() => {
    if (profileData) {
      setContacts(profileData[0].contacts);
    } else {
      setContacts([]);
    }
  }, [profileData]);

  const createRoom = async (roomId) => {
    await rooms.doc(roomId).collection("messages").doc().set({});
  };

  const searchByEmail = (e) => {
    e.preventDefault();
    const searchTerm = e.target[0].value;
    e.target[0].value = "";
    const query = accountsRef.where("email", "==", searchTerm);
    query
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          setSearchedUser({
            email: doc.data().email,
            avatar: doc.data().avatar,
            name: doc.data().name,
            id: doc.data().id,
          });
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  const removeContact = async (id) => {
    const filteredContacts = profileData[0].contacts.filter(
      (contact) => contact.id !== id
    );
    await profileRef.update({
      contacts: filteredContacts,
    });
  };

  return (
    <>
      {profileData && (
        <div>
          {props.chatRoomId ? (
            <ChatRoom
              firestore={firestore}
              user={profileData[0]}
              roomId={props.chatRoomId}
              setSideContactsVisible={props.setSideContactsVisible}
              sideContactsVisible={props.sideContactsVisible}
              contacts={contacts}
              setChatRoomId={props.setChatRoomId}
            />
          ) : (
            <div className="profile-data-container">
              {/* <div>
                <img
                  src={profileData[0].avatar}
                  alt={profileData[0].name}
                  style={{ borderRadius: "50%" }}
                />
              </div> */}
              <div>{profileData[0].email}</div>
              <div>{profileData[0].name}</div>
              {props.isContactModalOpen && (
                <div>
                  <div>
                    <h3>Your contacts:</h3>
                    <div className="contacts-container">
                      {contacts &&
                        contacts.map((contact) => (
                          <div className="contact-container" key={contact.id}>
                            <div className="contact">
                              <button
                                className="cart"
                                onClick={() => {
                                  props.setChatRoomId(contact.roomId);
                                  props.setIsContactModalOpen(false);
                                }}
                              >
                                <div className="contact-image-container">
                                  {contact.avatar ? (
                                    <img
                                      src={contact.avatar}
                                      alt={contact.name}
                                    />
                                  ) : (
                                    <div className="avatar-placeholder">
                                      {contact.name.slice(0, 1).toUpperCase()}
                                    </div>
                                  )}
                                </div>
                                <div className="contact-text">
                                  <p>{contact.name}</p>
                                  <p>{contact.email}</p>
                                </div>
                              </button>
                              <div className="delete-button-container">
                                <button
                                  onClick={() => removeContact(contact.id)}
                                >
                                  <MdDelete className="delete-button" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div>
                    <div>
                      <div className="search-form-container">
                        <form className="search-form" onSubmit={searchByEmail}>
                          <input type="text" placeholder="Search" />
                          <input type="submit" value="🔍" />
                        </form>
                      </div>
                      {searchedUser && (
                        <div className="contacts-container search-result-container">
                          <div className="contact-container">
                            <div className="contact">
                              <button className="cart" onClick={() => {}}>
                                <div className="contact-image-container">
                                  {searchedUser.avatar ? (
                                    <img
                                      src={searchedUser.avatar}
                                      alt={searchedUser.name}
                                    />
                                  ) : (
                                    <div className="avatar-placeholder">
                                      {searchedUser.name
                                        .slice(0, 1)
                                        .toUpperCase()}
                                    </div>
                                  )}
                                </div>
                                <div className="contact-text">
                                  <p>{searchedUser.name}</p>
                                  <p>{searchedUser.email}</p>
                                </div>
                              </button>
                              <div className="add-button-container">
                                {profileData[0].contacts.find(
                                  (contact) =>
                                    contact.email === searchedUser.email
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
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {props.isSettingModalOpen && <Settings />}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ProfileData;
