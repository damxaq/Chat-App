import React, { useState, useEffect } from "react";

import { useGlobalContext } from "./App";

import "firebase/firestore";

const LastMsgInfo = ({ roomId }) => {
  const { firestore } = useGlobalContext();

  const messageRef = firestore
    .collection("rooms")
    .doc(roomId)
    .collection("messages");

  const [msgInfo, setMsgInfo] = useState(null);

  const getLastMsgData = () => {
    messageRef
      .orderBy("createdAt", "desc")
      .limit(1)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const msgData = {
            text: doc.data().text,
            isPhoto: doc.data().isPhoto,
            createdAt: doc.data().createdAt,
          };
          setMsgInfo(msgData);
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  useEffect(() => {
    getLastMsgData();
    const messageInterval = setInterval(() => {
      getLastMsgData();
    }, 60000);

    return () => clearInterval(messageInterval);
  }, []);

  const shortenMsg = (msg) => {
    return msg.substring(0, 15).concat(msg.length > 15 ? "..." : "");
  };

  return (
    <>
      {msgInfo && (
        <>
          {msgInfo.isPhoto ? (
            <p>[Image]</p>
          ) : (
            <i style={{ color: "silver" }}>{shortenMsg(msgInfo.text)}</i>
          )}
        </>
      )}
    </>
  );
};

export default LastMsgInfo;
