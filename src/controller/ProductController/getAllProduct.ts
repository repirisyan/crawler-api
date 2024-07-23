import { Request, Response } from "express";
import product from "../../models/product/getAllProduct"; // Import the model

export const getAllProduct = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1; // Default page to 1 if not specified
  const limit = parseInt(req.query.limit as string, 10) || 10; // Default limit to 10 if not specified
  const search = (req.query.search as string) || null;
  const marketplace = req.query.marketplace as string || null
  const comodity = req.query.comodity as string || null
  try {
    const options = {
      page,
      limit,
    };
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

    const result = await product.paginate(searchQuery, options);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};
