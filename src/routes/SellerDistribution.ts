import { Elysia } from "elysia";
import { SellerDistributionController } from "../controllers/SellerDistributionController";

export const registerSellerDistributionRoutes = (app: Elysia) => {
  app.get("/seller-distribution", SellerDistributionController.getAll, {
    detail: {
      tags: ["Seller Distribution"],
    },
  });
};
