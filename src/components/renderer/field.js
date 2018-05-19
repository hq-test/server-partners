import React from 'react';
import * as moment from 'moment';

const FieldRenderer = ({ type, value, nested, nestedField }) => {
  switch (type) {
    case 'image':
      return (
        <span>
          <img height="100" src={value} alt={value} />
        </span>
      );

    case 'boolean':
      return <span>{value ? 'Yes' : 'No'}</span>;

    case 'datetime':
      return <span>{value ? moment(value).format('ll LTS') : '-'}</span>;

    case 'price':
      return <span>{value} BHT</span>;

    case 'string':
    default:
      return (
        <span>
          {nested
            ? value && value[nestedField]
              ? value[nestedField]
              : '-'
            : value}
        </span>
      );
  }
};

export default FieldRenderer;
