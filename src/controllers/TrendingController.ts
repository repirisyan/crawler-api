import { Product } from "../models/Trending"; // Import the model

interface QueryParams {
  page?: string;
  limit?: string;
  search?: string;
  marketplace?: string;
}

interface RequestContext {
  query: QueryParams;
  set: { status: number };
}

export const TrendingProductController = {
  getAll: async ({ query, set }: RequestContext) => {
    const page = parseInt(query.page as string, 10) || 1; // Default page to 1 if not specified
    const limit = parseInt(query.limit as string, 10) || 10; // Default limit to 10 if not specified
    const search = (query.search as string) || null;
    const marketplace = (query.marketplace as string) || null;
    try {
      const options = {
        page,
        limit,
      };
      let searchQuery: any = {};
      if (search != null) {
        searchQuery.$or = [
          { marketplace: { $regex: search, $options: "i" } },
          { keyword: { $regex: search, $options: "i" } },
        ];
      }

      if (marketplace != null) {
        searchQuery.marketplace = marketplace;
      }

      const result = await Product.paginate(searchQuery, options);

      return result;
    } catch (error) {
      set.status = 500;
      return { error: "An error occurred while fetching data" };
    }
  },
};
