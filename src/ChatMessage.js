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
  const { decrypt, chatRoomId } = useGlobalContext();
  const { text, isPhoto, createdAt, photoTitle } = message;
  const modalRef = useRef();
  const msgDate = createdAt ? createdAt.toDate().toLocaleString() : null;
  const [showMsgTime, setshowMsgTime] = useState(false);
  const MIN_TIME_DIFFERENCE = 300;
  const [messageEncrypted, setMessageEncrypted] = useState("");

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

  useEffect(() => {
    setMessageEncrypted(decrypt(text, chatRoomId));
  }, []);

  // Getting cached image from local storage, or caching image if it doesn't exist
  const Image = ({ url, title }) => {
    if (url && title !== undefined) {
      const image = window.localStorage.getItem(title);
      if (image && image !== "FAIL") {
        return (
          <img
            src={"data:image/jpeg;" + image}
            className="thumb-img"
            alt={messageEncrypted}
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
            src={messageEncrypted}
            alt={messageEncrypted}
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

  // Converting message string into an array of objects, to extract text between colons and check if it is an emoji
  const EmojiMessage = ({ msg }) => {
    const msgEmoji = [];
    let ending = null;
    const parts = msg.split(/(:)/);
    const testArr = parts.filter((part) => part !== "");

    if (testArr[0] !== ":")
      msgEmoji.push({ text: testArr.splice(0, 1)[0], isEmoji: false });
    if (testArr[testArr.length - 1] !== ":")
      ending = testArr.splice(testArr.length - 1, 1)[0];

    const arrayLength = testArr.length;

    // If array length is less than 2, then text message contains less than two colons, so it does not have emojis to check
    if (arrayLength > 2) {
      for (let i = testArr[0] === ":" ? 0 : 1; i < arrayLength; i++) {
        if (testArr[i] !== ":") {
          if (testArr[i].includes(" ")) {
            let addition = ":" + testArr[i];
            if (arrayLength === i + 2 && testArr[i + 1] === ":")
              addition += ":";
            msgEmoji.push({ text: addition, isEmoji: false });
          } else {
            msgEmoji.push({ text: testArr[i], isEmoji: true });
          }
        }
      }
    } else {
      return <p>{msg}</p>;
    }

    if (ending) msgEmoji.push({ text: ending, isEmoji: false });

    return (
      <p>
        {msgEmoji.map((part, index) => {
          if (part.text && part.isEmoji) {
            return (
              <Emoji
                key={index}
                set={"google"}
                emoji={part.text}
                size={18}
                fallback={() => {
                  return ":" + part.text + ":";
                }}
              />
            );
          } else return part.text;
        })}
      </p>
    );
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
              <Image url={messageEncrypted} title={photoTitle} />
              <div className="modal" ref={modalRef}>
                <span
                  className="close"
                  onClick={() => {
                    modalRef.current.style.display = "none";
                  }}
                >
                  X
                </span>
                <img
                  className="modal-content"
                  src={messageEncrypted}
                  alt="img"
                />
              </div>
            </>
          ) : (
            <EmojiMessage msg={messageEncrypted} />
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
