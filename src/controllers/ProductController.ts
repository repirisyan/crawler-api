import { Product } from "../models/Product";

interface QueryParams {
  page?: string;
  limit?: string;
  search?: string;
  marketplace?: string;
  comodity?: string;
}

interface RequestContext {
  query: QueryParams;
  set: { status: number };
}
export const ProductController = {
  getAll: async ({ query, set }: RequestContext) => {
    const page = parseInt(query.page as string, 10) || 1; // Default page to 1 if not specified
    const limit = parseInt(query.limit as string, 10) || 10; // Default limit to 10 if not specified
    const search = (query.search as string) || null;
    const marketplace = (query.marketplace as string) || null;
    const comodity = (query.comodity as string) || null;
    const skip = (page - 1) * limit;
    try {
      let searchQuery: any = {};
      if (search != null) {
        searchQuery.$or = [
          { comodity: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
          { marketplace: { $regex: search, $options: "i" } },
          { seller: { $regex: search, $options: "i" } },
          { title: { $regex: search, $options: "i" } },
        ];
      }

      if (marketplace != null) {
        searchQuery.marketplace = marketplace;
      }

      if (comodity != null) {
        searchQuery.comodity = comodity;
      }

      const result = await Product.find(searchQuery).skip(skip).limit(limit);

      return result;
    } catch (error) {
      set.status = 500;
      return { error: "An error occurred while fetching data" };
    }
  },
};
