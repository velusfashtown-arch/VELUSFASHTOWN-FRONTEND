import { api } from '../lib/api';
import { getToken } from '../lib/auth';

function normalizeImages(images = []) {
  return images
    .map((image, index) => {
      if (typeof image === 'string') return { url: image, order: index, isMain: index === 0 };
      return image?.url ? { ...image, order: index, isMain: index === 0 } : null;
    })
    .filter(Boolean);
}

export const productService = {
  /**
   * Create a new product
   */
  async create(formData) {
    const token = getToken();
    if (!token) throw new Error('Authentication required');
    const payload = this.transformPayload(formData);
    return api.adminCreateProduct(token, payload);
  },

  /**
   * Update existing product
   */
  async update(id, formData) {
    const token = getToken();
    if (!token) throw new Error('Authentication required');
    const payload = this.transformPayload(formData);
    return api.adminUpdateProduct(token, id, payload);
  },

  /**
   * Transform form data to API payload
   * Maps frontend form field names to backend API schema field names
   */
  transformPayload(formValues) {
    const mrp = parseFloat(formValues.mrp) || 0;
    const sellingPrice = parseFloat(formValues.sellingPrice) || 0;
    const costPrice = parseFloat(formValues.costPrice) || 0;
    const gst = parseFloat(formValues.gst) || 0;
    const stock = parseInt(formValues.stock) || 0;
    const discount = mrp > 0 && sellingPrice > 0
      ? Math.round(((mrp - sellingPrice) / mrp) * 100)
      : 0;

    return {
      // Core
      productId: formValues.productId || undefined,
      name: formValues.productName?.trim() || '',
      sku: formValues.sku?.trim() || '',

// Relations
      category: formValues.category || null,
      subCategory: formValues.subCategory || null,

      // Pricing
      mrp: mrp,
      sellingPrice: sellingPrice,
      costPrice: costPrice,
      gst: gst,
      discount: discount,

      // Inventory
      stock: stock,
      lowStockAlert: parseInt(formValues.lowStockAlert) || 5,

      // Images
      images: normalizeImages(formValues.images),
      mainImage: normalizeImages(formValues.images)[0]?.url || '',

      // Videos
      productVideo: formValues.productVideo || '',
      youtubeUrl: formValues.youtubeUrl || '',
      instagramReelUrl: formValues.instagramReelUrl || '',

// Description
      shortDescription: formValues.shortDescription || '',
      description: formValues.longDescription || '',

      // Tags
      tags: Array.isArray(formValues.tags) ? formValues.tags : [],

      // Status
      status: formValues.status || 'Draft',

      // Variants
      hasVariants: Array.isArray(formValues.variants) && formValues.variants.length > 0,
      variants: Array.isArray(formValues.variants) ? formValues.variants.map(v => ({
        sku: v.sku || '',
        color: v.color || '',
        price: parseFloat(v.price) || 0,
        mrp: parseFloat(v.mrp) || 0,
        stock: parseInt(v.stock) || 0,
        images: normalizeImages(v.images),
        isActive: v.isActive !== false,
      })) : [],

      // Additional Details
      countryOfOrigin: formValues.countryOfOrigin || 'India',
      manufacturer: formValues.manufacturer || '',
      packer: formValues.packer || '',

      // Custom Fields (admin-defined, see Custom Fields admin screen)
      customFields: Array.isArray(formValues.customFields) ? formValues.customFields : [],
    };
  },
};
