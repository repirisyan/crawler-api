import { Elysia } from "elysia";
import { mysql_query } from "../db/mysql";

export const registerAuthRoutes = (app: Elysia) => {
  app.post("/sign", async ({ cookie: { auth }, body }) => {
    const { token } = body as { token: string };

    const [rows] = await mysql_query.query<any[]>(
      "SELECT * FROM users WHERE remember_token = ?",
      [token],
    );

    if (rows.length === 0) {
      return "Auth Failed";
    }

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
