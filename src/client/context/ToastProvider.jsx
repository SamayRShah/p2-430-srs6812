import React, { useState, useCallback, useContext, createContext } from "react";
import Toast from "../components/Toast.jsx";

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const close = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const open = useCallback(
    ({ message, type, timeout = 5000 }) => {
      const id = Date.now(); // Using Date.now() as a simple unique identifier
      setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
      setTimeout(() => close(id), timeout);
      return id;
    },
    [close]
  );

  return (
    <ToastContext.Provider value={{ open, close }}>
      {children}
      <div className="absolute w-full sm:w-fit flex flex-col bottom-0 right-0 p-2 gap-2">
        {toasts.map(({ id, message, type }) => (
          <React.Fragment key={id}>
            <Toast type={type} message={message} remove={() => close(id)} />
          </React.Fragment>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
