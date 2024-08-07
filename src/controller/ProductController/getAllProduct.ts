import { paginateProducts } from "../../services/productService"; // Adjust the path as needed

interface QueryParams {
  page?: string;
  limit?: string;
  search?: string;
  marketplace?: string;
  comodity?: string;
}

interface RequestContext {
  query: QueryParams;
  set: { status: number };
}

export const getAllProduct = async ({ query, set }: RequestContext) => {
  const page = parseInt(query?.page as string, 10) || 1;
  const limit = parseInt(query?.limit as string, 10) || 15;
  const search = query?.search || null;
  const marketplace = query?.marketplace || null;
  const comodity = query?.comodity || null;

  try {
    let searchQuery: any = {};
    if (search != null) {
      searchQuery.$or = [
        { comodity: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { marketplace: { $regex: search, $options: "i" } },
        { seller: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
      ];
    }

    if (marketplace != null) {
      searchQuery.marketplace = marketplace;
    }

    if (comodity != null) {
      searchQuery.comodity = comodity;
    }

    const result = await paginateProducts(page, limit, searchQuery);

    return result;
  } catch (error) {
    set.status = 500;
    return { error: "An error occurred while fetching data" };
  }
};
