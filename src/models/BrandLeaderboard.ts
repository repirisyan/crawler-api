import { Schema, model, Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

// Define the Brand interface
interface BrandLeaderboard extends Document {
  brand: string;
  marketplace: string;
  total: number;
  year: number;
  month: number;
  date: string;
}

// Define the schema for your collection
const productSchema = new Schema<BrandLeaderboard>({
  brand: { type: String, required: true },
  marketplace: { type: String, required: true },
  total: { type: Number, required: true },
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  date: { type: String, required: true },
});

productSchema.plugin(mongoosePaginate);

// Create and export the model
export const BrandLeaderboard = model<BrandLeaderboard>(
  "brand_leaderboards",
  productSchema,
);
