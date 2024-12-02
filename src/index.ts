import { Elysia } from "elysia";
import { sortServer } from "./lib/sort-server";
import minimist from "minimist";
import { logger } from "@bogeychan/elysia-logger";

// Parse command line arguments
const argv = minimist(process.argv.slice(2));
const PORT = argv.port || argv.p || 3000;
const HOST = argv.host || argv.h || "0.0.0.0";

// Create Elysia instance with logger
const app = new Elysia()
  .use(logger())
  .state("config", {
    version: "1.0.0",
    env: process.env.NODE_ENV || "development"
  })
  // Error handling
  .onError(({ code, error, set }) => {
    switch (code) {
      case "NOT_FOUND":
        set.status = 404;
        return {
          success: false,
          error: "Route not found",
          path: error.message
        };

      case "INTERNAL_SERVER_ERROR":
        set.status = 500;
        return {
          success: false,
          error: "Internal server error",
          message: error.message
        };

      default:
        set.status = 500;
        return {
          success: false,
          error: "Unknown error occurred",
          message: error.message
        };
    }
  })
  // Health check
  .get("/health", () => ({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  }))
  // Main routes
  .get("/", () => ({
    success: true,
    message: "Server is running",
    version: app.server?.id
  }))
  .get("/server-port", sortServer)
  // Group routes if needed
  .group("/api", (app) =>
    app.get("/version", ({ store: { config } }) => ({
      version: config.version,
      env: config.env
    }))
  )
  // Start server
  .listen(PORT, HOST);

// Startup message
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port} in ${
    process.env.NODE_ENV || "development"
  } mode`
);

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  app.stop();
});

// Export for testing
export { app };
