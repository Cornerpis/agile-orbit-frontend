import React from "react";
import { Button } from "antd";

const PrimaryButton = ({
  //Settting props for the button
  text,
  type,
  block,
  backgroundColor = "#000",
  textColor = "#fff",
}) => {
  return (
    <Button
      type={type}
      block={block}
      style={{
        height: "40px",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: "bold",
        backgroundColor: backgroundColor,
        color: textColor,
        border: "none",
      }}
    >
      {text}
    </Button>
  );
};

export default PrimaryButton;
