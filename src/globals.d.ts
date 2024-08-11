// src/globals.d.ts
declare module 'process' {
    global {
      var process: {
        env: {
          NODE_ENV: string;
        };
      };
    }
  }