import { Schema, model, Document, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

interface TrendingProductTable extends Document {
  url: string;
  created_at: string;
  imageURL: string;
  keyword: string;
  productCount: number;
  marketplace: string;
}

// Define the schema for your collection
const productSchema = new Schema({
  // Define your schema fields here
  // For example:
  url: { type: String, required: true },
  created_at: { type: String, required: true },
  imageURL: { type: String, required: true },
  keyword: { type: String, required: true },
  marketplace: { type: String, required: true },
  productCount: { type: Number, required: true },
});

productSchema.plugin(mongoosePaginate);

// Create and export the model
export const Product: PaginateModel<TrendingProductTable> = model<
  TrendingProductTable,
  PaginateModel<TrendingProductTable>
>("trending_products", productSchema);
