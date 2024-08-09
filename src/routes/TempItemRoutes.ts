import { Elysia } from "elysia";
import { TempItemController } from "../controllers/TempItemController";

export const registerTempItemRoutes = (app: Elysia) => {
  app.get("/temp-item", TempItemController.getAll);
  app.get("/temp-item/total", TempItemController.getTotalProduct);
};
