import { Product } from "../models/Product";
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

export const ProductController = {
  getAll: async ({ query, set }: RequestContext) => {
    const page = parseInt(query.page as string, 10) || 1; // Default page to 1 if not specified
    const limit = parseInt(query.per_page as string, 10) || 10; // Default limit to 10 if not specified
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
      if (search) {
        searchQuery.$or = [{ title: { $regex: search, $options: "i" } }];
      }

      // Apply `marketplace_id` filter if `marketplaces` is provided
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

      if (comodities.length > 0) {
        searchQuery["comodity.comodity"] = { $in: comodities };
      }

      const result = await Product.find(searchQuery).skip(skip).limit(limit);

      return result;
    } catch (error) {
      set.status = 500;
      return { error: "An error occurred while fetching data" };
    }
  },
  getTotalProduct: async () => {
    try {
      let totalProducts = await getFromCache("total_product");
      if (!totalProducts) {
        totalProducts = await Product.countDocuments();
        await setInCache("total_product", totalProducts);
      }

      return totalProducts;
    } catch (error) {
      console.error("Error fetching total product count:", error);
      throw new Error("Could not retrieve total product count");
    }
  },
};
