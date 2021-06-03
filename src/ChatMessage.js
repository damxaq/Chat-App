import React, { useRef } from "react";

const ChatMessage = (props) => {
  const { text, isPhoto } = props.message;
  const photoURL = props.photoURL;
  const messageClass = props.messageClass;
  const modalRef = useRef();
  const guestName = props.guestName;

  return (
    <>
      <div className={`message ${messageClass}`}>
        {messageClass === "received" && (
          <div className="profile-img">
            {photoURL ? (
              <img src={photoURL} alt="img" />
            ) : (
              <div className="chat-avatar-placeholder">
                {guestName.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>
        )}
        <div
          className="message-content"
          className={`message-content ${messageClass}`}
        >
          {isPhoto ? (
            <>
              <img
                className="thumb-img"
                src={text}
                alt={text}
                onClick={() => {
                  modalRef.current.style.display = "block";
                }}
              />
              <div className="modal" ref={modalRef}>
                <span
                  className="close"
                  onClick={() => {
                    modalRef.current.style.display = "none";
                  }}
                >
                  X
                </span>
                <img className="modal-content" src={text} alt="img" />
              </div>
            </>
          ) : (
            <p>{text}</p>
          )}
        </div>
        {messageClass === "sent" && (
          <div className="profile-img">
            {photoURL ? (
              <img src={photoURL} alt="img" />
            ) : (
              <div className="chat-avatar-placeholder">
                {guestName.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ChatMessage;
