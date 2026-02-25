import React from 'react';

const Input = ({ type = 'text', placeholder, ...props }) => {
    return (
        <div className="input-group">
            <input
                type={type}
                className="input-field"
                placeholder={placeholder}
                {...props}
            />
        </div>
    );
};

export default Input;
