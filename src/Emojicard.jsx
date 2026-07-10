import React from "react";

function EmojiCard({ emoji, id, handleClick }) {
  return (
    <div
      className="emoji-card"
      onClick={() => handleClick(id)}
      title="Click Me!"
    >
      <span>{emoji}</span>
    </div>
  );
}

export default EmojiCard;