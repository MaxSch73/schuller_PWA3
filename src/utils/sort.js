const isEqual = 0;
const isGreater = 1;
const isSmaller = -1;
export const comparer = (objA, objB, order = 'asc') => {
  if (!(order === 'asc' || order === 'desc')) throw new Error('Unkown sort order');
  let result = isEqual;
  if (objA > objB) result = isGreater;
  if (objA < objB) result = isSmaller;
  if (order === 'desc') result = !result;
  return result;
};
