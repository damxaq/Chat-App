import React, { useState, useEffect } from "react";

import { useCollectionData } from "react-firebase-hooks/firestore";

import "firebase/firestore";

const ProfileData = (props) => {
  const firestore = props.firestore;
  const accountsRef = firestore.collection("accounts");
  const query = accountsRef.where("__name__", "==", props.user.uid);
  const [profileData] = useCollectionData(query, { idField: "id" });
  const profileRef = firestore.collection("accounts").doc(props.user.uid);

  const [searchedUser, setSearchedUser] = useState(undefined);

  console.log("profileData", profileData);

  const addUserToContacts = async () => {
    if (
      !profileData[0].contacts.find(
        (contact) => contact.email === searchedUser.email
      )
    ) {
      await profileRef.update({
        contacts: [...profileData[0].contacts, searchedUser],
      });
      setSearchedUser(undefined);
    }
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
    <div>
      {profileData && (
        <div>
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
            <div>
              {profileData[0].contacts.map((contact) => (
                <div key={contact.id}>{contact.name}</div>
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
      )}
    </div>
  );
};

export default ProfileData;
