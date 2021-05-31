import React, { useState, useRef, useEffect } from "react";

import ChatMessage from "./ChatMessage";
import SideContacts from "./SideContacts";
import { AiOutlineSend } from "react-icons/ai";
import { MdAttachFile } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";

import TextareaAutosize from "react-textarea-autosize";
import { useCollectionData } from "react-firebase-hooks/firestore";

import firebase from "firebase/app";
import "firebase/firestore";

const ChatRoom = (props) => {
  const firestore = props.firestore;
  const user = props.user;
  const roomId = props.roomId;
  const dummy = useRef();
  const messagesRef = firestore
    .collection("rooms")
    .doc(roomId)
    .collection("messages");
  const query = messagesRef.orderBy("createdAt", "desc").limit(20);
  const [messages] = useCollectionData(query, { idField: "id" });
  const chatGuest = user.contacts.filter(
    (contact) => contact.roomId === roomId
  )[0];
  const [sideContactsVisible, setSideContactsVisible] = useState(false);

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { id, photoURL } = user;

    if (formValue) {
      await messagesRef.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid: id,
      });

      setFormValue("");
    }
  };

  const handleTextArea = (e) => {
    setFormValue(e.target.value);
  };

  const onKeyPress = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="chat-room"
      style={{
        marginLeft: `${sideContactsVisible ? "10rem" : "0"}`,
        transition: "margin 0.2s",
      }}
    >
      <div className="hamburger-container">
        <button onClick={() => setSideContactsVisible(!sideContactsVisible)}>
          <GiHamburgerMenu />
        </button>
      </div>
      {sideContactsVisible && (
        <div className="side-contacts">
          <SideContacts
            contacts={props.contacts}
            setChatRoomId={props.setChatRoomId}
            roomId={roomId}
          />
        </div>
      )}
      <div className="messages-container">
        <div className="room-title-container">
          <div className="room-title">{chatGuest.name}</div>
        </div>
        {messages &&
          messages
            .map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                messageClass={msg && msg.uid === user.id ? "sent" : "received"}
              />
            ))
            .reverse()}
        <div ref={dummy}></div>
      </div>

      <div className="form-container">
        <form onSubmit={sendMessage} onKeyDown={onKeyPress}>
          <button className="form-button">
            <MdAttachFile className="icon" />
          </button>
          <TextareaAutosize
            value={formValue}
            onChange={handleTextArea}
            placeholder="Write a message..."
            maxRows={3}
          />
          <button type="submit" className="form-button">
            <AiOutlineSend className="icon" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;

// var docRef = firestore.collection("messages").doc("test");

// docRef
//   .get()
//   .then((doc) => {
//     if (doc.exists) {
//       console.log("Document data:", doc.data());
//     } else {
//       // doc.data() will be undefined in this case
//       console.log("No such document!");
//     }
//   })
//   .catch((error) => {
//     console.log("Error getting document:", error);
//   });
