import React, { useRef, useEffect, useState } from "react";
import { useGlobalContext } from "./App";
import { Emoji } from "emoji-mart";

const ChatMessage = ({
  message,
  photoURL,
  messageClass,
  prevMsgTime,
  guestName,
}) => {
  const { decrypt } = useGlobalContext();
  const { text, isPhoto, createdAt, photoTitle } = message;
  const modalRef = useRef();
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

  const decryptedText = decrypt(text);

  const Image = ({ url, title }) => {
    if (url && title !== undefined) {
      const image = window.localStorage.getItem(title);
      if (image && image !== "FAIL") {
        return (
          <img
            src={"data:image/jpeg;" + image}
            className="thumb-img"
            alt={decryptedText}
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
            src={decryptedText}
            alt={decryptedText}
            onClick={() => {
              modalRef.current.style.display = "block";
            }}
          />
        );
      }
    }
    return <></>;
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

  const EmojiMessage = ({ msg }) => {
    console.log(msg.split(/[::]/));
    return (
      <p>
        {msg.split(/[::]/).map((word) => {
          return (
            word && (
              <Emoji
                set={"google"}
                emoji={word}
                size={18}
                fallback={(emoji, props) => {
                  console.log("-----", emoji, props);
                  return emoji ? `:${emoji.short_names[0]}:` : props.emoji;
                }}
              />
            )
          );
        })}
      </p>
    );
    return <p>{msg}</p>;
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
              <Image url={decryptedText} title={photoTitle} />
              <div className="modal" ref={modalRef}>
                <span
                  className="close"
                  onClick={() => {
                    modalRef.current.style.display = "none";
                  }}
                >
                  X
                </span>
                <img className="modal-content" src={decryptedText} alt="img" />
              </div>
            </>
          ) : (
            <EmojiMessage msg={decryptedText} />
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
