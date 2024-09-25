import { Brand } from "../models/Brand";

interface QueryParams {
  page?: string;
  per_page?: string;
  search?: string;
}

interface RequestContext {
  query: QueryParams;
  set: { status: number };
}

export const BrandController = {
  getAll: async ({ query, set }: RequestContext) => {
    const page = parseInt(query.page as string, 10) || 1; // Default page to 1 if not specified
    const limit = parseInt(query.per_page as string, 10) || 15; // Default limit to 10 if not specified
    const search = (query.search as string) || null;

    try {
      const options = {
        page,
        limit,
        lean: true, // Return plain JS objects, not Mongoose Documents
      };

      const searchQuery: any = {
        ...(search && { $or: [{ name: { $regex: search, $options: "i" } }] }),
      };

      const result = await Brand.paginate(searchQuery, options);

      return result;
    } catch (error) {
      console.error("Error fetching brand data:", error);
      set.status = 500;
      return { error: "An error occurred while fetching data" };
    }
  },
  store: async (body: any) => {
    try {
      const brand = { name: body.name };
      await Brand.create(brand);
    } catch (error) {
      console.error("Error storing brand:", error);
      throw new Error("Could not store brand");
    }
  },
  edit: async (id: string) => {
    try {
      return await Brand.find({ _id: id });
    } catch (error) {
      console.error("Error get brand:", error);
      throw new Error("Could not get brand");
    }
  },
  update: async (body: any) => {
    try {
      await Brand.findByIdAndUpdate(body.id, { name: body.name });
    } catch (error) {
      console.error("Error updates brand:", error);
      throw new Error("Could not update brand");
    }
  },
  destroy: async (body: any) => {
    try {
      await Brand.deleteMany({ _id: { $in: body.ids } });
    } catch (error) {
      console.error("Error delete brand:", error);
      throw new Error("Could not delete brand");
    }
  },
};
