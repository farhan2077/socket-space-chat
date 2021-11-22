import React, { useState, useEffect } from "react";

export default function Image(props) {
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    const reader = new FileReader();
    reader.readAsDataURL(props.blob);
    reader.onloadend = function () {
      setImageSrc(reader.result);
    };
  }, [props.blob]);

  return (
    <img
      style={{
        width: "250px",
        height: "auto",
        margin: "0 10px",
        border: "1px solid #1A202C",
        borderRadius: "10px",
      }}
      src={imageSrc}
      alt={props.fileName}
    />
  );
}
