import { Product } from "../models/Product";
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

export const ProductController = {
  getAll: async ({ query, set }: RequestContext) => {
    const page = parseInt(query.page as string, 10) || 1; // Default page to 1 if not specified
    const limit = parseInt(query.per_page as string, 10) || 10; // Default limit to 10 if not specified
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

      const result = await Product.find(searchQuery).skip(skip).limit(limit);

      return result;
    } catch (error) {
      console.error("Error fetching products:", error);
      set.status = 500;
      return { error: "An error occurred while fetching data" };
    }
  },
  getTotalProduct: async () => {
    try {
      let totalProducts = await getFromCache("total_product");
      if (!totalProducts) {
        totalProducts = await Product.countDocuments();
        await setInCache("total_product", totalProducts, 86400);
      }
      return totalProducts;
    } catch (error) {
      console.error("Error fetching total product count:", error);
      throw new Error("Could not retrieve total product count");
    }
  },
};
