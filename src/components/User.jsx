import React from "react";

export default function User({ user: { photoURL, displayName } }) {
  return (
    <>
      <button>
        <img
          width={30}
          className='rounded-full ml-2'
          src={photoURL}
          alt={displayName}
        />
      </button>
      <span className='hidden md:block'>{displayName}</span>
    </>
  );
}
