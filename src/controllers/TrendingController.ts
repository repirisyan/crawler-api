import { Product } from "../models/Trending"; // Import the model

interface QueryParams {
  page?: string;
  per_page?: string;
  search?: string;
  marketplaces?: string;
  date_from?: string;
  date_until?: string;
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
    const date_from = query.date_from || null;
    const date_until = query.date_until || null;
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
        searchQuery.marketplace = { $in: marketplaces };
      }
      if (date_from && date_until) {
        searchQuery.$expr = {
          $and: [
            {
              $gte: [
                {
                  $dateFromString: {
                    dateString: "$created_at",
                    format: "%Y-%m-%d %H:%M:%S",
                  },
                },
                new Date(date_from + "T00:00:00Z"),
              ],
            },
            {
              $lte: [
                {
                  $dateFromString: {
                    dateString: "$created_at",
                    format: "%Y-%m-%d %H:%M:%S",
                  },
                },
                new Date(date_until + "T23:59:59Z"),
              ],
            },
          ],
        };
      }

      const result = await Product.paginate(searchQuery, options);

      return result;
    } catch (error) {
      set.status = 500;
      return { error: "An error occurred while fetching data" };
    }
  },
};
