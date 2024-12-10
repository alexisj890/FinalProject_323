import React from 'react';
import { Link } from 'react-router-dom';

function ItemCard({ item }) {
  const { _id, title, price, imageUrl } = item;

  return (
    <div
      className="item-card"
      style={{
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '16px',
        margin: '8px', // Reduced margin
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <img
        src={imageUrl}
        alt={title}
        style={{
          width: '100%',
          height: '200px',
          objectFit: 'cover',
          borderRadius: '8px',
          marginBottom: '12px', // Reduced margin
        }}
      />
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '6px' }}>
        {title}
      </h3>
      <p
        style={{
          fontSize: '16px',
          color: '#007bff',
          fontWeight: '600',
          marginBottom: '8px', // Reduced margin
        }}
      >
        ${price}
      </p>
      <div
        style={{
          marginTop: 'auto',
        }}
      >
        <Link
          to={`/items/${_id}`}
          style={{
            display: 'block',
            color: '#007bff',
            textDecoration: 'none',
            fontWeight: '500',
            marginBottom: '6px', // Reduced spacing between links
          }}
          onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
          onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
        >
          View Details
        </Link>
        <Link
          to={`/items/${_id}/comments`}
          style={{
            display: 'block',
            color: '#007bff',
            textDecoration: 'none',
            fontWeight: '500',
          }}
          onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
          onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
        >
          View Comments
        </Link>
      </div>
    </div>
  );
}

export default ItemCard;
