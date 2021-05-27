import React, { useState, useEffect } from "react";

import ProfileData from "./ProfileData";

import { useCollectionData } from "react-firebase-hooks/firestore";

import "firebase/firestore";

const UserPage = (props) => {
  const firestore = props.firestore;
  const user = props.user;

  const [accountReady, setAccountReady] = useState(false);

  const accountIdsRef = firestore.collection("accountIds");
  const [accountIds] = useCollectionData(accountIdsRef, { idField: "id" });
  const accountsRef = firestore.collection("accounts");

  console.log(accountIds);

  let ids = [];
  if (accountIds && accountIds.length) {
    ids = accountIds.map((account) => {
      return account.id;
    });
  }

  console.log(ids);

  const createAccount = async (account) => {
    await accountIdsRef.doc(user.uid).set({
      email: account.email,
    });

    await accountsRef.doc(account.id).set(account);
  };

  useEffect(() => {
    const query = accountIdsRef.where("email", "==", user.email);
    query
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.docs && querySnapshot.docs.length) {
          console.log("email exist");
          setAccountReady(true);
        } else {
          console.log("creating account");
          createAccount({
            email: user.email,
            id: user.uid,
            avatar: user.photoURL,
            name: user.displayName
              ? user.displayName
              : user.email.split("@")[0],
            contacts: [],
          });
          setAccountReady(true);
        }
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, [user, setAccountReady]);

  return (
    <div className="user-page-container">
      {accountReady && <ProfileData firestore={firestore} user={user} />}
    </div>
  );
};

export default UserPage;
