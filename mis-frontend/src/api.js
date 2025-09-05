import { toast } from "react-toastify";

export const handleSuccess = (message) => {
  toast.success(message, {
    position: "top-right",
  });
};

export const handleError = (message) => {
  toast.error(message, {
    position: "top-right",
  });
};

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api";