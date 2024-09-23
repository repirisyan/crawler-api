import { Elysia, t } from "elysia";
import { BrandController } from "../controllers/BrandController";
export const registerBrandRoutes = (app: Elysia) => {
  app.get("/brand", BrandController.getAll, { detail: { tags: ["Brand"] } });
  app.get(
    "/brand/:id",
    async ({ params: { id } }) => {
      return BrandController.edit(id);
    },
    {
      detail: {
        tags: ["Brand"],
      },
    },
  );
  app.post(
    "/brand",
    async ({ body }) => {
      return BrandController.store(body);
    },
    {
      body: t.Object({
        name: t.String(),
      }),
      detail: {
        tags: ["Brand"],
      },
    },
  );
  app.patch(
    "/brand",
    async ({ body }) => {
      return BrandController.update(body);
    },
    {
      body: t.Object({
        id: t.String(),
        name: t.String(),
      }),
      detail: {
        tags: ["Brand"],
      },
    },
  );
  app.delete(
    "/brand",
    async ({ body }) => {
      return BrandController.destroy(body);
    },
    {
      body: t.Object({
        ids: t.Array(t.String()),
      }),
      detail: {
        tags: ["Brand"],
      },
    },
  );
};
