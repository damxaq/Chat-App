import React, { useState, useRef, useEffect } from "react";

import ChatMessage from "./ChatMessage";
import SideContacts from "./SideContacts";
import { AiOutlineSend } from "react-icons/ai";
import { MdAttachFile } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { TiDeleteOutline } from "react-icons/ti";

import TextareaAutosize from "react-textarea-autosize";
import { useCollectionData } from "react-firebase-hooks/firestore";

import firebase from "firebase/app";
import "firebase/firestore";

const ChatRoom = (props) => {
  const firestore = props.firestore;
  const user = props.user;
  const roomId = props.roomId;
  const dummy = useRef();
  const imageFileRef = useRef();
  const messagesRef = firestore
    .collection("rooms")
    .doc(roomId)
    .collection("messages");
  const query = messagesRef.orderBy("createdAt", "desc").limit(20);
  const [messages] = useCollectionData(query, { idField: "id" });
  const storageRef = firebase.storage().ref();
  const chatGuest = user.contacts.filter(
    (contact) => contact.roomId === roomId
  )[0];

  const [sideContactsVisible, setSideContactsVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    console.log("sendMessage", e);

    if (selectedFile) {
      console.log(selectedFile);
      uploadImage(selectedFile);
    }

    const { id, photoURL } = user;

    if (formValue) {
      await messagesRef.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid: id,
        isPhoto: false,
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

  const uploadImage = async (file) => {
    var metadata = {
      contentType: "image/jpeg",
    };
    var uploadTask = storageRef
      .child("images/" + file.name)
      .put(file, metadata);
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED:
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING:
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        switch (error.code) {
          case "storage/unauthorized":
            console.log("storage/unauthorized");
            break;
          case "storage/canceled":
            console.log("storage/canceled");
            break;
          case "storage/unknown":
            console.log("storage/unknown");
            break;
        }
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
          console.log("File available at", downloadURL);
          cancelImage();
          imageFileRef.current.value = "";
          await messagesRef.add({
            text: downloadURL,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid: user.id,
            isPhoto: true,
          });
        });
      }
    );
  };

  const readURL = (file) => {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = (e) => res(e.target.result);
      reader.onerror = (e) => rej(e);
      reader.readAsDataURL(file);
    });
  };

  const onFileChange = async (event) => {
    console.log("event", event);
    const file = event.target.files[0];
    setSelectedFile(file);
    const url = await readURL(file);
    setImageData(url);
  };

  const handleImageAttach = (e) => {
    e.preventDefault();
    console.log(imageFileRef);
    imageFileRef.current.click();
  };

  const cancelImage = () => {
    setSelectedFile(null);
    setImageData(null);
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
        <input
          type="file"
          id="image-file"
          className="image-file"
          ref={imageFileRef}
          onChange={onFileChange}
        />
        <form onSubmit={sendMessage} onKeyDown={onKeyPress}>
          <button className="form-button" onClick={handleImageAttach}>
            <MdAttachFile className="icon" />
          </button>
          {selectedFile && (
            <div className="image-preview-container">
              {imageData && (
                <div className="image-preview">
                  <img src={imageData} alt={selectedFile.name} />
                  <button onClick={cancelImage}>
                    <TiDeleteOutline />
                  </button>
                </div>
              )}
              <p>
                {selectedFile.name.length > 12 && <>...</>}
                {selectedFile.name.substring(selectedFile.name.length - 12)}
              </p>
            </div>
          )}
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
