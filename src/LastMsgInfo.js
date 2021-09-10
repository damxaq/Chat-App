import React, { useState, useEffect } from "react";

import { useGlobalContext } from "./App";

import "firebase/firestore";

const LastMsgInfo = ({ roomId }) => {
  const { firestore, decrypt } = useGlobalContext();

  const [msgInfo, setMsgInfo] = useState(null);

    const messageRef = firestore
    .collection("rooms")
    .doc(roomId)
    .collection("messages");

  const getLastMsgData = () => {
    messageRef
      .orderBy("createdAt", "desc")
      .limit(1)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const msgData = {
            text: decrypt(doc.data().text, roomId),
            isPhoto: doc.data().isPhoto,
            createdAt: doc.data().createdAt,
          };
          setMsgInfo(msgData);
        });
      })
      .catch((error) => {
        console.log("Error getting last message: ", error);
      });
  };

  useEffect(() => {
    // Refreshing previews of last messages once in a minute
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
    if (time) {
      time = time.toDate();
      const now = new Date();
      const diff = Math.round((now - time) / (1000 * 60));
      return diff < 1
        ? "now"
        : diff < 120
        ? `${diff} min`
        : diff < 60 * 48
        ? `${Math.round(diff / 60)} h`
        : `${Math.round(diff / (60 * 24))} d`;
    } else return "";
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
