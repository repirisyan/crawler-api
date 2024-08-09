import { Elysia } from "elysia";
import { ProductController } from "../controllers/ProductController";

export const registerProductRoutes = (app: Elysia) => {
  app.get("/products", ProductController.getAll);
  app.get("/products/total", ProductController.getTotalProduct);
};
