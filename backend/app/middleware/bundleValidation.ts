import { Request, Response, NextFunction } from 'express';
import * as Yup from 'yup';

const bundleSchema = Yup.object({
  name: Yup.string().required('Bundle name is required'),
  description: Yup.string().required('Description is required'),
  validFrom: Yup.date().required('Start date is required'),
  validUntil: Yup.date()
    .min(Yup.ref('validFrom'), 'End date must be after start date')
    .required('End date is required'),
  limitedQuantity: Yup.number().min(1, 'Must be at least 1').nullable(),
  imageUrl: Yup.string().url('Must be a valid URL').required('Image URL is required'),
  products: Yup.array()
    .of(
      Yup.object({
        productId: Yup.string().required('Product ID is required'),
        quantity: Yup.number().min(1, 'Must be at least 1').required('Quantity is required'),
        discountPercentage: Yup.number()
          .min(0, 'Must be at least 0')
          .max(100, 'Must be at most 100')
          .required('Discount percentage is required'),
      })
    )
    .min(1, 'Must include at least one product'),
});

export const validateBundleCreation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await bundleSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      res.status(400).json({
        message: 'Validation Error',
        errors: error.errors,
      });
    } else {
      next(error);
    }
  }
};
