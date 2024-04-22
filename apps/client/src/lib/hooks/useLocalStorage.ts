export const useLocalStorage = (key: string) => {
  const setItem = (value: unknown) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const getItem = () => {
    const value = localStorage.getItem(key);
    return value !== null ? JSON.parse(value) : null;
  };

  const deleteItem = () => localStorage.removeItem(key);

  return { setItem, getItem, deleteItem };
};
