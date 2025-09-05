import PropTypes from 'prop-types';

const Badge = ({ text, color, style }) => {
    const badgeStyle = {
        backgroundColor: color || 'gray',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '12px',
        display: 'inline-block',
        ...style,
    };

    return <span style={badgeStyle}>{text}</span>;
};

Badge.propTypes = {
    text: PropTypes.string.isRequired,
    color: PropTypes.string,
    style: PropTypes.object,
};

export default Badge;