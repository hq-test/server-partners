import React from 'react';

const AuctionItem = ({ data, onView }) => (
  <div>
    <h3>{data.title}</h3>
    <img height="100" src={data.mainImageUri} alt={data.mainImageUri} />
  </div>
);

export default AuctionItem;
