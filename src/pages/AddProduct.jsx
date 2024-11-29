import React, { useState } from "react";
import { uploadImage } from "../api/cloudinary";
import { addNewProduct } from "../api/firebase";

export default function AddProduct() {
  const [product, setProduct] = useState({});
  const [imageFile, setImageFile] = useState(null); // 파일 선택 상태 관리

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setImageFile(files && files[0]);
      return;
    }
    setProduct((product) => ({ ...product, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = await uploadImage(imageFile);
      addNewProduct(product, url);
      setProduct({});
      setImageFile(null);
    } catch (error) {
      console.error("제품 등록 중 에러 발생:", error);
    }
  };

  return (
    <section>
      {imageFile && (
        <img src={URL.createObjectURL(imageFile)} alt='local file'></img>
      )}
      <form className='flex flex-col' onSubmit={handleSubmit}>
        <input
          type='file'
          onChange={handleChange}
          accept='image/*'
          name='file'
          required
          className='mb-4'
        />
        <input
          type='text'
          name='title'
          className='bg-slate-200 mb-4'
          value={product.title ?? ""}
          placeholder='제품명'
          onChange={handleChange}
          required
        />
        <input
          type='text'
          name='sizes'
          className='bg-slate-200 mb-4'
          value={product.sizes ?? ""}
          onChange={handleChange}
          placeholder='사이즈(콤마(,)로 구분)'
        />
        <input
          type='text'
          name='color'
          className='bg-slate-200 mb-4'
          value={product.color ?? ""}
          onChange={handleChange}
          placeholder='옵션(콤마(,)로 구분)'
        />
        <input
          type='text'
          name='category'
          className='bg-slate-200 mb-4'
          value={product.category ?? ""}
          onChange={handleChange}
          placeholder='카테고리'
        />
        <input
          type='text'
          name='price'
          className='bg-slate-200 mb-4'
          value={product.price ?? ""}
          onChange={handleChange}
          placeholder='Price'
        />
        <input
          type='text'
          name='gender'
          className='bg-slate-200 mb-4'
          value={product.gender ?? ""}
          onChange={handleChange}
          placeholder='Gender'
        />

        <button type='submit' className='bg-blue-500 text-white'>
          제품 등록하기
        </button>
      </form>
    </section>
  );
}
