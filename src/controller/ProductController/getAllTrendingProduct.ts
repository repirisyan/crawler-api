import { Request, Response } from "express";
import product from "../../models/product/getAllTrendingProduct"; // Import the model

export const getAllTrendingProduct = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1; // Default page to 1 if not specified
  const limit = parseInt(req.query.limit as string, 10) || 10; // Default limit to 10 if not specified
  const search = (req.query.search as string) || null;
  const marketplace = req.query.marketplace as string || null
  try {
    const options = {
      page,
      limit,
    };
    let searchQuery: any = {};
    if (search != null) {
      searchQuery.$or = [
        { marketplace: { $regex: search, $options: "i" } },
        { keyword: { $regex: search, $options: "i" } },
      ];
    }

    if (marketplace != null) {
      searchQuery.marketplace = marketplace;
    }

    const result = await product.paginate(searchQuery, options);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};
