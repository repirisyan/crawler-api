import { Elysia } from "elysia";
import { BrandLeaderboardController } from "../controllers/BrandLeaderboardController";

export const registerBrandLeaderboardRoutes = (app: Elysia) => {
  app.get("/brand-leaderboard", BrandLeaderboardController.getAll, {
    detail: {
      tags: ["Brand Leaderboard"],
    },
  });
};
