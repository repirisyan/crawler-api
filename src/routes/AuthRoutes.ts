import { Elysia } from "elysia";

export const registerAuthRoutes = (app: Elysia) => {
  app.post("/sign", async ({ cookie: { auth }, body }) => {
    const { token } = body as { token: string };

    // Debug checks
    if (!auth) {
      return "Error: auth is undefined";
    }

    try {
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
