export const useLocalStorage = (key: string) => {
  const supportsLocalStorage = () => {
    try {
      return "localStorage" in window && window["localStorage"] !== null;
    } catch (error) {
      return false;
    }
  };

  const setLocalItem = (value: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const getLocalItem = () => {
    try {
      const value = localStorage.getItem(key);
      return value !== null ? JSON.parse(value) : null;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const deleteItem = () => localStorage.removeItem(key);

  return { setLocalItem, getLocalItem, deleteItem, supportsLocalStorage };
};
