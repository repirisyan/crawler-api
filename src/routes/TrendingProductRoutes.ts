import { Elysia } from "elysia";
import { TrendingProductController } from "../controllers/TrendingController";

export const registerTrendingProductRoutes = (app: Elysia) => {
  app.get("/trending-products", TrendingProductController.getAll);
};