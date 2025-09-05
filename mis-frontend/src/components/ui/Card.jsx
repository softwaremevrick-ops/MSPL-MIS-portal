import PropTypes from 'prop-types';
import '../../css/Card.css'; // Assuming you have a CSS file for styling

const Card = ({ title, body, footer }) => {
    return (
        <div className="card">
            {title && <h2 className="card-title">{title}</h2>}
            {body && <div className="card-body">{body}</div>}
            {footer && <div className="card-footer">{footer}</div>}
        </div>
    );
};

Card.propTypes = {
    title: PropTypes.string,
    body: PropTypes.node,
    footer: PropTypes.node,
};

const CardContent = ({ children, className }) => {
    return <div className={`card-content ${className}`}>{children}</div>;
};

CardContent.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

const CardTitle = ({ children, className }) => {
    return <h3 className={`card-title ${className}`}>{children}</h3>;
};

CardTitle.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

const CardHeader = ({ children, className }) => {
    return <div className={`card-header ${className}`}>{children}</div>;
};

CardHeader.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};      

export { CardContent, CardTitle, CardHeader };

export default Card;