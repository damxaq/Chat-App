import React, { useState, useRef, useEffect } from "react";

import ChatMessage from "./ChatMessage";
import { AiOutlineSend } from "react-icons/ai";
import { MdAttachFile } from "react-icons/md";

import TextareaAutosize from "react-textarea-autosize";
import { useCollectionData } from "react-firebase-hooks/firestore";

import firebase from "firebase/app";
import "firebase/firestore";

const ChatRoom = (props) => {
  const firestore = props.firestore;
  const auth = props.auth;
  const dummy = useRef();
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt", "desc").limit(20);
  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    if (formValue) {
      await messagesRef.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL,
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
    <div className="chat-room">
      <div className="messages-container">
        {messages &&
          messages
            .map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                messageClass={
                  msg && msg.uid === auth.currentUser.uid ? "sent" : "received"
                }
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