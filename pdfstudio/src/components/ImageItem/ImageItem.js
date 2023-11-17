import React, { useState } from "react";
import "./ImageItem.css";

const ImageItem = ({ onImageChange }) => {
  const [imagePreview, setImagePreview] = useState(""); // État pour stocker la source de l'image
  const [imageSize, setImageSize] = useState(0); // État pour stocker la taille de l'image
  const [imageX, setImageX] = useState(0); // État pour stocker la position X de l'image
  const [imageY, setImageY] = useState(0); // État pour stocker la position Y de l'image

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
    }
  };

  const handleImageSizeChange = (event) => {
    const size = parseInt(event.target.value);
    setImageSize(size);
    onImageChange({
      imageSize: size,
      imagePreview,
      imageX,
      imageY,
    });
  };

  const handleImageXChange = (event) => {
    const positionX = parseInt(event.target.value);
    setImageX(positionX);
    onImageChange({
      imageX: positionX,
      imagePreview,
      imageSize,
      imageY,
    });
  };

  const handleImageYChange = (event) => {
    const positionY = parseInt(event.target.value);
    setImageY(positionY);
    onImageChange({
      imageY: positionY,
      imagePreview,
      imageSize,
      imageX,
    });
  };

  return (
    <div className="image">
      <div className="image-option">
        <div className="image-option-item">
          <span>Taille (%)</span>
          <input
            name="ImageSize"
            type="number"
            value={imageSize}
            onChange={handleImageSizeChange}
          />
        </div>
        <div className="image-option-item"></div>
        <div className="image-option-item">
          <span>Position (mm)</span>
          <div className="image-option-item-position">
            <input
              name="ImageX"
              type="number"
              value={imageX}
              onChange={handleImageXChange}
            />
            <input
              name="ImageY"
              type="number"
              value={imageY}
              onChange={handleImageYChange}
            />
          </div>
        </div>
        <div className="image-option-item">
          <span>Image </span>
          <input type="file" onChange={handleImageChange} />
        </div>
      </div>

      <div className="image-preview">
        {imagePreview ? (
          <img src={imagePreview} alt="Aperçu" />
        ) : (
          <svg height="32" viewBox="0 0 32 32" width="32" className="noimage">
            <path d="M30 3.4141L28.5859 2 2 28.5859l1.4141 1.4141 2-2h20.5859a2.0027 2.0027 0 0 0 2-2v-20.5859zm-4 22.5859h-18.5859l7.7929-7.793 2.3788 2.3787a2 2 0 0 0 2.8284 0l1.5858-1.5857 4 3.9973zm0-5.8318-2.5858-2.5859a2 2 0 0 0 -2.8284 0l-1.5858 1.5859-2.377-2.3771 9.377-9.377z" />
            <path d="M6 22v-3l5-4.9966 1.3733 1.3733 1.4159-1.416-1.375-1.375a2 2 0 0 0 -2.8284 0l-3.5858 3.5859v-10.1716h16v-2h-16a2.002 2.002 0 0 0 -2 2v16z" />
            <path d="M0 0h32v32h-32z" fill="none" />
          </svg>
        )}
      </div>
    </div>
  );
};

export default ImageItem;
