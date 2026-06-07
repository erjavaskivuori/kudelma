const info = (...params: unknown[]) => {
  console.log(new Date().toISOString(), '[INFO]', ...params);
};

const error = (...params: unknown[]) => {
  console.error(new Date().toISOString(), '[ERROR]', ...params);
};

const warn = (...params: unknown[]) => {
  console.warn(new Date().toISOString(), '[WARN]', ...params);
};

export default {
  info,
  error,
  warn
};
