import React, { useState, useEffect } from "react";

import Contact from "./Contact";

import "firebase/firestore";

const Invite = ({ email, accountsRef, addUserToContacts, removeInvite }) => {
  const [contact, setContact] = useState(undefined);

  const getInviteData = () => {
    const query = accountsRef.where("email", "==", email);
    query
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const invitor = {
            email: doc.data().email,
            id: doc.data().id,
            name: doc.data().name,
            avatar: doc.data().avatar,
          };
          setContact(invitor);
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  useEffect(() => {
    getInviteData();
  }, []);

  return (
    <div>
      {contact && (
        <div className="contacts-container search-result-container">
          <Contact
            contact={contact}
            search={true}
            addUserToContacts={addUserToContacts}
            invite={true}
            removeInvite={removeInvite}
          />
        </div>
      )}
    </div>
  );
};

export default Invite;
