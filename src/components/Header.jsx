import React from "react";
import { useLoginApi } from "../context/LoginContext";
import { Link, useNavigate } from "react-router-dom";
import User from "./User";
import Button from "./ui/Button";

export default function Header() {
  const { user, login, logout } = useLoginApi();
  const navigate = useNavigate();

  return (
    <header className='flex justify-between border-b border-gray-300 p-2 items-center'>
      <Link to='/' className='flex items-center text-4xl'>
        <h1>Shoppy</h1>
      </Link>
      <nav className='flex items-center gap-4 font-semibold'>
        <Button text='Products' onClick={() => navigate("/products")} />

        {user ? (
          <>
            <Button text='Cart' onClick={() => navigate("/cart")} />
            {user.isAdmin && (
              <Button
                onClick={() => navigate("/products/new")}
                text='Add Product'
              />
            )}
            <Button
              onClick={async () => {
                await logout();
              }}
              text='Logout'
            />
          </>
        ) : (
          <Button onClick={login} text='Login' />
        )}
        {user && <User user={user} />}
      </nav>
    </header>
  );
}
