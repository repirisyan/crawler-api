import moment from "moment";
import { Supervision } from "../models/Supervision";
import { TempItem } from "../models/TempItem";
import { getFromCache, setInCache } from "../services/RedisCache";

interface QueryParams {
  page?: string;
  per_page?: string;
  search?: string;
  marketplaces?: string;
  comodities?: string;
  status?: number;
  date?: string;
}

interface RequestContext {
  query: QueryParams;
  set: { status: number };
}
export const SupervisionController = {
  getAll: async ({ query, set }: RequestContext) => {
    const page = parseInt(query.page as string, 10) || 1; // Default page to 1 if not specified
    const limit = parseInt(query.per_page as string, 10) || 15; // Default limit to 10 if not specified
    const search = (query.search as string) || null;
    const status = query.status || null;
    const date = query.date;

    const marketplaces = query.marketplaces
      ? JSON.parse(query.marketplaces)
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

      if (comodities.length > 0) {
        searchQuery["comodity.comodity"] = { $in: comodities };
      }

      if (date != null) {
        searchQuery.created_at = { $eq: date };
      }

      if (status != null) {
        const statusBool = status == 1;
        searchQuery["status.value"] = { $eq: statusBool };
      }

      const result = await Supervision.find(searchQuery)
        .skip(skip)
        .limit(limit);

      return result;
    } catch (error) {
      set.status = 500;
      return { error: "An error occurred while fetching data" };
    }
  },
  store: async (body: any) => {
    try {
      const data = await TempItem.find({ _id: { $in: body.ids } });

      const updates = data.map((element: any) => ({
        updateOne: {
          filter: { _id: element._id },
          update: { $set: { flag: true } },
        },
      }));

      const supervisions = data.map((element: any) => ({
        category: element.category,
        comodity: element.comodity,
        comodity_id: element.comodity_id,
        crawler_at: element.created_at,
        description: element.description,
        image: element.image,
        keyword: element.keyword,
        keyword_id: element.keyword_id,
        link: element.link,
        location: element.location, // Fixed typo from `locatino`
        marketplace: element.marketplace,
        marketplace_id: element.marketplace_id,
        price: element.price,
        rating: element.rating,
        seller: element.seller,
        sold: element.sold,
        title: element.title,
        weight: element.weight,
        brand: element.brand,
        status: { value: false },
        created_at: moment().format("YYYY-MM-DD"),
      }));

      await TempItem.bulkWrite(updates);

      await Supervision.insertMany(supervisions);
    } catch (error) {
      console.error("Error storing supervision:", error);
      throw new Error("Could not store supervision");
    }
  },
  update: async (body: any) => {
    try {
      const updates = body.ids.map((element: any) => ({
        updateOne: {
          filter: { _id: element },
          update: {
            $set: {
              "status.value": true,
              "status.updated_at": moment().format("YYYY-MM-DD"),
            },
          }, // Correct use of $set operator
        },
      }));

      await Supervision.bulkWrite(updates);
    } catch (error) {
      console.error("Error updates supervision:", error);
      throw new Error("Could not update supervision");
    }
  },
  destroy: async (body: any) => {
    try {
      await Supervision.deleteMany({ _id: { $in: body.ids } });
    } catch (error) {
      console.error("Error delete supervision:", error);
      throw new Error("Could not delete supervision");
    }
  },
  getTotalData: async () => {
    try {
      let totalProducts = await getFromCache("total_product_supervision");
      if (!totalProducts) {
        totalProducts = await Supervision.countDocuments();
        await setInCache("total_product_supervision", totalProducts);
      }

      return totalProducts;
    } catch (error) {
      console.error("Error fetching total product count:", error);
      throw new Error("Could not retrieve total product count");
    }
  },
};
