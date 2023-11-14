import React from "react";
import "./ButtonCustom.css";

function ButtonCustom(props) {
  return (
    <button className="buttonCustom" {...props}>
      {props.children}
    </button>
  );
}

export default ButtonCustom;
