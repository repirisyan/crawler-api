import { SellerDistribution } from "../models/SellerDistribution";
import moment from "moment";

interface QueryParams {
  year: string;
  month: string;
  date: string;
}

interface RequestContext {
  query: QueryParams;
  set: { status: number };
}

export const SellerDistributionController = {
  getAll: async ({ query, set }: RequestContext) => {
    const year = parseInt(query.year, 10) || moment().year();
    const month = parseInt(query.month, 10) || moment().month() + 1;
    const date = query.date || null;
    try {
      const searchQuery: any = {
        ...(year && { year: year }),
        ...(month && { month: month }),
      };

      // Aggregation pipeline to group by commodity and count/sum other fields
      const result = await SellerDistribution.aggregate([
        { $match: searchQuery }, // Step 1: Filter by year, month, date
        {
          $group: {
            _id: {
              comodity: "$comodity", // Group by commodity
              year: "$year",
              month: "$month",
            },
            totalSeller: { $sum: "$seller" }, // Sum the "amount" field (assuming you have such a field)
          },
        },
      ]);

      return result;
    } catch (error) {
      console.error("Error fetching seller distribution data:", error);
      set.status = 500;
      return { error: "An error occurred while fetching data" };
    }
  },
};
