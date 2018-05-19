import React from 'react';
import AuctionItem from '../items/auctionItem.js';

const AuctionList = ({ items, onView = null }) => (
  <div>
    {items.map(item => (
      <AuctionItem key={item.id} onView={onView} data={item} />
    ))}
  </div>
);

export default AuctionList;
