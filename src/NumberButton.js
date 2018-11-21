import React from "react";

const NumberButton = ({ numObj, onClick }) => (
  <button id={numObj.id} val={numObj.val} className="number" onClick={onClick}>
    {numObj.symbol}
  </button>
);

export default NumberButton;
