import React from 'react';

const Textarea = ({ value, onChange, placeholder, rows, cols, style }) => {
    return (
        <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            cols={cols}
            style={style}
        />
    );
};

export default Textarea;