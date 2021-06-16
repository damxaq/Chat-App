import React, { useState, useEffect } from "react";

import { useGlobalContext } from "./App";

import ChatRoom from "./ChatRoom";
import Settings from "./Settings";
import Contact from "./Contact";
import Invite from "./Invite";

import { useCollectionData } from "react-firebase-hooks/firestore";

import firebase from "firebase/app";
import "firebase/firestore";

const ProfileData = () => {
  const {
    firestore,
    user,
    isSettingModalOpen,
    isContactModalOpen,
    chatRoomId,
    encrypt,
  } = useGlobalContext();

  const accountsRef = firestore.collection("accounts");
  const query = accountsRef.where("__name__", "==", user.uid);
  const [profileData] = useCollectionData(query, { idField: "id" });
  const profileRef = firestore.collection("accounts").doc(user.uid);
  const rooms = firestore.collection("rooms");
  const [contacts, setContacts] = useState([]);
  const [userNotFound, setUserNotFound] = useState("");
  const [searchedUser, setSearchedUser] = useState(undefined);
  const [invites, setInvites] = useState([]);

  console.log("profileData", profileData);

  const generateRoomId = (user1, user2) => {
    return user1 > user2 ? user2 + user1 : user1 + user2;
  };

  const addUserToContacts = async (contactToAdd) => {
    if (
      !profileData[0].contacts.find(
        (contact) => contact.email === contactToAdd.email
      )
    ) {
      const roomId = generateRoomId(profileData[0].id, contactToAdd.id);

      sendInvite(contactToAdd.id, profileData[0].email);

      setSearchedUser(undefined);
      const newContact = { ...contactToAdd };
      newContact.roomId = roomId;

      createRoom(roomId);
      await profileRef.update({
        contacts: [...profileData[0].contacts, newContact],
        rooms: firebase.firestore.FieldValue.arrayUnion(roomId),
      });
    }
  };

  const sendInvite = (userId, email) => {
    if (email !== profileData[0].email) {
      var docRef = firestore.collection("accounts").doc(userId);

      docRef.update({
        invites: firebase.firestore.FieldValue.arrayUnion(email),
      });
    }
  };

  const removeInvite = (email) => {
    if (profileData[0]) {
      var docRef = firestore.collection("accounts").doc(profileData[0].id);

      docRef.update({
        invites: firebase.firestore.FieldValue.arrayRemove(email),
      });
    }
  };

  useEffect(() => {
    if (profileData && profileData.length) {
      setContacts(profileData[0].contacts);
      let invitesArray = [];
      profileData[0].invites.forEach((invite) => {
        if (
          !profileData[0].contacts.find((contact) => contact.email === invite)
        )
          invitesArray.push(invite);
      });

      setInvites(invitesArray);

      refreshContacts();
    } else {
      setContacts([]);
      setInvites([]);
    }
  }, [profileData]);

  const createRoom = async (roomId) => {
    if (!profileData[0].rooms.includes(roomId)) {
      await rooms
        .doc(roomId)
        .collection("messages")
        .doc()
        .set({
          text: encrypt(`${profileData[0].name} has joined the chat!`),
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          uid: profileData[0].id,
          isPhoto: false,
        });
    }
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

  const refreshContacts = () => {
    if (profileData && profileData[0].contacts.length > 0) {
      profileData[0].contacts.forEach((contact) => {
        const docRef = firestore.collection("accounts").doc(contact.id);
        docRef
          .get()
          .then((doc) => {
            if (doc.exists) {
              const userName = doc.data().name;
              const userAvatar = doc.data().avatar;
              if (userName !== contact.name || userAvatar !== contact.avatar) {
                console.log("Updating contacts");
                let updatedContacts = profileData[0].contacts.filter(
                  (element) => element.id !== contact.id
                );
                updatedContacts.push({
                  avatar: userAvatar,
                  name: userName,
                  email: contact.email,
                  id: contact.id,
                  roomId: contact.roomId,
                });
                profileRef.update({
                  contacts: updatedContacts,
                });
              }
            }
          })
          .catch((error) => {
            console.log("Error getting document:", error);
          });
      });
    }
  };

  const removeContact = async (id) => {
    const filteredContacts = profileData[0].contacts.filter(
      (contact) => contact.id !== id
    );
    await profileRef.update({
      contacts: filteredContacts,
    });
  };

  useEffect(() => {
    const refreshContactsInterval = setInterval(() => {
      refreshContacts();
    }, 300000);

    return () => clearInterval(refreshContactsInterval);
  }, []);

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
                          <Contact
                            key={contact.id}
                            contact={contact}
                            removeContact={removeContact}
                            search={false}
                            addUserToContacts={addUserToContacts}
                          />
                        ))}
                    </div>

                    {invites && invites.length > 0 && (
                      <div className="contacts-container">
                        Invitations:
                        {invites.map((email) => (
                          <Invite
                            key={email}
                            email={email}
                            accountsRef={accountsRef}
                            addUserToContacts={addUserToContacts}
                            removeInvite={removeInvite}
                            contacts={contacts}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="search-form-container">
                      <form className="search-form" onSubmit={searchByEmail}>
                        <input type="text" placeholder="Search by email" />
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
                        <Contact
                          contact={searchedUser}
                          removeContact={removeContact}
                          search={true}
                          addUserToContacts={addUserToContacts}
                          profileData={profileData}
                        />
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
