import React, { useEffect, useMemo, useState } from "react";
import {
  deleteCartItem,
  getCart,
  getProducts,
  updateCartQuantity,
} from "../api/firebase";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useLoginApi } from "../context/LoginContext";

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useLoginApi();
  const { data: cartItems } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(user.uid),
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  const [items, setItems] = useState();
  useEffect(() => {
    if (cartItems && products) {
      console.log(cartItems);
      setItems(
        cartItems?.map((item) => ({
          ...item,
          ...products?.find((product) => product.id === item.id),
        }))
      );
    }
  }, [cartItems, products]);

  const mutation = useMutation({
    mutationFn: ({ id, newQuantity }) =>
      updateCartQuantity(user.uid, id, newQuantity),
  });

  const handleOptionChange = (e, item) => {
    const newQuantity = parseInt(e.target.value, 10);
    setItems((prevItems) =>
      prevItems.map((prevItem) => {
        if (prevItem.id === item.id) {
          if (newQuantity >= 1) {
            return { ...prevItem, quantity: newQuantity }; // 선택된 항목의 수량을 업데이트
          }
        }
        return prevItem;
      })
    );
  };

  const handleUpdateCart = async () => {
    await Promise.all(
      items.map((item) => {
        mutation.mutate({ id: item.id, newQuantity: item.quantity });
      })
    );
    alert("수량이 변경되었습니다.");
  };

  const handleDeleteCart = (id) => {
    if (id) {
      const confirmDelete = window.confirm("선택한 항목을 삭제하시겠습니까?");
      confirmDelete &&
        setItems((prev) => prev.filter((item) => item.id !== id));
      deleteCartItem(id);
    } else {
      const confirmAllDelete = window.confirm("모든 항목을 삭제하시겠습니까?");
      confirmAllDelete && setItems([]);
      deleteCartItem();
    }
  };

  const totalPrice = useMemo(() => {
    return items?.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [items]);

  return (
    <div className='w-full p-4 max-w-screen-lg mx-auto'>
      <div className='flex justify-center p-4 mb-4'>
        <p className='font-bold text-xl border-black border-b-2 text-center w-[10%] '>
          Cart
        </p>
      </div>
      <table className='w-full border-black border-collapse'>
        <thead>
          <tr>
            <th className='p-2'>이미지</th>
            <th className='p-2'>상품 정보</th>
            <th className='p-2'>판매가</th>
            <th className='p-2'>수량</th>
            <th className='p-2'>배송 구분</th>
            <th className='p-2'>배송비</th>
            <th className='p-2'>합계</th>
            <th className='p-2'>선택</th>
          </tr>
        </thead>
        <tbody className='h-24 text-center'>
          {items && items.length > 0 ? (
            items.map((product) => (
              <tr key={product.id}>
                <td className='p-2 border-b-2'>
                  <img
                    src={product.img_url}
                    alt={product.name}
                    className='w-[100px] object-cover cursor-pointer m-auto'
                    onClick={() =>
                      navigate(`/products/detail/${product.id}`, {
                        state: { product },
                      })
                    }
                  />
                </td>
                <td className='p-2'>
                  <div>
                    <span className='block font-semibold'>{product.name}</span>
                    <span className='block text-gray-600'>
                      {product.color} / {product.size}
                    </span>
                  </div>
                </td>
                <td className='p-2 font-semibold'>{product.price}</td>
                <td>
                  <div className='p-2 flex flex-col items-center justify-center w-full h-full'>
                    <input
                      type='number'
                      value={product.quantity}
                      className='border w-12 text-center mb-1'
                      onChange={(e) => handleOptionChange(e, product)}
                    />
                    <button
                      className='text-sm text-gray-500'
                      onClick={handleUpdateCart}
                    >
                      변경
                    </button>
                  </div>
                </td>
                <td className='p-2 text-gray-600'>기본배송</td>
                <td className='p-2 text-gray-600'>
                  {totalPrice < 100000 ? (
                    <>
                      KRW 2,500 <br /> 조건
                    </>
                  ) : (
                    "무료"
                  )}
                </td>
                <td className='p-2 font-semibold'>KRW {product.total}</td>
                <td className='p-2 '>
                  <div className='flex flex-col'>
                    <button className='bg-black text-white p-2 rounded'>
                      주문하기
                    </button>
                    <button
                      className='border border-gray-300 mt-1 text-sm text-gray-500 p-2 rounded'
                      onClick={() => handleDeleteCart(product.id)}
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='8' className='py-8'>
                <div className='flex items-center justify-center w-full text-gray-500 text-center'>
                  장바구니가 비어있습니다.
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className='mt-4 text-right font-semibold'>
        <p>상품 구매금액: KRW {totalPrice}</p>
        <p>{`배송비: ${totalPrice >= 100000 ? "0 (무료)" : 2500}`}</p>
        <p>합계: KRW {totalPrice}</p>
      </div>
      <div className='mt-4 flex justify-end gap-2'>
        <button className='border p-2' onClick={() => handleDeleteCart()}>
          장바구니 비우기
        </button>
      </div>
    </div>
  );
}
