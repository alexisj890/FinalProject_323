import React from 'react';
import { Link } from 'react-router-dom';

function ProductCart({ product }) {
  const { _id, title, price, imageUrl, description } = product;

  return (
    <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <Link to={`/items/${_id}`}>
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-60 object-cover rounded-md mb-4"
        />
      </Link>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-gray-600 truncate">{description}</p>
      <p className="text-blue-500 font-semibold mt-2">${price}</p>
    </div>
  );
}

export default ProductCart;
