declare module 'simple-node-logger' {
  interface LoggerInstance {
    setLevel: (level: string) => void;
    debug: (message: string) => void;
    info: (message: string) => void;
    warn: (message: string) => void;
    error: (message: string) => void;
  }

  function createSimpleLogger(): LoggerInstance;
}
