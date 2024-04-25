type T = {
  id: string;
};
export const removeObjFromArrOnID = (objArr: T[], incomingItem: T) => {
  return objArr.map((item) => {
    return incomingItem.id === item.id ? null : item;
  });
};
