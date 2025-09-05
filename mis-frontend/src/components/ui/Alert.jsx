import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Alert = ({ message, type, onDismiss }) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleDismiss = () => {
        setIsVisible(false);
        if (onDismiss) {
            onDismiss();
        }
    };

    if (!isVisible) return null;

    const alertClass = `alert alert-${type}`;

    return (
        <div className={alertClass}>
            <span>{message}</span>
            <button onClick={handleDismiss} className="alert-dismiss-button">
                &times;
            </button>
        </div>
    );
};

Alert.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'error', 'info']).isRequired,
    onDismiss: PropTypes.func,
};

export const AlertDescription = ({ children }) => {
    return <div className="alert-description">{children}</div>;
};

export default Alert;