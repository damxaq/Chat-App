import React, { useState, useEffect, useRef } from "react";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

const Settings = ({ profileData, profileRef }) => {
  const imageFileRef = useRef();
  const ALLOWED_SIZE = 500000;
  const storageRef = firebase.storage().ref();

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileCorrect, setfileCorrect] = useState(false);

  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const onFileUpload = () => {
    const formData = new FormData();
    formData.append("myFile", selectedFile, selectedFile.name);

    if (fileCorrect) uploadAvatar(selectedFile);
  };

  const updateAvatar = async (url) => {
    await profileRef.update({
      avatar: url,
    });
  };

  const updateName = async (e) => {
    e.preventDefault();
    const newName = e.target[0].value;
    if (newName && newName !== profileData.name) {
      e.target[0].value = "";
      await profileRef.update({
        name: newName,
      });
    }
  };

  useEffect(() => {
    if (
      selectedFile &&
      selectedFile.type === "image/jpeg" &&
      selectedFile.size < ALLOWED_SIZE
    ) {
      setfileCorrect(true);
    } else {
      setfileCorrect(false);
    }
  }, [selectedFile, setfileCorrect]);

  const uploadAvatar = (file) => {
    const timestamp = Math.round(new Date().getTime() / 1000).toString();
    const newFile = timestamp + file.name;

    var metadata = {
      contentType: "image/jpeg",
    };
    var uploadTask = storageRef
      .child("profile_photos/" + newFile)
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
          default:
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
          default:
            break;
        }
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log("File available at", downloadURL);
          updateAvatar(downloadURL);
          setSelectedFile(null);
          imageFileRef.current.value = "";
        });
      }
    );
  };

  const handleImageAttach = (e) => {
    e.preventDefault();
    imageFileRef.current.click();
  };

  return (
    <div className="settings-container">
      <div className="file-upload-settings">
        <h4>Change Profile Picture:</h4>
        <div className="file-upload-button-container">
          <button className="change-name-button" onClick={handleImageAttach}>
            Choose file
          </button>
        </div>
        <input
          type="file"
          onChange={onFileChange}
          ref={imageFileRef}
          style={{ display: "none" }}
        />
        {selectedFile && (
          <div>
            <p>File Type: {selectedFile.type}</p>
            <p>File Size: {Math.round(selectedFile.size / 1000)} KB</p>
          </div>
        )}
        {selectedFile && selectedFile.size > ALLOWED_SIZE && (
          <p>File too big! 100kB maximum</p>
        )}
        {selectedFile && selectedFile.type !== "image/jpeg" && (
          <p>Wrong type of file!</p>
        )}
        {selectedFile && fileCorrect && (
          <div className="file-upload-button-container">
            <button onClick={onFileUpload} className="change-name-button">
              Upload!
            </button>
          </div>
        )}
      </div>
      <div className="change-name-settings">
        <h4 className="change-name-title">Change Name:</h4>
        <div className="change-name-form">
          <form onSubmit={updateName}>
            <input type="text" placeholder={profileData.name} minLength="4" />
            <button type="submit" className="change-name-button">
              Change
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
