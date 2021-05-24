import React from "react";

const ChatMessage = (props) => {
  const { text, photoURL } = props.message;
  const messageClass = props.messageClass;

  return (
    <div className={`message ${messageClass}`}>
      {/* <img src={photoURL} alt="img" /> */}
      <p>{text}</p>
    </div>
  );
};

export default ChatMessage;
