import { TempItem } from "../models/TempItem";
import { getFromCache, setInCache } from "../services/RedisCache";

interface QueryParams {
  page?: string;
  per_page?: string;
  search?: string;
  marketplaces?: string; // JSON string
  comodities?: string; // JSON string
  certificates?: string; // JSON string
}

interface RequestContext {
  query: QueryParams;
  set: { status: number };
}

const CERTIFICATE_FIELDS = [
  "certified.bpom",
  "certified.sni",
  "certified.distribution_permit",
  "certified.halal",
];

export const TempItemController = {
  getAll: async ({ query, set }: RequestContext) => {
    const page = parseInt(query.page as string, 10) || 1; // Default page to 1 if not specified
    const limit = parseInt(query.per_page as string, 10) || 15; // Default limit to 15 if not specified
    const skip = (page - 1) * limit;
    const search = (query.search as string) || null;

    // Parsing query parameters
    const marketplaces: string[] = query.marketplaces
      ? JSON.parse(query.marketplaces)
      : [];
    const certificates: (string | boolean)[] = query.certificates
      ? JSON.parse(query.certificates)
      : [];
    const comodities: string[] = query.comodities
      ? JSON.parse(query.comodities)
      : [];

    try {
      const searchQuery: any = {
        ...(search && { $or: [{ title: { $regex: search, $options: "i" } }] }),
        ...(marketplaces.length > 0 && { marketplace: { $in: marketplaces } }),
        ...(comodities.length > 0 && {
          "comodity.comodity": { $in: comodities },
        }),
      };

      // Apply certificates filter if provided
      certificates.forEach((cert, index) => {
        if (cert) {
          searchQuery[CERTIFICATE_FIELDS[index]] = cert;
        }
      });

      const result = await TempItem.find(searchQuery).skip(skip).limit(limit);

      return result;
    } catch (error) {
      console.error("Error Fetching Temp Item:", error); // Improved error logging
      set.status = 500;
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
