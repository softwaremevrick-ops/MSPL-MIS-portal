import React from 'react';

const Label = ({ text, htmlFor, style }) => {
    return (
        <label htmlFor={htmlFor} style={style}>
            {text}
        </label>
    );
};

export default Label;