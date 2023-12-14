import React, { useState } from "react";
import "./ImageItem.css";

const ImageItem = ({ onImageChange, uniqueKey, onDelete }) => {
  const localStorageKey = `imageItem_${uniqueKey}`;
  const [imagePreview, setImagePreview] = useState(() => {
    const storedImagePreview = localStorage.getItem(
      `${localStorageKey}_preview`
    );
    return storedImagePreview || "";
  }); // Etat pour stocker la valeur de l'image
  const [imageSize, setImageSize] = useState(() => {
    const storedImageSize = localStorage.getItem(`${localStorageKey}_size`);
    return storedImageSize ? parseInt(storedImageSize) : 100;
  }); // Etat pour stocker la valeur de la taille
  const [imageX, setImageX] = useState(() => {
    const storedImageX = localStorage.getItem(`${localStorageKey}_x`);
    return storedImageX ? parseInt(storedImageX) : 0;
  }); // Etat pour stocker la valeur de la position X
  const [imageY, setImageY] = useState(() => {
    const storedImageY = localStorage.getItem(`${localStorageKey}_y`);
    return storedImageY ? parseInt(storedImageY) : 0;
  }); // Etat pour stocker la valeur de la position Y
  const [showParameters, setShowParameters] = useState(true); // Etat pour stocker la valeur de la visibilité des paramètres

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const preview = e.target.result;
        setImagePreview(preview);
        onImageChange({
          imagePreview: preview,
          imageSize,
          imageX,
          imageY,
        });
        localStorage.setItem(`${localStorageKey}_preview`, preview);
      };

      reader.readAsDataURL(file);
    } else {
      setImagePreview("");
      onImageChange({
        imagePreview: "",
        imageSize,
        imageX,
        imageY,
      });
      localStorage.setItem(`${localStorageKey}_preview`, "");
    }
  }; // Fonction pour gérer le changement de l'image

  const handlePositionXChange = (value) => {
    const newX = parseInt(value);
    setImageX(newX);
    onImageChange({
      imagePreview,
      imageSize,
      imageX: newX,
      imageY,
    });
    localStorage.setItem(`${localStorageKey}_x`, newX.toString());
  }; // Fonction pour mettre à jour la valeur de la position X

  const handlePositionYChange = (value) => {
    const newY = parseInt(value);
    setImageY(newY);
    onImageChange({
      imagePreview,
      imageSize,
      imageX,
      imageY: newY,
    });
    localStorage.setItem(`${localStorageKey}_y`, newY.toString());
  }; // Fonction pour mettre à jour la valeur de la position Y

  const handleSizeChange = (value) => {
    const newSize = parseInt(value);
    setImageSize(newSize);
    onImageChange({
      imagePreview,
      imageSize: newSize,
      imageX,
      imageY,
    });
    localStorage.setItem(`${localStorageKey}_size`, newSize.toString());
  }; // Fonction pour mettre à jour la valeur de la taille

  const handleDelete = () => {
    onDelete(uniqueKey);
  }; // Fonction pour supprimer l'element

  const toggleParametersVisibility = () => {
    setShowParameters((prevShowParameters) => !prevShowParameters);
  }; // Fonction pour afficher ou masquer les paramètres

  return (
    <div className="image">
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
      <div className={`image-option${showParameters ? "-visible" : "-hidden"}`}>
        <div className="image-option-item">
          <span>Taille (%)</span>
          <input
            name="ImageSize"
            type="number"
            value={imageSize}
            onChange={(e) => handleSizeChange(e.target.value)}
          />
        </div>
        <div className="image-option-item">
          <span>Position (mm)</span>
          <div className="image-option-item-dual">
            <input
              name="ImageX"
              type="number"
              value={imageX}
              onChange={(e) =>
                handlePositionXChange(e.target.value, setImageX, "imageX")
              }
            />
            <input
              name="ImageY"
              type="number"
              value={imageY}
              onChange={(e) =>
                handlePositionYChange(e.target.value, setImageY, "imageY")
              }
            />
          </div>
        </div>
        <div className="image-option-item">
          <input
            type="file"
            className="custom-file-input"
            onChange={handleImageChange}
          />
        </div>
      </div>

      <div className="image-preview">
        {imagePreview ? (
          <img className="image-preview-item" src={imagePreview} alt="Aperçu" />
        ) : (
          <svg height="32" viewBox="0 0 32 32" width="32" className="noimage">
            <svg height="32" viewBox="0 0 32 32" width="32" className="noimage">
              <path d="M30 3.4141L28.5859 2 2 28.5859l1.4141 1.4141 2-2h20.5859a2.0027 2.0027 0 0 0 2-2v-20.5859zm-4 22.5859h-18.5859l7.7929-7.793 2.3788 2.3787a2 2 0 0 0 2.8284 0l1.5858-1.5857 4 3.9973zm0-5.8318-2.5858-2.5859a2 2 0 0 0 -2.8284 0l-1.5858 1.5859-2.377-2.3771 9.377-9.377z" />
              <path d="M6 22v-3l5-4.9966 1.3733 1.3733 1.4159-1.416-1.375-1.375a2 2 0 0 0 -2.8284 0l-3.5858 3.5859v-10.1716h16v-2h-16a2.002 2.002 0 0 0 -2 2v16z" />
              <path d="M0 0h32v32h-32z" fill="none" />
            </svg>
          </svg>
        )}
      </div>
    </div>
  );
};

export default ImageItem;
