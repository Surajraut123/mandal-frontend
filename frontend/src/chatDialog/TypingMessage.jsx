import React, { useEffect, useState } from "react";

const TypingMessage = ({ text = "", speed = 10 }) => {
  const safeText = String(text); // ✅ force string
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let currentIndex = 0;

    setDisplayedText(""); // reset on new text

    const interval = setInterval(() => {
      currentIndex++;

      setDisplayedText(safeText.slice(0, currentIndex));

      if (currentIndex >= safeText.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [safeText, speed]);

  return (
    <p style={{ whiteSpace: "pre-line", margin: 0 }}>
      {displayedText}
    </p>
  );
};

export default TypingMessage;
