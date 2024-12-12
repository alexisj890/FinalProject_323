import React from 'react';
import LiveBidItem from './BidItem';

const BiddingRoom = ({ items, currentUser }) => {
  return (
    <div className="bidding-room">
      <h2>Live Bidding Session</h2>
      <p>Participate in live bidding for these exclusive items:</p>
      <div className="bidding-room-items">
        {items.map((item) => (
          <LiveBidItem key={item.id} item={item} currentUser={currentUser} />
        ))}
      </div>
    </div>
  );
};

export default BiddingRoom;
