import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

import "./TextItem.css";

function TextItem({ onTextChange, csvColumn }) {
  const [textX, setTextX] = useState(0); // Etat pour stocker la valeur de la position X
  const [textY, setTextY] = useState(0); // Etat pour stocker la valeur de la position Y
  const [textLargeur, setTextLargeur] = useState(210); // Etat pour stocker la valeur de la largeur
  const [textValeur, setTextValeur] = useState("Write here..."); // Etat pour stocker la valeur du texte

  const handleDragStart = (event, columnName) => {
    event.dataTransfer.setData("text/plain", columnName);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const columnName = event.dataTransfer.getData("text/plain");
    const updatedText = `${textValeur} ${columnName}`;
    setTextValeur(updatedText);
    onTextChange({
      textX,
      textY,
      textLargeur,
      textValeur: updatedText,
    });
  };

  const handleTextXChange = (event) => {
    const textX = event.target.value;
    setTextX(textX);
    onTextChange({
      textX: textX,
      textY,
      textLargeur,
      textValeur,
    });
  }; // Fonction pour mettre à jour la valeur de la position X

  const handleTextYChange = (event) => {
    const textY = event.target.value;
    setTextY(textY);
    onTextChange({
      textX,
      textY: textY,
      textLargeur,
      textValeur,
    });
  }; // Fonction pour mettre à jour la valeur de la position Y

  const handleTextLargeurChange = (event) => {
    const textLargeur = event.target.value;
    setTextLargeur(textLargeur);
    onTextChange({
      textX,
      textY,
      textLargeur: textLargeur,
      textValeur,
    });
  }; // Fonction pour mettre à jour la valeur de la largeur

  const handleTextValeurChange = (content) => {
    const textValeur = content;
    setTextValeur(textValeur);
    onTextChange({
      textX,
      textY,
      textLargeur,
      textValeur: textValeur,
    });
  }; // Fonction pour mettre à jour la valeur du texte

  return (
    <div className="text">
      <div className="text-option">
        <div className="text-option-item">
          <span>Position X</span>
          <input
            type="number"
            onChange={handleTextXChange}
            value={textX}
            name="TextX"
          ></input>
        </div>
        <div className="text-option-item">
          <span>Position Y</span>
          <input
            type="number"
            onChange={handleTextYChange}
            value={textY}
            name="TextValeur"
          ></input>
        </div>
        <div className="text-option-item">
          <span>Largeur</span>
          <input
            type="number"
            onChange={handleTextLargeurChange}
            value={textLargeur}
            name="TextLargeur"
          ></input>
        </div>
      </div>
      <div className="text-editor">
        <Editor
          apiKey="jj2151nw7rk0ng0umtf8ofo3dvblxd5bqym5gxcv7x5ujig5"
          init={{
            toolbar:
              "undo redo | formatselect | bold italic underline | backcolor forecolor | fontfamily fontsizeinput | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
            plugins: [
              "autoresize",
              "wordcount",
              "emoticons",
              "lists",
              "insertdatetime",
              "table",
              "paste",
              "help",
            ],
            resize: true,
          }}
          value={textValeur}
          onEditorChange={handleTextValeurChange}
        />

        <div className="nameColumn">
          <div
            className="nameColumnContent"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {csvColumn &&
              csvColumn[0] &&
              csvColumn[0].map((item, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                >
                  {item}
                </div>
              ))}
            {!csvColumn || (!csvColumn[0] && <div>No CSV column found</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TextItem;