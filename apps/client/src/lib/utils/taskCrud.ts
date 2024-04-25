type T = {
  id: string;
};
export const removeObjFromArrOnID = (objArr: T[], incomingItem: T) => {
  return objArr.filter((item) => incomingItem.id !== item.id);
};
