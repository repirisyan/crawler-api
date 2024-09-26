import { Elysia } from "elysia";

export const registerAuthRoutes = (app: Elysia) => {
  app.get("/sign", async ({ jwt, cookie: { auth } }) => {
    // Debug checks
    if (!jwt) {
      return "Error: jwt is undefined";
    }
    if (!auth) {
      return "Error: auth is undefined";
    }

    try {
      const token = await jwt.sign(); // Ensure jwt.sign() returns a valid token
      auth.set({
        value: token,
        maxAge: 1 * 86400, // Set token expiration to 1 day
      });
      return auth.value;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return "Unknown error occurred";
    }
  });
};
