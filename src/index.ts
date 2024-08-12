import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from '@elysiajs/swagger'
import { connectDB } from "./db/connection"; // Import the connectDB function
import dotenv from "dotenv";
import { registerProductRoutes } from "./routes/ProductRoutes";
import { registerTrendingProductRoutes } from "./routes/TrendingProductRoutes";
import { registerTempItemRoutes } from "./routes/TempItemRoutes";
import { registerSupervisionRoutes } from "./routes/SupervisionRoutes";

dotenv.config();

export const app = new Elysia();

app.use(cors());
app.use(swagger())

// Connect to MongoDB
connectDB().catch((error: any) => {
  console.error("Error connecting to MongoDB:", error);
  process.exit(1);
});

registerProductRoutes(app);
registerTrendingProductRoutes(app);
registerTempItemRoutes(app);
registerSupervisionRoutes(app);

app.listen(process.env.API_PORT || 3030);
