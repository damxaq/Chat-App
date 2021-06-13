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

  const minutesPassed = (time) => {
    console.log(time.toDate());
    time = time.toDate();
    const now = new Date();
    const diff = Math.round((now - time) / (1000 * 60));
    return diff < 1 ? "now" : `${diff} min`;
  };

  return (
    <>
      {msgInfo && (
        <>
          {msgInfo.isPhoto ? (
            <p>[Image]</p>
          ) : (
            <div className="last-msg">
              <i style={{ color: "silver" }}>{shortenMsg(msgInfo.text)}</i>
              <span>{minutesPassed(msgInfo.createdAt)}</span>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default LastMsgInfo;
