import toast, { ToastOptions } from 'react-hot-toast';

const defaultOptions: ToastOptions = {
  duration: 4000,
  style: {
    background: '#fff',
    color: '#333',
    padding: '16px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
  },
};

const customToast = {
  success: (message: string, options?: ToastOptions) => {
    return toast.success(message, {
      ...defaultOptions,
      style: {
        ...defaultOptions.style,
        border: `2px solid #6B7FE3`,
      },
      ...options,
    });
  },
  error: (message: string, options?: ToastOptions) => {
    return toast.error(message, {
      ...defaultOptions,
      style: {
        ...defaultOptions.style,
        border: `2px solid #FF7EB6`,
      },
      ...options,
    });
  },
  info: (message: string, options?: ToastOptions) => {
    return toast(message, {
      ...defaultOptions,
      style: {
        ...defaultOptions.style,
        border: `2px solid #A78BFA`,
      },
      ...options,
    });
  },
};

export default customToast;
