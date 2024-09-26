import { Elysia } from "elysia";

export const registerAuthRoutes = (app: Elysia) => {
  app.get("/sign", async ({ jwt, cookie: { auth } }) => {
    try {
      auth.set({
        value: await jwt.sign(),
        maxAge: 1 * 86400,
      });

      return auth.value;
    } catch (error: any) {
      return error.message;
    }
  });
};
