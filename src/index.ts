import { Elysia } from "elysia";
import { sortServer } from "./lib/sort-server";
import minimist from "minimist";
import { logger } from "@bogeychan/elysia-logger";

// Parse command line arguments
const argv = minimist(process.argv.slice(2));
const PORT = argv.port || argv.p || 3000;

// App configuration
const config = {
  version: '1.0.0',
  env: process.env.NODE_ENV || 'development'
};

const app = new Elysia()
  .use(logger())
  .state('config', config)
  .onError(({ code, error, set }) => {
    switch (code) {
      case 'NOT_FOUND':
        set.status = 404;
        return { 
          success: false, 
          error: 'Route not found',
          path: error.message 
        };
      default:
        set.status = 500;
        return { 
          success: false, 
          error: 'Unknown error occurred',
          message: error.message 
        };
    }
  })
  .get("/health", () => ({ 
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  }))
  .get("/", ({ store }) => ({
    success: true,
    message: "Server is running",
    version: store.config.version
  }))
  .get("/server-port", sortServer)
  .listen(PORT);

// Startup message
console.log(
  `🦊 Elysia is running at http://localhost:${PORT} in ${config.env} mode`
);

export { app };