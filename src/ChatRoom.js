import React, { useState, useRef, useEffect } from "react";
import { useGlobalContext } from "./App";

import ChatMessage from "./ChatMessage";
import SideContacts from "./SideContacts";
import ChatRoomForm from "./ChatRoomForm";
import { GiHamburgerMenu } from "react-icons/gi";

import { useCollectionData } from "react-firebase-hooks/firestore";

import firebase from "firebase/app";
import "firebase/firestore";

const ChatRoom = ({ user, contacts }) => {
  const { firestore, chatRoomId } = useGlobalContext();
  const bottomChatRef = useRef();
  const imageFileRef = useRef();
  const messagesRef = firestore
    .collection("rooms")
    .doc(chatRoomId)
    .collection("messages");
  const [msgLimit, setMsgLimit] = useState(20);
  const query = messagesRef.orderBy("createdAt", "desc").limit(msgLimit);
  const [messages] = useCollectionData(query, { idField: "id" });
  const storageRef = firebase.storage().ref();
  const chatGuest = user.contacts.filter(
    (contact) => contact.roomId === chatRoomId
  )[0];

  const [sideContactsVisible, setSideContactsVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scrollToBottom, setScrollToBottom] = useState(true);
  const [imageData, setImageData] = useState(null);

  const sendMessage = async (formValue) => {
    if (selectedFile) {
      setLoading(true);
      console.log(selectedFile);
      uploadImage(selectedFile);
    }

    if (formValue) {
      await messagesRef.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid: user.id,
        isPhoto: false,
      });
    }
    if (!scrollToBottom) setScrollToBottom(true);
  };

  const uploadImage = async (file) => {
    cancelImage();
    const timestamp = Math.round(new Date().getTime() / 1000).toString();
    const newFile = timestamp + file.name;

    var metadata = {
      contentType: "image/jpeg",
    };
    var uploadTask = storageRef.child("images/" + newFile).put(file, metadata);
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
          default:
            break;
        }
      },
      (error) => {
        setLoading(false);
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
          default:
            break;
        }
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
          imageFileRef.current.value = "";
          await messagesRef.add({
            text: downloadURL,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid: user.id,
            isPhoto: true,
            photoTitle: newFile,
          });
          setLoading(false);
        });
      }
    );
  };

  const handleLoadMore = () => {
    if (scrollToBottom) {
      setScrollToBottom(false);
    }
    if (messages && messages.length === msgLimit) {
      setMsgLimit(msgLimit + 20);
    }
  };

  const cancelImage = () => {
    setSelectedFile(null);
    setImageData(null);
  };

  useEffect(() => {
    if (bottomChatRef && bottomChatRef.current && scrollToBottom) {
      bottomChatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!scrollToBottom) setScrollToBottom(true);
  }, [chatRoomId]);

  return (
    <>
      {chatGuest && (
        <div
          className="chat-room"
          style={{
            marginLeft: `${sideContactsVisible ? "10rem" : "0"}`,
            transition: "margin 0.2s",
          }}
        >
          <div className="hamburger-container">
            <button
              className={sideContactsVisible ? "active" : ""}
              onClick={() => setSideContactsVisible(!sideContactsVisible)}
            >
              <GiHamburgerMenu />
            </button>
          </div>
          {sideContactsVisible && (
            <div className="side-contacts">
              <SideContacts contacts={contacts} />
            </div>
          )}
          <div className="messages-container">
            <div className="room-title-container">
              <div className="room-title">{chatGuest.name}</div>
            </div>
            <div ref={bottomChatRef}></div>
            {messages && messages.length > 0 && messages.length % 20 === 0 ? (
              <div className="show-more" onClick={() => handleLoadMore()}>
                Show More
              </div>
            ) : (
              <></>
            )}
            {messages &&
              messages
                .map((msg, index) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    guestName={chatGuest.name}
                    prevMsgTime={
                      messages[index + 1] ? messages[index + 1].createdAt : null
                    }
                    photoURL={
                      msg && msg.uid === user.id
                        ? chatGuest.avatar
                        : user.avatar
                    }
                    messageClass={
                      msg && msg.uid === user.id ? "sent" : "received"
                    }
                  />
                ))
                .reverse()}
            <div ref={bottomChatRef}></div>
          </div>
          <ChatRoomForm
            sendMessage={sendMessage}
            loading={loading}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            imageData={imageData}
            setImageData={setImageData}
            imageFileRef={imageFileRef}
            cancelImage={cancelImage}
          />
        </div>
      )}
    </>
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
