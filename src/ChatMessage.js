import React, { useRef, useEffect, useState } from "react";

const ChatMessage = (props) => {
  const { text, isPhoto, createdAt, photoTitle } = props.message;
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

  const Image = ({ url, title }) => {
    if (url && title !== undefined) {
      const image = window.localStorage.getItem(title);
      if (image && image !== "FAIL") {
        return (
          <img
            src={"data:image/jpeg;" + image}
            className="thumb-img"
            alt={text}
            onClick={() => {
              modalRef.current.style.display = "block";
            }}
          />
        );
      } else {
        if (!image) createBase64(url, title);
        return (
          <img
            className="thumb-img"
            src={text}
            alt={text}
            onClick={() => {
              modalRef.current.style.display = "block";
            }}
          />
        );
      }
    }
  };

  const createBase64 = (path, title) => {
    console.log("creating image in local storage");
    let image = document.createElement("img");
    document.body.appendChild(image);
    image.setAttribute("style", "display:none");
    image.setAttribute("alt", "script div");
    image.setAttribute("src", path);
    image.setAttribute("crossOrigin", "anonymous");

    image.onload = () => {
      let imgCanvas = document.createElement("canvas");
      let imgContext = imgCanvas.getContext("2d");
      imgCanvas.width = image.width;
      imgCanvas.height = image.height;
      imgContext.drawImage(image, 0, 0, image.width, image.height);
      const imgInfo = imgCanvas.toDataURL("image/png");
      try {
        localStorage.setItem(title, imgInfo);
      } catch (error) {
        console.log(error);
        localStorage.setItem(title, "FAIL");
      }
      document.body.removeChild(image);
    };
  };

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
        <div className={`message-content ${messageClass}`}>
          {isPhoto ? (
            <>
              <Image url={text} title={photoTitle} />
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
