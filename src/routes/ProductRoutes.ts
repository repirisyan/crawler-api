import { Elysia } from "elysia";
import { ProductController } from "../controllers/ProductController";

export const registerProductRoutes = (app: Elysia) => {
  app.get("/product", ProductController.getAll, {
    detail: {
      tags: ["Product"],
    },
  });
  app.get("/product/total", ProductController.getTotalProduct, {
    detail: {
      tags: ["Product"],
    },
  });
};
