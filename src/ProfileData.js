import React, { useState, useEffect } from "react";

import { useGlobalContext } from "./App";

import ChatRoom from "./ChatRoom";
import Settings from "./Settings";
import LastMsgInfo from "./LastMsgInfo";

import { useCollectionData } from "react-firebase-hooks/firestore";

import { MdDelete } from "react-icons/md";
import { MdAddCircleOutline } from "react-icons/md";
import { TiTickOutline } from "react-icons/ti";

import firebase from "firebase/app";
import "firebase/firestore";

const ProfileData = () => {
  const {
    firestore,
    user,
    isSettingModalOpen,
    isContactModalOpen,
    setIsContactModalOpen,
    chatRoomId,
    setChatRoomId,
  } = useGlobalContext();

  const accountsRef = firestore.collection("accounts");
  const query = accountsRef.where("__name__", "==", user.uid);
  const [profileData] = useCollectionData(query, { idField: "id" });
  const profileRef = firestore.collection("accounts").doc(user.uid);
  const rooms = firestore.collection("rooms");
  const [contacts, setContacts] = useState([]);
  const [userNotFound, setUserNotFound] = useState("");

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

      sendInvite(searchedUser.id, searchedUser.email);

      setSearchedUser(undefined);
      const newContact = { ...searchedUser };
      newContact.roomId = roomId;

      createRoom(roomId);
      await profileRef.update({
        contacts: [...profileData[0].contacts, newContact],
      });
    }
  };

  const sendInvite = (userId, email) => {
    var docRef = firestore.collection("accounts").doc(userId);

    docRef.update({
      invites: firebase.firestore.FieldValue.arrayUnion(email),
    });
  };

  useEffect(() => {
    if (profileData && profileData.length) {
      setContacts(profileData[0].contacts);
    } else {
      setContacts([]);
    }
  }, [profileData]);

  // TODO: dont create room if it exist
  const createRoom = async (roomId) => {
    await rooms
      .doc(roomId)
      .collection("messages")
      .doc()
      .set({
        text: `${profileData[0].name} has joined the chat!`,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid: profileData[0].id,
        isPhoto: false,
      });
  };

  const searchByEmail = (e) => {
    e.preventDefault();

    if (searchedUser) {
      setSearchedUser(undefined);
    }
    const searchTerm = e.target[0].value;
    e.target[0].value = "";
    const query = accountsRef.where("email", "==", searchTerm);
    query
      .get()
      .then((querySnapshot) => {
        let userFound = false;
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          setSearchedUser({
            email: doc.data().email,
            avatar: doc.data().avatar,
            name: doc.data().name,
            id: doc.data().id,
          });
          if (userNotFound) {
            setUserNotFound("");
          }
          userFound = true;
        });
        if (!userFound) {
          setUserNotFound(searchTerm);
        }
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
      {profileData && profileData.length > 0 && (
        <>
          {chatRoomId ? (
            <ChatRoom user={profileData[0]} contacts={contacts} />
          ) : (
            <div className="profile-data-container">
              <div className="profile-photo">
                {profileData[0].avatar ? (
                  <img src={profileData[0].avatar} alt={profileData[0].name} />
                ) : (
                  <div className="main-photo-placeholder">
                    {profileData[0].name.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
              <div>{profileData[0].name}</div>
              <div>{profileData[0].email}</div>
              {isContactModalOpen && (
                <>
                  <div>
                    <div className="contacts-container">
                      {contacts &&
                        contacts.map((contact) => (
                          <div className="contact-container" key={contact.id}>
                            <div className="contact">
                              <button
                                className="cart"
                                onClick={() => {
                                  setChatRoomId(contact.roomId);
                                  setIsContactModalOpen(false);
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
                                  <LastMsgInfo roomId={contact.roomId} />
                                </div>
                              </button>
                              <div className="delete-button-container">
                                <button
                                  onClick={() => handleRemoveContact(contact)}
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
                    <div className="search-form-container">
                      <form className="search-form" onSubmit={searchByEmail}>
                        <input type="text" placeholder="Search" />
                        <input type="submit" value="🔍" />
                      </form>
                    </div>
                    {userNotFound && (
                      <div>
                        <p>
                          Could not find user: <i>{userNotFound}</i>
                        </p>
                      </div>
                    )}
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
                </>
              )}
              {isSettingModalOpen && (
                <Settings
                  firestore={firestore}
                  profileData={profileData[0]}
                  profileRef={profileRef}
                />
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ProfileData;
