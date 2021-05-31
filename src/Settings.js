import React, { useState, useEffect } from "react";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

const Settings = (props) => {
  const firestore = props.firestore;
  const profileData = props.profileData;
  const profileRef = props.profileRef;

  const ALLOWED_SIZE = 100000;
  var storageRef = firebase.storage().ref();

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

  useEffect(() => {
    console.log(selectedFile);
    if (
      selectedFile &&
      selectedFile.type === "image/jpeg" &&
      selectedFile.size < ALLOWED_SIZE
    ) {
      setfileCorrect(true);
    }
  }, [selectedFile, setfileCorrect]);

  const uploadAvatar = (file) => {
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
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log("File available at", downloadURL);
          updateAvatar(downloadURL);
        });
      }
    );
  };

  return (
    <div>
      Settings
      <div>
        <h3>Upload Profile Photo</h3>
        <div>
          <input type="file" onChange={onFileChange} />
        </div>
        {selectedFile && (
          <div>
            <p>File Name: {selectedFile.name}</p>
            <p>File Type: {selectedFile.type}</p>
            <p>File Size: {selectedFile.size}</p>
          </div>
        )}
        {selectedFile && selectedFile.size > ALLOWED_SIZE && (
          <div>File too big! 100kB maximum</div>
        )}
        {selectedFile && selectedFile.type !== "image/jpeg" && (
          <div>Wrong type of file!</div>
        )}
        {selectedFile && fileCorrect && (
          <button onClick={onFileUpload}>Upload!</button>
        )}
      </div>
    </div>
  );
};

export default Settings;
