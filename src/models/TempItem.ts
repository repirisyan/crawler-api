import { Schema, model, Document } from "mongoose";

// Define the Product interface
interface TempItem extends Document {
  title: string;
  brand?: string;
  image?: object;
  price: object;
  rating: object;
  sold: number; // Use number for large integers
  weight: number;
  seller: object;
  location: object;
  description?: string;
  link: string;
  category?: string;
  marketplace: string;
  comodity: object;
  keyword: string;
  certified: object;
  created_at: string;
  flag?: boolean;
}

// Define the schema for your collection
const productSchema = new Schema<TempItem>({
  title: { type: String, required: true },
  brand: { type: String, required: false },
  image: { type: Object, required: false },
  price: { type: Object, required: true },
  rating: { type: Object, required: true },
  sold: { type: Number, required: true }, // Use Number type
  weight: { type: Number, required: false }, // Use Number type
  seller: { type: Object, required: true },
  location: { type: Object, required: true },
  description: { type: String, required: false },
  link: { type: String, required: true },
  category: { type: String, required: false },
  marketplace: { type: String, required: true },
  comodity: { type: Object, required: true },
  keyword: { type: String, required: true },
  certified: { type: Object, required: true },
  created_at: { type: String, required: true },
  flag: { type: Boolean, requred: false },
});

// Create and export the paginated model
export const TempItem = model<TempItem>("temp_items", productSchema);
