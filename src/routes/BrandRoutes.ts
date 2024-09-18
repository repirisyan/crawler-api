import { Elysia, t } from "elysia";
import { BrandController } from "../controllers/BrandController";

export const registerBrandRoutes = (app: Elysia) => {
  app.get("/brand", BrandController.getAll);
  app.post(
    "/brand",
    ({ body }) => {
      return BrandController.store(body);
    },
    {
      body: t.Object({
        name: t.String(),
      }),
    },
  );
  app.patch(
    "/brand",
    ({ body }) => {
      return BrandController.update(body);
    },
    {
      body: t.Object({
        id: t.String(),
        name: t.String()
      }),
    },
  );
  app.delete(
    "/brand",
    ({ body }) => {
      return BrandController.destroy(body);
    },
    {
      body: t.Object({
        ids: t.Array(t.String()),
      }),
    },
  );
};
