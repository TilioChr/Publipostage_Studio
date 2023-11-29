import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

import "./TextItem.css";

function TextItem({ onTextChange, csvColumn }) {
  const [textX, setTextX] = useState(10); // Etat pour stocker la valeur de la position X
  const [textY, setTextY] = useState(10); // Etat pour stocker la valeur de la position Y
  const [textLargeur, setTextLargeur] = useState(210); // Etat pour stocker la valeur de la largeur
  const [textValeur, setTextValeur] = useState("Write here..."); // Etat pour stocker la valeur du texte
  const [textStyle, setTextStyle] = useState(false); // Etat pour stocker la valeur du style

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
      textStyle,
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
      textStyle,
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
      textStyle,
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
      textStyle,
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
      textStyle,
    });
  }; // Fonction pour mettre à jour la valeur du texte

  const handleTextStyleChange = (event) => {
    const textStyle = event.target.checked;
    setTextStyle(textStyle);
    onTextChange({
      textX,
      textY,
      textLargeur,
      textValeur,
      textStyle: textStyle,
    });
  }; // Fonction pour mettre à jour la valeur du style

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
        <div className="text-option-item">
          <span>Style (slower)</span>
          <input
            type="checkbox"
            onChange={handleTextStyleChange}
            value={textStyle}
            name="textStyle"
          ></input>
        </div>
      </div>
      <div className="text-editor">
        <Editor
          apiKey="jj2151nw7rk0ng0umtf8ofo3dvblxd5bqym5gxcv7x5ujig5"
          init={{
            toolbar:
              "undo redo | formatselect | bold italic underline | backcolor forecolor | fontfamily fontsizeinput lineheight | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
            plugins: [
              "autoresize",
              "wordcount",
              "lists",
              "insertdatetime",
              "table",
              "help",
            ],
            resize: true,
            line_height_formats:
              "0em 0.1em 0.2em 0.3em 0.4em 0.5em 0.6em 0.7em 0.8em 0.9em 1em 1.2em 1.5em 1.8em 2em",
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
                  onDragStart={(e) => handleDragStart(e, "|" + item + "|")}
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
