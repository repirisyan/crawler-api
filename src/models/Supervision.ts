import { Schema, model, Document } from "mongoose";

// Define the Product interface
interface Supervision extends Document {
  title: string;
  brand?: string;
  image?: object;
  price: object;
  rating: object;
  sold: number; // Use number for large integers
  seller: object;
  location: object;
  description?: string;
  link: string;
  category?: string;
  marketplace: string;
  comodity: object;
  keyword: string;
  status: object;
  certified: object;
  crawler_at: string;
  created_at: string;
}

// Define the schema for your collection
const productSchema = new Schema<Supervision>({
  title: { type: String, required: true },
  brand: { type: String, required: false },
  image: { type: Object, required: false },
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
  status: { type: Object, required: true },
  certified: { type: Object, required: true },
  crawler_at: { type: String, requred: true },
  created_at: { type: String, required: true },
});

// Create and export the paginated model
export const Supervision = model<Supervision>("supervisions", productSchema);
