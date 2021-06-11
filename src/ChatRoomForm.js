import React, { useState } from "react";

import { AiOutlineSend } from "react-icons/ai";
import { MdAttachFile } from "react-icons/md";
import { TiDeleteOutline } from "react-icons/ti";
import TextareaAutosize from "react-textarea-autosize";

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

  const ALLOWED_SIZE = 10000000;
  const handleTextArea = (e) => {
    setFormValue(e.target.value);
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
    </div>
  );
};

export default ChatRoomForm;
