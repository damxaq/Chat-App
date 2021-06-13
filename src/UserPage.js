// TODO add waiting to make sure user is created in database before showing profiledata

import React, { useState, useEffect } from "react";

import { useGlobalContext } from "./App";

import ProfileData from "./ProfileData";

import "firebase/firestore";

const UserPage = () => {
  const { firestore, user, setIsContactModalOpen } = useGlobalContext();

  const [accountReady, setAccountReady] = useState(false);

  const accountIdsRef = firestore.collection("accountIds");
  const accountsRef = firestore.collection("accounts");

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
          setIsContactModalOpen(true);
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
            invites: [],
            rooms: [],
          });
          setAccountReady(true);
          setIsContactModalOpen(true);
        }
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, [user, setAccountReady]);

  return <>{accountReady && <ProfileData />}</>;
};

export default UserPage;
