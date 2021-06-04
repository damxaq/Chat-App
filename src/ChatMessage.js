import React, { useRef, useEffect, useState } from "react";

const ChatMessage = (props) => {
  const { text, isPhoto, createdAt } = props.message;
  const photoURL = props.photoURL;
  const messageClass = props.messageClass;
  const prevMsgTime = props.prevMsgTime;
  const modalRef = useRef();
  const guestName = props.guestName;
  const msgDate = createdAt ? createdAt.toDate().toLocaleString() : null;
  const [showMsgTime, setshowMsgTime] = useState(false);
  const MIN_TIME_DIFFERENCE = 300;

  useEffect(() => {
    if (prevMsgTime > 0 && createdAt > 0) {
      const difference = Math.round(createdAt - prevMsgTime);
      if (difference > MIN_TIME_DIFFERENCE) {
        setshowMsgTime(true);
      }
    } else if (createdAt > 0 && !prevMsgTime) {
      setshowMsgTime(true);
    }
  }, [prevMsgTime, createdAt]);

  return (
    <>
      <div className="chat-msg-time">{showMsgTime && msgDate}</div>
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
