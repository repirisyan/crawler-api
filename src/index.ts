import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { connectDB } from "./db/connection"; // Import the connectDB function
import { getAllProduct } from "./controller/ProductController/getAllProduct";
import { getAllTrendingProduct } from "./controller/ProductController/getAllTrendingProduct";

const app = new Elysia();
const port = 8090;

app.use(cors());

// Connect to MongoDB
connectDB().catch((error: any) => {
  console.error("Error connecting to MongoDB:", error);
  process.exit(1);
});

app.get("/product", getAllProduct);
app.get("/trending-product", getAllTrendingProduct);


app.listen(port);

