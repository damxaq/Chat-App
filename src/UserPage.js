import React, { useState, useEffect } from "react";

import { useCollectionData } from "react-firebase-hooks/firestore";

import firebase from "firebase/app";
import "firebase/firestore";

const UserPage = (props) => {
  const firestore = props.firestore;
  const user = props.user;

  //   const [accountReady, setAccountReady] = useState(false);

  const myAccount = {
    email: user.email,
    id: user.uid,
    avatar: user.photoURL,
    name: user.displayName ? user.displayName : user.email.split("@")[0],
    contacts: [],
  };

  console.log(myAccount);

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

  const createAccount = async (myAccount) => {
    await accountIdsRef.doc(myAccount.id).set({
      email: myAccount.email,
    });

    await accountsRef.doc(myAccount.id).set({
      myAccount,
    });
  };

  useEffect(() => {
    if (accountIds && !ids.includes(myAccount.id)) {
      console.log("creating account");
      createAccount(myAccount);
    }
  }, [user, accountIds]);

  //   console.log(myAccount);

  return <div>account page</div>;
};

export default UserPage;
