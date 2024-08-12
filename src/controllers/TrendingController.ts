import { Product } from "../models/Trending"; // Import the model

interface QueryParams {
  page?: string;
  per_page?: string;
  search?: string;
  marketplaces?: string;
}

interface RequestContext {
  query: QueryParams;
  set: { status: number };
}

export const TrendingProductController = {
  getAll: async ({ query, set }: RequestContext) => {
    const page = parseInt(query.page as string, 10) || 1; // Default page to 1 if not specified
    const limit = parseInt(query.per_page as string, 10) || 10; // Default limit to 10 if not specified
    const search = (query.search as string) || null;
    const marketplaces = query.marketplaces
      ? JSON.parse(query.marketplaces)
      : [];
    try {
      const options = {
        page,
        limit,
      };
      let searchQuery: any = {};
      if (search) {
        searchQuery.$or = [{ keyword: { $regex: search, $options: "i" } }];
      }

      // Apply `marketplace_id` filter if `marketplaces` is provided
      if (marketplaces.length > 0) {
        searchQuery.marketplace_id = { $in: marketplaces };
      }

      const result = await Product.paginate(searchQuery, options);

      return result;
    } catch (error) {
      set.status = 500;
      return { error: "An error occurred while fetching data" };
    }
  },
};
