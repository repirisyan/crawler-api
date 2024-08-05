import express, { Express, Request, Response } from "express";
import cors from "cors";
import { connectDB } from "./db/connection"; // Import the connectDB function
import { getAllProduct } from "./controller/ProductController/getAllProduct";
import { getAllTrendingProduct } from "./controller/ProductController/getAllTrendingProduct";

const app: Express = express();
const port = 8090;

app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB().catch((error: any) => {
  console.error("Error connecting to MongoDB:", error);
  process.exit(1);
});

app.get("/product", getAllProduct);
app.get("/trending-product", getAllTrendingProduct);


app.listen(port);

