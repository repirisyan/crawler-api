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
import { registerSellerDistributionRoutes } from "./routes/SellerDistributionRoutes";
import { registerBrandLeaderboardRoutes } from "./routes/BrandLeaderboardRoutes";
import { registerAuthRoutes } from "./routes/AuthRoutes";
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
app.use(
  jwt({
    name: "jwt",
    secret: ";$l(/LyhNTl/KuN@0!>gM39njTlxYI",
  }),
);

app.onBeforeHandle(async ({ jwt, headers, set, request }) => {
  const authHeader = headers.authorization;
  const token = authHeader?.split(" ")[1];
  const verify = await jwt.verify(token);
  if (!verify && request.url != `${process.env.HOST_URL}/sign`) {
    set.status = 401;
    return "Unauthorized";
  }
});

// Connect to MongoDB
connectDB().catch((error: any) => {
  console.error("Error connecting to MongoDB:", error);
  process.exit(1);
});

registerAuthRoutes(app);
registerProductRoutes(app);
registerTrendingProductRoutes(app);
registerTempItemRoutes(app);
registerSupervisionRoutes(app);
registerBrandRoutes(app);
registerSellerDistributionRoutes(app);
registerBrandLeaderboardRoutes(app);

app.listen(process.env.API_PORT || 3030);
