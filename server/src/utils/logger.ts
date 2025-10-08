const info = (...params: unknown[]) => {
  console.log(new Date().toISOString(), '[INFO]', ...params);
};

const error = (...params: unknown[]) => {
  console.error(new Date().toISOString(), '[ERROR]', ...params);
};

export default {
  info,
  error
};
