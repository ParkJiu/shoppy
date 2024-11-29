import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { setAddToCart } from "../api/firebase";
import { useLoginApi } from "../context/LoginContext";

export default function ProductDetail() {
  const navigate = useNavigate();
  const { user } = useLoginApi();
  const {
    state: { product },
  } = useLocation();
  const [cart, setCart] = useState({
    id: product.id,
    userId: user ? user.uid : "",
    name: product.name,
    quantity: 1,
    size: "",
    color: "",
  });
  const sizes = product.sizes.map((size) => size.trim());

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setCart((prevItem) => ({ ...prevItem, [name]: value }));
  };
  const handleAddToCart = () => {
    if (!cart.size) {
      alert("옵션을 선택해 주세요");
      return;
    }
    if (!user) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }
    setAddToCart(user.uid, cart).then(() => {
      const confirm = window.confirm(
        "장바구니에 추가되었습니다. \n장바구니로 이동하시겠습니까?"
      );
      confirm && navigate("/cart");
    });
    setCart({ id: product.id, size: "", color: "" });
  };

  const handleQuantity = (e) => {
    const newQuantity = parseInt(e.target.value, 10);

    if (newQuantity >= 1) {
      setCart((prev) => ({
        ...prev,
        quantity: newQuantity,
      }));
    } else {
      setCart((prev) => ({
        ...prev,
        quantity: 1,
      }));
    }
  };
  return (
    <div>
      <ProductCard product={product} />
      <label>
        사이즈
        <select
          name='size'
          id='size'
          value={cart.size}
          onChange={handleOptionChange}
          className='border border-gray-300'
        >
          <option value='' disabled>
            옵션을 선택해 주세요
          </option>
          {sizes.map((size) => (
            <option value={size} key={size}>
              {size}
            </option>
          ))}
        </select>
      </label>
      <label>
        색상
        <select
          name='color'
          id='color'
          value={cart.color}
          className='border border-gray-300'
          onChange={handleOptionChange}
        >
          <option value='' disabled>
            옵션을 선택해 주세요
          </option>
          <option value={product.color}>{product.color}</option>
        </select>
      </label>
      <label>
        <input
          type='number'
          value={cart.quantity}
          className='border w-12 text-center'
          onChange={(e) => handleQuantity(e)}
        ></input>
      </label>
      <button
        className='w-36 border border-gray-300 ml-4'
        onClick={handleAddToCart}
      >
        Add cart
      </button>
      <button className='w-36 border border-gray-300 ml-4'>Buy now</button>
    </div>
  );
}
