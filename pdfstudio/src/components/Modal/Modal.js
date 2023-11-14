import React, { useState } from "react";
import ButtonCustom from "../ButtonCustom/ButtonCustom";
import "./Modal.css";

function Modal(props) {
  const [showModal, setShowModal] = useState(false);

  function toggleModal() {
    setShowModal(!showModal);
  }

  return (
    <div>
      <ButtonCustom onClick={toggleModal}>{props.buttonText}</ButtonCustom>
      <div className={`modal ${showModal ? "active" : ""}`}>
        <div className="modal-content">{props.children}</div>
      </div>
    </div>
  );
}

export default Modal;
