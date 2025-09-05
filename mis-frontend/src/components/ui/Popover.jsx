import PropTypes from 'prop-types';
import '../../css/Popover.css'; // Assuming you have some styles for the popover

const Popover = ({ content, isOpen, onClose, targetRef }) => {
    if (!isOpen) return null;

    const popoverStyle = {
        position: 'absolute',
        top: targetRef.current.getBoundingClientRect().bottom + window.scrollY,
        left: targetRef.current.getBoundingClientRect().left + window.scrollX,
        zIndex: 1000,
    };

    return (
        <div className="popover" style={popoverStyle}>
            <div className="popover-content">
                {content}
            </div>
            <button className="popover-close" onClick={onClose}>
                Close
            </button>
        </div>
    );
};

Popover.propTypes = {
    content: PropTypes.node.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    targetRef: PropTypes.shape({
        current: PropTypes.instanceOf(Element),
    }).isRequired,
};

export const PopoverTrigger = ({ children, onClick }) => {
    return (
        <button className="popover-trigger" onClick={onClick}>
            {children}
        </button>
    );
};

PopoverTrigger.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
};

export const PopoverContent = ({ children }) => {
    return <div className="popover-inner-content">{children}</div>;
};

PopoverContent.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Popover;