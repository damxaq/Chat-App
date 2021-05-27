import React, { useState, useEffect } from "react";

import ChatRoom2 from "./ChatRoom2";

import { useCollectionData } from "react-firebase-hooks/firestore";

import { MdDelete } from "react-icons/md";

import "firebase/firestore";

const ProfileData = (props) => {
  const firestore = props.firestore;
  const accountsRef = firestore.collection("accounts");
  const query = accountsRef.where("__name__", "==", props.user.uid);
  const [profileData] = useCollectionData(query, { idField: "id" });
  const profileRef = firestore.collection("accounts").doc(props.user.uid);
  const rooms = firestore.collection("rooms");
  const [chatRoomId, setChatRoomId] = useState(null);

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

      const newContact = { ...searchedUser };
      newContact.roomId = roomId;

      createRoom(roomId);
      await profileRef.update({
        contacts: [...profileData[0].contacts, newContact],
      });
      setSearchedUser(undefined);
    }
  };

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

  return (
    <>
      {profileData && (
        <div>
          {chatRoomId ? (
            <ChatRoom2
              firestore={firestore}
              user={profileData[0]}
              roomId={chatRoomId}
            />
          ) : (
            <div className="profile-data-container">
              <div>
                <img
                  src={profileData[0].avatar}
                  alt={profileData[0].name}
                  style={{ borderRadius: "50%" }}
                />
              </div>
              <div>{profileData[0].email}</div>
              <div>{profileData[0].name}</div>
              <div>
                <h3>Your contacts my Lord:</h3>
                <div className="contacts-container">
                  {profileData[0].contacts &&
                    profileData[0].contacts.map((contact) => (
                      <div className="contact-container" key={contact.id}>
                        <div className="contact">
                          <button
                            className="cart"
                            onClick={() => setChatRoomId(contact.roomId)}
                          >
                            <div className="contact-image-container">
                              <img src={contact.avatar} alt={contact.name} />
                            </div>
                            <div className="contact-text">
                              <p>{contact.name}</p>
                              <p>{contact.email}</p>
                            </div>
                          </button>
                          <div className="delete-button-container">
                            <button>
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
                    <div className="search-result-container">
                      <div>{searchedUser.name}</div>
                      <div>{searchedUser.email}</div>
                      {profileData[0].contacts.find(
                        (contact) => contact.email === searchedUser.email
                      ) ? (
                        <div>already in!</div>
                      ) : (
                        <button onClick={() => addUserToContacts()}>+</button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ProfileData;
