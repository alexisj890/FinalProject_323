import React from 'react';
import { Link } from 'react-router-dom';

function ItemCard({ item }) {
  const { _id, title, price, imageUrl, description } = item;

  return (
    <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-gray-600 truncate">{description}</p>
      <p className="text-blue-500 font-semibold mt-2">${price}</p>
      <Link
        to={'/items/${_id}/comments'}
        className="text-blue-500 hover:underline mt-4 inline-block"
      >
        View Comments
      </Link>
    </div>
  );
}

export default ItemCard;
