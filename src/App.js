import "./App.css";
import ChatMessage from "./ChatMessage";
import SignIn from "./SignIn";
import SignOut from "./SignOut";

import { useState, useRef, useEffect } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { MdAttachFile } from "react-icons/md";
import { AiFillMessage } from "react-icons/ai";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import TextareaAutosize from "react-textarea-autosize";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

const config = {
  apiKey: "AIzaSyCyPX4xnNg9Vo4CZa94bYaz-U38EaxWfIA",
  authDomain: "chat-app-627c6.firebaseapp.com",
  projectId: "chat-app-627c6",
  storageBucket: "chat-app-627c6.appspot.com",
  messagingSenderId: "757724613437",
  appId: "1:757724613437:web:da90b14bcfa92476dd5354",
  measurementId: "G-7QYM9E34V2",
  databaseUrl: "https://chat-app-627c6-default-rtdb.firebaseio.com/",
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
} else {
  firebase.app();
}

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isRegisterButtonVisible, setIsRegisterButtonVisible] = useState(true);

  console.log(user);

  useEffect(() => {
    if (user) setIsRegisterButtonVisible(false);
    else setIsRegisterButtonVisible(true);
  }, [user, setIsRegisterButtonVisible]);

  return (
    <div className="App">
      <header>
        <i>
          <AiFillMessage style={{ color: "rebeccapurple", fontSize: "2rem" }} />
        </i>
        Messenger
        <div>
          {user ? <SignOut auth={auth} /> : <SignIn auth={auth} />}
          {isRegisterButtonVisible && (
            <button onClick={() => setIsRegisterModalOpen(true)}>
              register
            </button>
          )}
        </div>
      </header>
      {isRegisterModalOpen ? (
        <Register />
      ) : (
        <section>{user && <ChatRoom />}</section>
      )}
    </div>
  );
}

function Register() {
  return <div>Registeringingingin</div>;
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt", "desc").limit(20);
  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
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
                  msg.uid === auth.currentUser.uid ? "sent" : "received"
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
          />
          <button type="submit" className="form-button">
            <AiOutlineSend className="icon" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;

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
