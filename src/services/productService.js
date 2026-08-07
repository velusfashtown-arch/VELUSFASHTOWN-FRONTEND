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
      slug: formValues.slug?.trim() || '',
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

      // Saree Details
      sareeFabric: formValues.sareeFabric || '',
      blouseFabric: formValues.blouseFabric || '',
      workType: formValues.workType || '',
      borderType: formValues.borderType || '',
      palluType: formValues.palluType || '',
      sareeLength: formValues.sareeLength || '5.5 Mtrs',
      blouseLength: formValues.blouseLength || '0.80 Mtrs',
      primaryColor: formValues.primaryColor || '',
      secondaryColor: formValues.secondaryColor || '',
      pattern: formValues.pattern || '',
      printType: formValues.printType || '',
      style: formValues.style || '',

      // Blouse
      blouseIncluded: Boolean(formValues.blouseIncluded),
      blouseType: formValues.blouseType || '',
      blouseColor: formValues.blouseColor || '',

      // Images
      images: normalizeImages(formValues.images),
      mainImage: formValues.thumbnail || normalizeImages(formValues.images)[0]?.url || '',

      // Videos
      productVideo: formValues.productVideo || '',
      youtubeUrl: formValues.youtubeUrl || '',
      instagramReelUrl: formValues.instagramReelUrl || '',

// Description
      shortDescription: formValues.shortDescription || '',
      description: formValues.longDescription || '',

      // Shipping
      weight: parseFloat(formValues.shippingWeight) || 0,
      length: parseFloat(formValues.shippingLength) || 0,
      width: parseFloat(formValues.shippingWidth) || 0,
      height: parseFloat(formValues.shippingHeight) || 0,
      shippingCharge: parseFloat(formValues.shippingCharge) || 0,
      codAvailable: formValues.codAvailable === 'true' || formValues.codAvailable === true,

      // Tags
      tags: Array.isArray(formValues.tags) ? formValues.tags : [],

      // Status
      status: formValues.status || 'Draft',

      // Variants
      hasVariants: Array.isArray(formValues.variants) && formValues.variants.length > 0,
      variants: Array.isArray(formValues.variants) ? formValues.variants.map(v => ({
        sku: v.sku || '',
        color: v.color || '',
        colorCode: v.colorCode || '',
        fabric: v.fabric || '',
        size: v.size || '',
        price: parseFloat(v.price) || 0,
        mrp: parseFloat(v.mrp) || 0,
        stock: parseInt(v.stock) || 0,
        images: normalizeImages(v.images),
        isActive: true,
      })) : [],

      // Return Policy
      returnAvailable: formValues.returnAvailable === 'true' || formValues.returnAvailable === true,
      returnDays: parseInt(formValues.returnDays) || 0,
      exchangeAvailable: formValues.exchangeAvailable === 'true' || formValues.exchangeAvailable === true,

      // Additional Details
      countryOfOrigin: formValues.countryOfOrigin || 'India',
      manufacturer: formValues.manufacturer || '',
      packer: formValues.packer || '',
    };
  },
};
