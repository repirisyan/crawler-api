import express, { Express, Request, Response } from "express";
import { connectDB } from './db/connection'; // Import the connectDB function
import { getAllProduct } from "./controller/ProductController/getAllProduct"

const app: Express = express();
const port = 3030;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB().catch((error:any) => {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1);
});


app.get("/product", getAllProduct)

app.listen(port, () => {
  console.log(`[server]: Server is running at ${port}`);
});