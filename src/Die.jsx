import React from "react";

export default function Die(props) {
  const styles = {
    backgroundColor: props.isHeld === true ? "#59E391" : "White",
  };
  return (
    <div className="die-face" style={styles} onClick={props.heldfunc}>
      <h2 className="die-num">{props.value}</h2>
    </div>
  );
}
