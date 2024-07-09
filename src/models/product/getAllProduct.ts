import { Schema, model, Document, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

interface ProductTable extends Document {
  comodity: string;
  created_at: string;
  image: string;
  location: string;
  marketplace: string;
  price: number;
  rating: number;
  seller: string;
  sold: number;
  title: string;
}

// Define the schema for your collection
const productSchema = new Schema({
  // Define your schema fields here
  // For example:
  comodity: { type: String, required: true },
  created_at: { type: String, required: true },
  image: { type: String, required: true },
  location: { type: String, required: true },
  marketplace: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
  seller: { type: String, required: true },
  sold: { type: Number, required: true },
  title: { type: String, required: true },
});

productSchema.plugin(mongoosePaginate);

// Create and export the model
const product: PaginateModel<ProductTable> = model<
  ProductTable,
  PaginateModel<ProductTable>
>("products", productSchema);
export default product;
