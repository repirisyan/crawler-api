import { Schema, model, Document, type PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

// Define the Brand interface
interface Brand extends Document {
  name: string;
}

// Define the schema for your collection
const productSchema = new Schema<Brand>({
  name: { type: String, required: true },
});

productSchema.plugin(mongoosePaginate);

// Create and export the model
export const Brand: PaginateModel<Brand> = model<Brand, PaginateModel<Brand>>(
  "brands",
  productSchema,
);
