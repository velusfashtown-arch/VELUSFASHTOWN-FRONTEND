
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo } from 'react';
import { getAddProductSchema } from '../schemas/validation';
import { initialFormValues } from '../constants/initialValues';

export function useProductForm(editProduct) {
  const defaultValues = useMemo(() => {
    if (editProduct) {
      return {
        ...initialFormValues,
        productId: editProduct.productId || '',
        productName: editProduct.name || '',
        slug: editProduct.slug || '',
        sku: editProduct.sku || '',
category: editProduct.category?.categoryId || editProduct.category?.id || editProduct.category || '',
        subCategory: editProduct.subCategory?.categoryId || editProduct.subCategory?.id || editProduct.subCategory || '',
        mrp: editProduct.mrp?.toString() || '',
        sellingPrice: editProduct.sellingPrice?.toString() || '',
        costPrice: editProduct.costPrice?.toString() || '',
        gst: editProduct.gst?.toString() || '',
        stock: editProduct.stock?.toString() || '',
        lowStockAlert: editProduct.lowStockAlert?.toString() || '',
        sareeFabric: editProduct.sareeFabric || '',
        blouseFabric: editProduct.blouseFabric || '',
        workType: editProduct.workType || '',
        primaryColor: editProduct.primaryColor || '',
        secondaryColor: editProduct.secondaryColor || '',
        pattern: editProduct.pattern || '',
        printType: editProduct.printType || '',
        borderType: editProduct.borderType || '',
        palluType: editProduct.palluType || '',
        sareeLength: editProduct.sareeLength || '5.5 Mtrs',
        blouseLength: editProduct.blouseLength || '0.80 Mtrs',
        style: editProduct.style || '',
countryOfOrigin: editProduct.countryOfOrigin || 'India',
        manufacturer: editProduct.manufacturer || '',
        packer: editProduct.packer || '',
        shortDescription: editProduct.shortDescription || '',
        longDescription: editProduct.description || '',
images: Array.isArray(editProduct.images)
          ? editProduct.images.map((img) => (typeof img === 'string' ? img : (img.url || img.publicId || ''))).filter(Boolean)
          : [],
        productVideo: editProduct.productVideo || '',
        youtubeUrl: editProduct.youtubeUrl || '',
        instagramReelUrl: editProduct.instagramReelUrl || '',
        status: editProduct.status || 'Published',
        tags: Array.isArray(editProduct.tags) ? editProduct.tags : [],
        variants: Array.isArray(editProduct.variants) ? editProduct.variants : [],
        returnAvailable: editProduct.returnAvailable,
        returnDays: editProduct.returnDays?.toString() || '',
        exchangeAvailable: editProduct.exchangeAvailable,
        codAvailable: editProduct.codAvailable,
        shippingCharge: editProduct.shippingCharge?.toString() || '',
        shippingWeight: editProduct.weight?.toString() || '',
        shippingLength: editProduct.length?.toString() || '',
        shippingWidth: editProduct.width?.toString() || '',
        shippingHeight: editProduct.height?.toString() || '',
        blouseIncluded: editProduct.blouseIncluded,
        blouseType: editProduct.blouseType || 'Unstitched',
        blouseColor: editProduct.blouseColor || '',
      };
    }
    return initialFormValues;
  }, [editProduct]);

  const schema = useMemo(() => getAddProductSchema(), []);

const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors, isDirty, isSubmitting },
    getValues,
    trigger,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const formValues = watch();

  // Auto-generate slug from product name
  useEffect(() => {
    if (formValues.productName && !editProduct) {
      const slug = formValues.productName
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setValue('slug', slug, { shouldValidate: false });
    }
  }, [formValues.productName, editProduct, setValue]);

  // Auto-generate SKU
  useEffect(() => {
    if (formValues.productName && !editProduct && !formValues.sku) {
      const prefix = formValues.category
        ? formValues.category.substring(0, 3).toUpperCase()
        : 'PRD';
      const random = Math.floor(1000 + Math.random() * 9000);
      const sku = `${prefix}-${random}`;
      setValue('sku', sku, { shouldValidate: false });
    }
  }, [formValues.productName, formValues.category, editProduct, formValues.sku, setValue]);

  const resetForm = useCallback(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  const handleImageChange = useCallback((images) => {
    setValue('images', images, { shouldValidate: true });
  }, [setValue]);

const setTags = useCallback((tags) => {
    setValue('tags', tags, { shouldValidate: false });
  }, [setValue]);

const setVariants = useCallback((variants) => {
    setValue('variants', variants, { shouldValidate: false });
  }, [setValue]);

  const methods = {
    register,
    handleSubmit,
    watch,
    setValue,
    reset: resetForm,
    control,
    formValues,
    errors,
    isDirty,
    isSubmitting,
    getValues,
    trigger,
    handleImageChange,
    setTags,
    setVariants,
  };

  return methods;
}
