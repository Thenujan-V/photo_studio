import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const triggerNotification = (message, type = "info") => {
    if (type === "success") {
      toast.success(message,{
        autoClose: 3000,
      });
    } else if (type === "error") {
      toast.error(message);
    } else {
      toast(message);
    }
  };