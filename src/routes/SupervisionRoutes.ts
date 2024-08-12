import { Elysia, t } from "elysia";
import { SupervisionController } from "../controllers/SupervisionController";

export const registerSupervisionRoutes = (app: Elysia) => {
  app.get("/supervision", SupervisionController.getAll);
  app.post(
    "/supervision",
    ({ body }) => {
      return SupervisionController.store(body);
    },
    {
      body: t.Object({
        ids: t.Array(t.String()),
      }),
    },
  );
  app.patch(
    "/supervision",
    ({ body }) => {
      return SupervisionController.update(body);
    },
    {
      body: t.Object({
        ids: t.Array(t.String()),
      }),
    },
  );
  app.delete(
    "/supervision",
    ({ body }) => {
      return SupervisionController.destroy(body);
    },
    {
      body: t.Object({
        ids: t.Array(t.String()),
      }),
    },
  );
  app.get("/supervision/total", SupervisionController.getTotalData);
};
