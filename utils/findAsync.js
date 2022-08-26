const findAsync = async (array, asyncCallback) => {
  const promises = array.map(asyncCallback);
  const results = await Promise.all(promises);
  const index = results.findIndex((result) => result);

  return array[index];
};

export default findAsync;
