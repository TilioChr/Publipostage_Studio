import React, { useState } from "react";
import "./ProjectItem.css";

function ProjectItem(props) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleLoadButtonClick = () => {
    props.onLoadButtonClick(props.projectName);
  };

  const handleDeleteButtonClick = () => {
    props.onDeleteButtonClick(props.projectName);
  };

  return (
    <div
      className={`wrapper ${isHovered ? "hovered" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="preview">
        <img src={props.projectImage} alt={`Project: ${props.projectName}`} />
        {isHovered && (
          <>
            <button className="loadButton" onClick={handleLoadButtonClick}>
              Load
            </button>
            <button className="deleteButton" onClick={handleDeleteButtonClick}>
              Delete
            </button>
          </>
        )}
      </div>
      <div>
        <span>{props.projectName}</span>
      </div>
    </div>
  );
}

export default ProjectItem;
