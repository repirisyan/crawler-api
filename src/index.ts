import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { jwt } from "@elysiajs/jwt";
import { connectDB } from "./db/connection"; // Import the connectDB function
import dotenv from "dotenv";
import { registerProductRoutes } from "./routes/ProductRoutes";
import { registerTrendingProductRoutes } from "./routes/TrendingProductRoutes";
import { registerTempItemRoutes } from "./routes/TempItemRoutes";
import { registerSupervisionRoutes } from "./routes/SupervisionRoutes";
import { registerBrandRoutes } from "./routes/BrandRoutes";
import { registerSellerDistributionRoutes } from "./routes/SellerDistribution";
import { bearer } from "@elysiajs/bearer";
dotenv.config();

export const app = new Elysia();

app.use(cors());
app.use(
  swagger({
    documentation: {
      info: {
        title: "Crawler Documentation",
        version: "1.0.0",
      },
    },
  }),
);
app.use(bearer());
app.use(
  jwt({
    name: "jwt",
    secret: "Fischl von Luftschloss Narfidort",
  }),
);

app.onBeforeHandle(async ({ jwt, bearer, set, request }) => {
  const verify = await jwt.verify(bearer);
  if (
    !verify &&
    request.url != `${process.env.HOST_URL}/sign`
  ) {
    set.status = 401;
    return "Unauthorized";
  }
});

app.get("/sign", async ({ jwt, cookie: { auth } }) => {
  auth.set({
    value: await jwt.sign(),
    maxAge: 1 * 86400,
  });

  return auth.value;
});

// Connect to MongoDB
connectDB().catch((error: any) => {
  console.error("Error connecting to MongoDB:", error);
  process.exit(1);
});

registerProductRoutes(app);
registerTrendingProductRoutes(app);
registerTempItemRoutes(app);
registerSupervisionRoutes(app);
registerBrandRoutes(app);
registerSellerDistributionRoutes(app);

app.listen(process.env.API_PORT || 3030);
