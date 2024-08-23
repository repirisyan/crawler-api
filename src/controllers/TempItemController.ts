import { TempItem } from "../models/TempItem";
import { getFromCache, setInCache } from "../services/RedisCache";

interface QueryParams {
  page?: string;
  per_page?: string;
  search?: string;
  marketplaces?: string;
  comodities?: string;
  certificates?: string;
}

interface RequestContext {
  query: QueryParams;
  set: { status: number };
}

export const TempItemController = {
  getAll: async ({ query, set }: RequestContext) => {
    const page = parseInt(query.page as string, 10) || 1; // Default page to 1 if not specified
    const limit = parseInt(query.per_page as string, 10) || 15; // Default limit to 15 if not specified
    const search = (query.search as string) || null;
    const marketplaces = query.marketplaces
      ? JSON.parse(query.marketplaces)
      : [];
    const certificates = query.certificates
      ? JSON.parse(query.certificates)
      : [];
    const comodities = query.comodities ? JSON.parse(query.comodities) : [];
    const skip = (page - 1) * limit;

    try {
      let searchQuery: any = {};

      // Search by title if search term is provided
      if (search) {
        searchQuery.$or = [{ title: { $regex: search, $options: "i" } }];
      }

      // Apply marketplace filter if provided
      if (marketplaces.length > 0) {
        searchQuery.marketplace = { $in: marketplaces };
      }

      // Apply certificates filter if provided
      if (certificates.length > 0) {
        const certificateFields = [
          "certified.bpom",
          "certified.sni",
          "certified.distribution_permit",
          "certified.halal",
        ];
        certificates.forEach((cert: any, index: any) => {
          if (cert) {
            searchQuery[certificateFields[index]] = cert;
          }
        });
      }

      // Apply comodities filter if provided
      if (comodities.length > 0) {
        searchQuery["comodity.comodity"] = { $in: comodities };
      }

      const result = await TempItem.find(searchQuery).skip(skip).limit(limit);

      return result;
    } catch (error) {
      set.status = 500;
      console.error("Error in getAll:", error); // Improved error logging
      return { error: "An error occurred while fetching data" };
    }
  },

  getTotalProduct: async () => {
    try {
      let totalProducts = await getFromCache("total_temp_item");
      if (!totalProducts) {
        totalProducts = await TempItem.countDocuments();
        await setInCache("total_temp_item", totalProducts);
      }
      return totalProducts;
    } catch (error) {
      console.error("Error fetching total product count:", error); // Improved error logging
      throw new Error("Could not retrieve total product count");
    }
  },
};
