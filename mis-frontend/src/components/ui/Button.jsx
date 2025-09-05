import React from 'react';

const Button = ({ type, onClick, style, disabled, className, children }) => {
    return (
        <button 
            type={type}
            onClick={onClick} 
            style={style} 
            disabled={disabled}
            className={className}
        >
            {children}
        </button>
    );
};

export default Button;