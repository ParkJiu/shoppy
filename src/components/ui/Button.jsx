import React from "react";

export default function Button({ text, onClick }) {
  return (
    <button onClick={onClick} className='hover:text-gray-500'>
      {text}
    </button>
  );
}
