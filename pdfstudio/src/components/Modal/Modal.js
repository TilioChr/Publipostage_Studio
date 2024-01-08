import React from "react";
import ButtonCustom from "../ButtonCustom/ButtonCustom";
import "./Modal.css";

function Modal({ showModal, setShowModal, buttonText, children }) {
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div>
      <ButtonCustom onClick={toggleModal}>{buttonText}</ButtonCustom>
      <div className={`modal ${showModal ? "active" : ""}`}>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
