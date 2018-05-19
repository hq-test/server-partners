import React from 'react';

const AuctionItem = ({ data, onView }) => (
  <div>
    <h1>{data.title}</h1>
    <img
      height="100"
      src={
        (data.room && data.room.mainImageUri) ||
        'http://mp3aux.com/assets/images/empty.png'
      }
      alt={
        (data.room && data.room.mainImageUri) ||
        'http://mp3aux.com/assets/images/empty.png'
      }
    />
    <h3>{data.room && data.room.title}</h3>
    <h3>{data.minimumAllowedBid} BHT</h3>
  </div>
);

export default AuctionItem;
