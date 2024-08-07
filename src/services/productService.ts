import Product from "../models/product/getAllProduct"; // Adjust the path as needed
import { PaginateResult } from "mongoose";

interface ProductTable {
  comodity: string;
  sub_comodity?: string;
  second_level_sub_comodity?: string;
  third_level_sub_comodity?: string;
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

interface PaginateResult<T> {
  products: T[];
  page: number;
  has_next_page: boolean;
  has_prev_page: boolean;
  per_page: number;
}

export const paginateProducts = async (
  page: number = 1,
  limit: number = 10,
  searchQuery: Record<string, any> = {},
): Promise<PaginateResult<ProductTable>> => {
  try {
    const skip = (page - 1) * limit;
    const products = await Product.find(searchQuery)
      .skip(skip)
      .limit(limit + 1)
      .exec();

    const hasNextPage = products.length > limit;
    if (hasNextPage) {
      products.pop(); // Remove the extra record used for checking
    }

    const has_next_page = hasNextPage;
    const has_prev_page = page > 1;

    return {
      products,
      page,
      has_next_page,
      has_prev_page,
      per_page: limit,
    };
  } catch (error) {
    console.error("Pagination error:", error);
    throw new Error("An error occurred while fetching data");
  }
};
