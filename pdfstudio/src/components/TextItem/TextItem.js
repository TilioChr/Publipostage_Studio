import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import "./TextItem.css";

function TextItem({
  onTextChange,
  csvColumn,
  uniqueKey,
  onDelete,
  textXImport,
  textYImport,
  textLargeurImport,
  textValeurImport,
}) {
  const localStorageKey = `textItem_${uniqueKey}`;

  const [textX, setTextX] = useState(() => {
    const storedTextX = localStorage.getItem(`${localStorageKey}_x`);
    return parseInt(storedTextX) || textXImport || 10;
  }); // Etat pour stocker la valeur de la position X
  const [textY, setTextY] = useState(() => {
    const storedTextY = localStorage.getItem(`${localStorageKey}_y`);
    return parseInt(storedTextY) || textYImport || 10;
  }); // Etat pour stocker la valeur de la position Y
  const [textLargeur, setTextLargeur] = useState(() => {
    const storedTextLargeur = localStorage.getItem(
      `${localStorageKey}_largeur`
    );
    return parseInt(storedTextLargeur) || textLargeurImport || 100;
  }); // Etat pour stocker la valeur de la largeur
  const [textValeur, setTextValeur] = useState(() => {
    const storedTextValeur = localStorage.getItem(`${localStorageKey}_valeur`);
    return storedTextValeur || textValeurImport || "";
  }); // Etat pour stocker la valeur du texte
  const [modalText, setModalText] = useState(() => {
    const storedTextValeur = localStorage.getItem(`${localStorageKey}_valeur`);
    if (storedTextValeur !== null) {
      const textPreview = storedTextValeur.replace(/<[^>]+>/g, "");
      return textPreview;
    } else {
      return storedTextValeur || "";
    }
  }); // Etat pour stocker la valeur du texte de l'éditeur
  const [showParameters, setShowParameters] = useState(() => {
    const storedShowParameters = localStorage.getItem(
      `${localStorageKey}_showParameters`
    );
    return storedShowParameters ? JSON.parse(storedShowParameters) : true;
  }); // Etat pour stocker la valeur de l'affichage des paramètres

  const handleTextXChange = (value) => {
    const newX = parseInt(value);
    setTextX(newX);
    onTextChange({
      textX: newX,
      textY,
      textLargeur,
      textValeur,
    });
    localStorage.setItem(`${localStorageKey}_x`, newX);
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
    localStorage.setItem(`${localStorageKey}_y`, textY);
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
    localStorage.setItem(`${localStorageKey}_largeur`, textLargeur);
  }; // Fonction pour mettre à jour la valeur de la largeur

  const handleTextValeurChange = (content) => {
    const textValeur = content;
    setTextValeur(textValeur);
    const textPreview = textValeur.replace(/<[^>]+>/g, "");
    setModalText(textPreview); // Mettre à jour l'état modalText avec le texte de l'éditeur
    onTextChange({
      textX,
      textY,
      textLargeur,
      textValeur: textValeur,
    });
    localStorage.setItem(`${localStorageKey}_valeur`, textValeur);
  }; // Fonction pour mettre à jour la valeur du texte

  //#region Drag and drop
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
  //#endregion

  //#region Modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
    console.log("open");
    console.log(isModalOpen);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  //#endregion

  useEffect(() => {
    setTextValeur(textValeurImport || "");
    const textPreview = (textValeurImport || "").replace(/<[^>]+>/g, "");
    setModalText(textPreview);
  }, [textValeurImport]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = () => {
    onDelete(uniqueKey);
  }; // Fonction pour supprimer l'element

  const toggleParametersVisibility = () => {
    const newShowParameters = !showParameters;
    setShowParameters(newShowParameters);
    localStorage.setItem(
      `${localStorageKey}_showParameters`,
      JSON.stringify(newShowParameters)
    );
  }; // Fonction pour afficher ou cacher les paramètres

  return (
    <div className="text">
      <div className="top">
        <div
          className="hidden-show-button"
          onClick={toggleParametersVisibility}
        >
          {showParameters ? (
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="m0 0h24v24h-24z" fill="#fff" opacity="0" />
              <g fill="#231f20">
                <path d="m21.87 11.5c-.64-1.11-4.16-6.68-10.14-6.5-5.53.14-8.73 5-9.6 6.5a1 1 0 0 0 0 1c.63 1.09 4 6.5 9.89 6.5h.25c5.53-.14 8.74-5 9.6-6.5a1 1 0 0 0 0-1zm-9.65 5.5c-4.31.1-7.12-3.59-8-5 1-1.61 3.61-4.9 7.61-5 4.29-.11 7.11 3.59 8 5-1.03 1.61-3.61 4.9-7.61 5z" />
                <path d="m12 8.5a3.5 3.5 0 1 0 3.5 3.5 3.5 3.5 0 0 0 -3.5-3.5zm0 5a1.5 1.5 0 1 1 1.5-1.5 1.5 1.5 0 0 1 -1.5 1.5z" />
              </g>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="m0 0h24v24h-24z" fill="#fff" opacity="0" />
              <g fill="#231f20">
                <path d="m4.71 3.29a1 1 0 0 0 -1.42 1.42l5.63 5.63a3.5 3.5 0 0 0 4.74 4.74l5.63 5.63a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42zm7.29 10.21a1.5 1.5 0 0 1 -1.5-1.5s0-.05 0-.07l1.56 1.56z" />
                <path d="m12.22 17c-4.3.1-7.12-3.59-8-5a13.7 13.7 0 0 1 2.24-2.72l-1.46-1.41a15.89 15.89 0 0 0 -2.87 3.63 1 1 0 0 0 0 1c.63 1.09 4 6.5 9.89 6.5h.25a9.48 9.48 0 0 0 3.23-.67l-1.58-1.58a7.74 7.74 0 0 1 -1.7.25z" />
                <path d="m21.87 11.5c-.64-1.11-4.17-6.68-10.14-6.5a9.48 9.48 0 0 0 -3.23.67l1.58 1.58a7.74 7.74 0 0 1 1.7-.25c4.29-.11 7.11 3.59 8 5a13.7 13.7 0 0 1 -2.29 2.72l1.51 1.41a15.89 15.89 0 0 0 2.91-3.63 1 1 0 0 0 -.04-1z" />
              </g>
            </svg>
          )}
        </div>
        <div className="delete-button" onClick={handleDelete}>
          <svg
            viewBox="0 0 512 512"
            width="512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m289.94 256 95-95a24 24 0 0 0 -33.94-34l-95 95-95-95a24 24 0 0 0 -34 34l95 95-95 95a24 24 0 1 0 34 34l95-95 95 95a24 24 0 0 0 34-34z" />
          </svg>
        </div>
      </div>
      <div className={`text-option${showParameters ? "-visible" : "-hidden"}`}>
        <div className="text-option-item">
          <span>Position X</span>
          <input
            name="TextX"
            type="number"
            value={textX}
            onChange={(e) =>
              handleTextXChange(e.target.value, setTextX, "textX")
            }
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
      <div className="text-value-item">
        <div className="text-option-item">
          <span>Texte</span>
          <div className="text-option-item-input">
            <input
              className="custom-input"
              type="text"
              onChange={handleTextValeurChange}
              value={modalText}
              name="TextValeur"
              readOnly
            ></input>
            <div className="expand">
              <div className="expand-icon" onClick={handleOpenModal}>
                <svg
                  fill="#000000"
                  version="1.1"
                  id="Capa_1"
                  viewBox="-46.9 -46.9 562.80 562.80"
                  stroke="#000000"
                  stroke-width="9.849"
                  transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke="#CCCCCC"
                    stroke-width="8.442"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <g>
                      {" "}
                      <g>
                        {" "}
                        <path d="M455.5,0h-442C6,0,0,6,0,13.5v211.9c0,7.5,6,13.5,13.5,13.5s13.5-6,13.5-13.5V27h415v415H242.4c-7.5,0-13.5,6-13.5,13.5 s6,13.5,13.5,13.5h213.1c7.5,0,13.5-6,13.5-13.5v-442C469,6,463,0,455.5,0z"></path>{" "}
                        <path d="M175.6,279.9H13.5c-7.5,0-13.5,6-13.5,13.5v162.1C0,463,6,469,13.5,469h162.1c7.5,0,13.5-6,13.5-13.5V293.4 C189.1,286,183,279.9,175.6,279.9z M162.1,442H27V306.9h135.1V442z"></path>{" "}
                        <path d="M360.4,127.7v71.5c0,7.5,6,13.5,13.5,13.5s13.5-6,13.5-13.5V95.1c0-7.5-6-13.5-13.5-13.5H269.8c-7.5,0-13.5,6-13.5,13.5 s6,13.5,13.5,13.5h71.5L212.5,237.4c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4L360.4,127.7z"></path>{" "}
                      </g>{" "}
                    </g>{" "}
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="editeur-modal">
          <div className="editeur-modal-wrapper">
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
                placeholder: "Write your text here...",
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
                {!csvColumn ||
                  (!csvColumn[0] && <div>No CSV column found</div>)}
              </div>
            </div>
          </div>

          <button onClick={handleCloseModal}>Valider</button>
        </div>
      )}
    </div>
  );
}

export default TextItem;
