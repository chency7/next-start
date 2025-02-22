export const useEnv = () => {
  const isDevelopment = process.env.NODE_ENV === "development";
  const isProduction = process.env.NODE_ENV === "production";
  const isTest = process.env.NODE_ENV === "test";

  return {
    isDevelopment,
    isProduction,
    isTest,
    env: process.env.NODE_ENV,
  };
};
