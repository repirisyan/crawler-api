import moment from "moment";
import { Product } from "../models/Trending"; // Import the model

interface QueryParams {
  page?: string;
  per_page?: string;
  search?: string;
  marketplaces?: string; // JSON string
  date_from?: string; // Expected format: YYYY-MM-DD
  date_until?: string; // Expected format: YYYY-MM-DD
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
    const marketplaces: string[] = query.marketplaces
      ? JSON.parse(query.marketplaces)
      : [];
    const dateFrom = query.date_from
      ? moment(query.date_from, "YYYY-MM-DD", true)
      : null;
    const dateUntil = query.date_until
      ? moment(query.date_until, "YYYY-MM-DD", true)
      : null;

    try {
      const options = {
        page,
        limit,
        lean: true, // Return plain JS objects, not Mongoose Documents
      };

      const searchQuery: any = {
        ...(search && {
          $or: [{ keyword: { $regex: search, $options: "i" } }],
        }),
        ...(marketplaces.length > 0 && { marketplace: { $in: marketplaces } }),
      };

      // Handle date range filter
      if (dateFrom && dateFrom.isValid() && dateUntil && dateUntil.isValid()) {
        searchQuery.created_at = {
          $gte: dateFrom.startOf("day").toDate(),
          $lte: dateUntil.endOf("day").toDate(),
        };
      } else if (dateFrom && dateFrom.isValid()) {
        searchQuery.created_at = { $gte: dateFrom.startOf("day").toDate() };
      } else if (dateUntil && dateUntil.isValid()) {
        searchQuery.created_at = { $lte: dateUntil.endOf("day").toDate() };
      }

      const result = await Product.paginate(searchQuery, options);

      return result;
    } catch (error) {
      console.error("Error fetching trending products:", error);
      set.status = 500;
      return { error: "An error occurred while fetching data" };
    }
  },
};
