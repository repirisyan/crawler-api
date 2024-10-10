import { BrandLeaderboard } from "../models/BrandLeaderboard";
import { getFromCache, setInCache } from "../services/RedisCache";
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

export const BrandLeaderboardController = {
  getAll: async ({ query, set }: RequestContext) => {
    const year = parseInt(query.year, 10) || moment().year();
    const month = parseInt(query.month, 10) || moment().month() + 1;
    const date = query.date || null;
    try {
      let result = await getFromCache(`brandLeaderboard_${year}_${month}`);
      if (!result) {
        const searchQuery: any = {
          ...(year && { year: year }),
          ...(month && { month: month }),
        };

        // Aggregation pipeline to group by brand and count/sum other fields
        const result = await BrandLeaderboard.aggregate([
          { $match: searchQuery }, // Step 1: Filter by year, month, date
          {
            $group: {
              _id: {
                brand: "$brand", // Group by brand
                year: "$year",
                month: "$month",
              },
              totalProduct: { $sum: "$total" }, // Sum the "amount" field (assuming you have such a field)
            },
          },
          { $sort: { totalProduct: -1 } }, // Sort by totalProduct in descending order
          { $limit: 20 }, // Limit to top 20 results
        ]);
        await setInCache(`brandLeaderboard_${year}_${month}`, result, 86400);
        return result;
      }

      return result;
    } catch (error) {
      console.error("Error fetching seller distribution data:", error);
      set.status = 500;
      return { error: "An error occurred while fetching data" };
    }
  },
};
