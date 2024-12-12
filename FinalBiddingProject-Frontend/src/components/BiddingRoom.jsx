import React from 'react';
import BidItem from './BidItem';

const BiddingRoom = ({ items, currentUser }) => {
  return (
    <div className="bidding-room">
      <h3>Available Items</h3>
      <div className="bidding-room-items">
        {items.map((item) => (
          <BidItem key={item.id} item={item} currentUser={currentUser} />
        ))}
      </div>
    </div>
  );
};

export default BiddingRoom;
