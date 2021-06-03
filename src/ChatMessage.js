import React, { useRef } from "react";

const ChatMessage = (props) => {
  const { text, photoURL, isPhoto } = props.message;
  const messageClass = props.messageClass;
  const modalRef = useRef();
  const modalImageRef = useRef();

  return (
    <>
      <div className={`message ${messageClass}`}>
        {/* <img src={photoURL} alt="img" /> */}
        {isPhoto ? (
          <div>
            <img
              className="thumb-img"
              src={text}
              alt={text}
              onClick={() => {
                modalRef.current.style.display = "block";
                // modalImageRef.current.img.src = { text };
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
              <img className="modal-content" src={text} alt="dupa" />
            </div>
          </div>
        ) : (
          <p>{text}</p>
        )}
      </div>
    </>
  );
};

export default ChatMessage;
