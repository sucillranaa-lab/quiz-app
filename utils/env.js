const env = process.env.EXPO_PUBLIC_APP_ENV || 'production';

export const isDev = env === 'development';
export const isProd = !isDev;
