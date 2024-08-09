import { Schema, model, Document } from "mongoose";

// Define the Product interface
interface TempProduct extends Document {
  title: string;
  brand?: string;
  image?: string[];
  price: Object;
  rating: Object;
  sold: number; // Use number for large integers
  seller: Object;
  location: Object;
  description?: string;
  link: string;
  category?: string;
  marketplace: string;
  comodity: Object;
  keyword: string;
  created_at: string;
}

// Define the schema for your collection
const productSchema = new Schema<TempProduct>({
  title: { type: String, required: true },
  brand: { type: String, required: false },
  image: { type: [String], required: false },
  price: { type: Object, required: true },
  rating: { type: Object, required: true },
  sold: { type: Number, required: true }, // Use Number type
  seller: { type: Object, required: true },
  location: { type: Object, required: true },
  description: { type: String, required: false },
  link: { type: String, required: true },
  category: { type: String, required: false },
  marketplace: { type: String, required: true },
  comodity: { type: Object, required: true },
  keyword: { type: String, required: true },
  created_at: { type: String, required: true },
});


// Create and export the paginated model
export const TempProduct = model<TempProduct>("temp_items", productSchema);
