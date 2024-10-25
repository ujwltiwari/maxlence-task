const redis = require("./redis");

export const fetchCache = async (
  key,
  fetchData,
  expiresIn = 60 * 60 * 24, //default expiry is 24 hours in seconds,
) => {
  const cachedData = await getKey(key);
  if (cachedData) {
    console.log("inside cache");
    return cachedData;
  }
  console.log("not inside cache");
  return setValue(key, fetchData, expiresIn);
};

export const getKey = async (key) => {
  const result = await redis.get(key);
  if (result) {
    return JSON.parse(result);
  }
  return null;
};

const setValue = async (key, fetchData, expiresIn) => {
  const setValue = await fetchData();
  await redis.set(key, JSON.stringify(setValue), "EX", expiresIn);
  return setValue;
};
