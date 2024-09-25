import { Schema, model, Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

// Define the Brand interface
interface SellerDistribution extends Document {
  comodity: string;
  marketplace: string;
  seller: number;
  year: number;
  month: number;
  date: string;
}

// Define the schema for your collection
const productSchema = new Schema<SellerDistribution>({
  comodity: { type: String, required: true },
  marketplace: { type: String, required: true },
  seller: { type: Number, required: true },
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  date: { type: String, required: true },
});

productSchema.plugin(mongoosePaginate);

// Create and export the model
export const SellerDistribution = model<SellerDistribution>(
  "seller_distributions",
  productSchema,
);
