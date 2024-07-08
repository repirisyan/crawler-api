import { Request, Response } from 'express';
import product from '../../models/product/getAllProduct'; // Import the model

export const getAllProduct = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string, 10) || 1; // Default page to 1 if not specified
    const limit = parseInt(req.query.limit as string, 10) || 10; // Default limit to 10 if not specified

  try {
    const options = {
      page,
      limit
    };

    const result = await product.paginate({}, options);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
};
