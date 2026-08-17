import { z } from 'zod';

const requiredNumber = (label) => z.string()
  .min(1, `${label} is required`)
  .refine((value) => Number.isFinite(Number(value)) && Number(value) >= 0, `${label} must be a valid number`);

const optionalNumber = z.string()
  .refine((value) => !value || (Number.isFinite(Number(value)) && Number(value) >= 0), 'Must be a valid number')
  .optional();

export function getAddProductSchema() {
  return z.object({
  productName: z.string().min(2, 'Product name must be at least 2 characters').max(200, 'Product name too long'),
  sku: z.string().optional(),
category: z.string().min(1, 'Category is required'),
  subCategory: z.string().min(1, 'Sub category is required'),
  status: z.string().optional(),

  mrp: requiredNumber('MRP'),
  sellingPrice: requiredNumber('Selling price'),
  costPrice: optionalNumber,
  gst: optionalNumber,

  stock: requiredNumber('Stock quantity'),
  lowStockAlert: optionalNumber,

  images: z.array(z.string()).min(1, 'Upload at least one image').max(20, 'Maximum 20 images allowed'),
  productVideo: z.string().url('Invalid video URL').optional().or(z.literal('')),
  youtubeUrl: z.string().url('Invalid YouTube URL').optional().or(z.literal('')),
  instagramReelUrl: z.string().url('Invalid Instagram URL').optional().or(z.literal('')),

shortDescription: z.string().max(300, 'Short description too long').optional(),
  longDescription: z.string().optional(),

  tags: z.array(z.string()).optional(),
  variants: z.array(z.object({
    color: z.string().min(1, 'Color name is required'),
  })).optional(),
  customFields: z.array(z.object({ key: z.string(), value: z.any() })).optional(),

  countryOfOrigin: z.string().optional(),
  manufacturer: z.string().optional(),
  packer: z.string().optional(),
});
}
