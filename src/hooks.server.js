// src/hooks.server.js
export const handle = async ({ event, resolve }) => {
    return resolve(event, { ssr: false });
  };
  