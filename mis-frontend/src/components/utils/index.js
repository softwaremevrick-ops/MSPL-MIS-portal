export const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
};

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

export const generateUniqueId = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
};

// Add this:
export const createPageUrl = (pageName) => `/${pageName}`;