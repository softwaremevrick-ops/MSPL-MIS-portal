const Select = ({ options = [], value, onChange, label, ...props }) => {
    return (
        <div>
            {label && <label>{label}</label>}
            <select value={value} onChange={onChange} {...props}>
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

const SelectItem = ({ children, value, ...props }) => {
    return (
        <option value={value} {...props}>
            {children}
        </option>
    );
};

const SelectTrigger = ({ children, ...props }) => {
    return (
        <div {...props}>
            {children}
        </div>
    );
};

const SelectValue = ({ placeholder, value, ...props }) => {
    return (
        <span {...props}>
            {value || placeholder}
        </span>
    );
};

const SelectContent = ({ children, ...props }) => {
    return (
        <div {...props}>
            {children}
        </div>
    );
};                          

export { SelectItem, SelectTrigger, SelectValue, SelectContent };

export default Select;