import React from 'react';

const ErrorBox = ({ message }) => {
  return <h2 style={{ backgroundColor: 'red' }}>{String(message)}</h2>;
};

export default ErrorBox;
