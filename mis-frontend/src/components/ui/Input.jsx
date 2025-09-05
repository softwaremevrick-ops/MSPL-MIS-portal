import React from 'react';

const Input = ({ value, onChange, name, ...props }) => {
  return (
    <input
      value={value}
      onChange={onChange}
      name={name}
      {...props}
    />
  );
};

export default Input;