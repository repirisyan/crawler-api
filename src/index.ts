import express, { Express, Request, Response } from "express";
import fs from "fs";
import https from "https";
import path from "path";
import cors from "cors";
import { connectDB } from "./db/connection"; // Import the connectDB function
import { getAllProduct } from "./controller/ProductController/getAllProduct";

const app: Express = express();
const port = 3030;

app.use(cors());

// Read SSL certificate and key
const key = fs.readFileSync(path.join(__dirname, "../key.pem"));
const cert = fs.readFileSync(path.join(__dirname, "../cert.pem"));

const options = {
  key,
  cert,
};

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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// https.createServer(options, app).listen(port, () => {
//   console.log(`Server is running on https://localhost:${port}`);
// });
