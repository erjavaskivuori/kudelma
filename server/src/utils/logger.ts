const isProd = process.env.NODE_ENV === 'production';

const info = (message: string, context?: Record<string, unknown>) => {
  const parts: unknown[] = [new Date().toISOString(), '[INFO]', message];
  if (context) parts.push(JSON.stringify(context));
  console.log(...parts);
};

const error = (message: string, context?: Record<string, unknown>) => {
  const parts: unknown[] = [new Date().toISOString(), '[ERROR]', message];
  if (context) parts.push(JSON.stringify(context));
  console.error(...parts);
};

const warn = (message: string, context?: Record<string, unknown>) => {
  const parts: unknown[] = [new Date().toISOString(), '[WARN]', message];
  if (context) parts.push(JSON.stringify(context));
  console.warn(...parts);
};

const debug = (message: string, context?: Record<string, unknown>) => {
  if (isProd) return;
  const parts: unknown[] = [new Date().toISOString(), '[DEBUG]', message];
  if (context) parts.push(JSON.stringify(context));
  console.log(...parts);
};

export default {
  info,
  error,
  warn,
  debug,
};
