import { Elysia } from "elysia";
import { ProductController } from "../controllers/ProductController";

export const registerProductRoutes = (app: Elysia) => {
  app.get("/product", ProductController.getAll);
  app.get("/product/total", ProductController.getTotalProduct);
};
