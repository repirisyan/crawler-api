import { Elysia } from "elysia";
import { TempItemController } from "../controllers/TempItemController";

export const registerTempItemRoutes = (app: Elysia) => {
  app.get("/temp-item", TempItemController.getAll, {
    detail: {
      tags: ["Temp Item"],
    },
  });
  app.get("/temp-item/total", TempItemController.getTotalProduct, {
    detail: {
      tags: ["Temp Item"],
    },
  });
};
