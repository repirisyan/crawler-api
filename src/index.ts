import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { connectDB } from "./db/connection"; // Import the connectDB function
import dotenv from "dotenv";
import { registerProductRoutes } from "./routes/ProductRoutes";
import { registerTrendingProductRoutes } from "./routes/TrendingProductRoutes";

dotenv.config();

export const app = new Elysia();

app.use(cors());

// Connect to MongoDB
connectDB().catch((error: any) => {
  console.error("Error connecting to MongoDB:", error);
  process.exit(1);
});

registerProductRoutes(app);
registerTrendingProductRoutes(app);

app.listen(process.env.API_PORT || 3030);
