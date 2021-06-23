import React, { useState, useRef } from "react";

import { AiOutlineSend } from "react-icons/ai";
import { MdAttachFile } from "react-icons/md";
import { GrEmoji } from "react-icons/gr";
import { TiDeleteOutline } from "react-icons/ti";
import TextareaAutosize from "react-textarea-autosize";
import "emoji-mart/css/emoji-mart.css";
import data from "emoji-mart/data/google.json";
import { NimblePicker } from "emoji-mart";
import { Emoji } from "emoji-mart";

const ChatRoomForm = ({
  sendMessage,
  loading,
  selectedFile,
  setSelectedFile,
  imageData,
  setImageData,
  imageFileRef,
  cancelImage,
}) => {
  const [formValue, setFormValue] = useState("");
  const [correctFile, setCorrectFile] = useState(true);
  const [showEmoji, setShowEmoji] = useState(false);
  const textAreaRef = useRef();

  const ALLOWED_SIZE = 10000000;
  const handleTextArea = (e) => {
    setFormValue(e.target.value);
  };

  const addEmojiToTextArea = (emoji) => {
    setFormValue(formValue + emoji);
  };

  const onKeyPress = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendMessage(formValue);
    setFormValue("");
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
    if (correctFile === false) setCorrectFile(true);
    const file = event.target.files[0];
    if (
      file &&
      (file.type === "image/jpeg" || file.type === "image/png") &&
      file.size < ALLOWED_SIZE
    ) {
      setSelectedFile(file);
      const url = await readURL(file);
      setImageData(url);
    } else {
      cancelImage();
      setCorrectFile(false);
    }
    imageFileRef.current.value = "";
  };

  const handleImageAttach = (e) => {
    e.preventDefault();
    imageFileRef.current.click();
  };

  const addEmoji = (e) => {
    addEmojiToTextArea(e.colons);
    textAreaRef.current.focus();
  };

  return (
    <div className="form-container">
      <input
        type="file"
        id="image-file"
        className="image-file"
        ref={imageFileRef}
        onChange={onFileChange}
      />
      <form onSubmit={handleSendMessage} onKeyDown={onKeyPress}>
        <button
          type="button"
          className="form-button"
          onClick={handleImageAttach}
        >
          <MdAttachFile className="icon" />
        </button>
        <button
          type="button"
          className="form-button"
          onClick={() => setShowEmoji(!showEmoji)}
        >
          <GrEmoji className="icon" />
        </button>
        {selectedFile && (
          <div className="image-preview-container">
            {imageData && (
              <div className="image-preview">
                <img src={imageData} alt={selectedFile.name} />
                <button type="button" onClick={cancelImage}>
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
        {correctFile === false && (
          <div
            className="wrong-file"
            onClick={() => {
              cancelImage();
              setCorrectFile(true);
            }}
          >
            <p>Wrong file or size too large</p>
          </div>
        )}
        <TextareaAutosize
          value={formValue}
          onChange={handleTextArea}
          placeholder="Write a message..."
          maxRows={3}
          ref={textAreaRef}
        />
        {loading ? (
          <div>
            <div className="loader"></div>
          </div>
        ) : (
          <button type="submit" className="form-button">
            <AiOutlineSend className="icon" />
          </button>
        )}
      </form>
      <div className={showEmoji ? "emoji-container active" : "emoji-container"}>
        <NimblePicker
          set="google"
          data={data}
          className="emoji"
          showSkinTones={false}
          showPreview={false}
          sheetSize={16}
          onClick={addEmoji}
        />
      </div>
    </div>
  );
};

export default ChatRoomForm;
