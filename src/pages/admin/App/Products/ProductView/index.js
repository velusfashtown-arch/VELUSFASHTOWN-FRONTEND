import React, { useEffect, useState } from 'react';
import { getToken } from '../../../../../lib/auth';
import { api } from '../../../../../lib/api';

function formatPrice(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}

function Field({ label, value, fallback = '—' }) {
  const hasValue = value !== undefined && value !== null && value !== '' && value !== 0;
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-[0.06em] text-muted">{label}</dt>
      <dd className="mt-1 text-[13px] font-medium text-ink">{hasValue ? value : fallback}</dd>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-xl border border-line bg-paper">
      <div className="border-b border-[rgba(47,31,25,0.08)] px-5 py-3.5">
        <h3 className="m-0 text-[13px] font-semibold text-ink">{title}</h3>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function ProductImage({ product }) {
  if (product.images?.[0]) {
    const image = product.images[0];
    return <img className="h-[120px] w-[90px] rounded-lg object-cover border border-line bg-[#f5f0eb]" src={typeof image === 'string' ? image : image.url} alt={product.name} />;
  }
  return (
    <div className="flex h-[120px] w-[90px] items-center justify-center rounded-lg border border-line bg-[#f5f0eb] text-[10px] text-muted">
      No image
    </div>
  );
}

export default function ProductView({ product, onBack, onEdit, onDelete, deleting }) {
  const token = getToken();
  const [fullProduct, setFullProduct] = useState(product);
  const [loading, setLoading] = useState(!product?.description && product?.id);

  useEffect(() => {
    if (product?.id) {
      setLoading(true);
      api.adminGetProduct(token, product.id)
        .then((res) => {
          const data = res?.data || res?.product || res;
          if (data) setFullProduct(data);
        })
        .catch(() => { /* keep the row data */ })
        .finally(() => setLoading(false));
    }
  }, [product, token]);

  const p = fullProduct || product;
  if (!p) return null;

  const discount = p.discount || (p.mrp > 0 && p.sellingPrice > 0 ? Math.round(((p.mrp - p.sellingPrice) / p.mrp) * 100) : 0);

  return (
    <div className="min-w-0">
      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 rounded-xl border border-line bg-white/95 px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-line bg-gray-100 px-3 py-2 text-[11px] font-semibold text-gray-500 transition-all hover:bg-terra/10 hover:text-terra"
          >
            ← Back
          </button>
          <span className="h-6 w-px shrink-0 bg-gray-200" />
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-ink">Product Details</h3>
            <p className="mt-0.5 truncate text-[11px] text-gray-400">{p.sku || p.name}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(p)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-[11px] font-semibold text-gray-600 transition-all hover:bg-gray-50"
          >
            ✏️ Edit
          </button>
          <button
            type="button"
            disabled={deleting}
            onClick={() => onDelete(p.id)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-[11px] font-semibold text-red-500 transition-all hover:bg-red-50 disabled:opacity-50"
          >
            🗑 Delete
          </button>
        </div>
      </div>

      {loading && (
        <div className="animate-pulse space-y-4">
          <div className="h-40 rounded-xl border border-line bg-paper" />
          <div className="h-40 rounded-xl border border-line bg-paper" />
        </div>
      )}

      {!loading && (
        <div className="space-y-4">
          {/* Header card */}
          <div className="flex flex-col gap-5 rounded-xl border border-line bg-paper p-5 sm:flex-row">
            <ProductImage product={p} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h2 className="m-0 text-lg font-semibold text-ink">{p.name}</h2>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${p.isActive ? 'bg-[#e6f4ea] text-[#1e8e3e]' : 'bg-[#f0edf5] text-[#6b4fa0]'}`}>
                  <span className={`h-[6px] w-[6px] rounded-full ${p.isActive ? 'bg-[#1e8e3e]' : 'bg-[#6b4fa0]'}`} />
                  {p.isActive ? 'Live' : 'Hidden'} · {p.status || 'Draft'}
                </span>
              </div>
              <p className="mt-1 text-[12px] text-gray-400">SKU: {p.sku || '—'} · Slug: {p.slug || '—'}</p>
              {p.shortDescription && <p className="mt-3 text-[13px] leading-relaxed text-gray-600">{p.shortDescription}</p>}
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">Price</span>
                  <div className="mt-0.5 flex items-baseline gap-2">
                    <b className="text-lg text-ink">{formatPrice(p.sellingPrice)}</b>
                    {p.mrp > p.sellingPrice && <span className="text-[12px] text-muted line-through">{formatPrice(p.mrp)}</span>}
                  </div>
                </div>
                {discount > 0 && (
                  <span className="rounded-full bg-[#e6f4ea] px-2.5 py-1 text-[11px] font-semibold text-[#137333]">{discount}% off</span>
                )}
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">Stock</span>
                  <div className={`mt-0.5 text-[13px] font-semibold ${p.stock > 0 ? 'text-ink' : 'text-[#c5221f]'}`}>
                    {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <Section title="Pricing & Inventory">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
              <Field label="MRP" value={formatPrice(p.mrp)} />
              <Field label="Selling Price" value={formatPrice(p.sellingPrice)} />
              <Field label="Cost Price" value={formatPrice(p.costPrice)} />
              <Field label="GST" value={p.gst ? `${p.gst}%` : ''} />
              <Field label="Discount" value={discount ? `${discount}%` : ''} />
              <Field label="Stock" value={p.stock} />
              <Field label="Low Stock Alert" value={p.lowStockAlert} />
              <Field label="Total Sold" value={p.totalSold} />
            </dl>
          </Section>

{/* Categorization */}
          <Section title="Categorization">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
              <Field label="Category" value={p.category?.name} />
              <Field label="Sub Category" value={p.subCategory?.name} />
              <Field label="Collection" value={p.collection?.name} />
            </dl>
          </Section>

          {/* Saree Details */}
          {(p.sareeFabric || p.primaryColor || p.workType) && (
            <Section title="Saree Details">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
                <Field label="Fabric" value={p.sareeFabric} />
                <Field label="Blouse Fabric" value={p.blouseFabric} />
                <Field label="Work Type" value={p.workType} />
                <Field label="Border Type" value={p.borderType} />
                <Field label="Pallu Type" value={p.palluType} />
                <Field label="Saree Length" value={p.sareeLength} />
                <Field label="Blouse Length" value={p.blouseLength} />
                <Field label="Primary Color" value={p.primaryColor} />
                <Field label="Secondary Color" value={p.secondaryColor} />
                <Field label="Pattern" value={p.pattern} />
                <Field label="Print Type" value={p.printType} />
                <Field label="Style" value={p.style} />
              </dl>
            </Section>
          )}

          {/* Blouse */}
          {(p.blouseType || p.blouseColor) && (
            <Section title="Blouse Details">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                <Field label="Blouse Included" value={p.blouseIncluded ? 'Yes' : 'No'} />
                <Field label="Blouse Type" value={p.blouseType} />
                <Field label="Blouse Color" value={p.blouseColor} />
              </dl>
            </Section>
          )}

          {/* Description */}
          {p.description && (
            <Section title="Description">
              <p className="m-0 whitespace-pre-wrap text-[13px] leading-relaxed text-gray-700">{p.description}</p>
            </Section>
          )}

          {/* Images */}
          {p.images?.length > 0 && (
            <Section title={`Images (${p.images.length})`}>
              <div className="flex flex-wrap gap-3">
                {p.images.map((image, i) => {
                  const url = typeof image === 'string' ? image : image.url;
                  return <img key={i} src={url} alt={image.alt || p.name} className="h-24 w-20 rounded-lg border border-line object-cover" />;
                })}
              </div>
            </Section>
          )}

          {/* Variants */}
          {p.variants?.length > 0 && (
            <Section title={`Variants (${p.variants.length})`}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse text-[12px]">
                  <thead>
                    <tr className="bg-[rgba(47,31,25,0.03)] text-left text-[10px] font-bold uppercase tracking-[0.06em] text-muted">
                      <th className="border-b border-[rgba(47,31,25,0.08)] px-3 py-2">SKU</th>
                      <th className="border-b border-[rgba(47,31,25,0.08)] px-3 py-2">Color</th>
                      <th className="border-b border-[rgba(47,31,25,0.08)] px-3 py-2">Size</th>
                      <th className="border-b border-[rgba(47,31,25,0.08)] px-3 py-2">Price</th>
                      <th className="border-b border-[rgba(47,31,25,0.08)] px-3 py-2">MRP</th>
                      <th className="border-b border-[rgba(47,31,25,0.08)] px-3 py-2">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.variants.map((v, i) => (
                      <tr key={i} className="hover:bg-[rgba(167,78,62,0.03)]">
                        <td className="border-b border-[rgba(47,31,25,0.06)] px-3 py-2">{v.sku || '—'}</td>
                        <td className="border-b border-[rgba(47,31,25,0.06)] px-3 py-2">{v.color || '—'}</td>
                        <td className="border-b border-[rgba(47,31,25,0.06)] px-3 py-2">{v.size || '—'}</td>
                        <td className="border-b border-[rgba(47,31,25,0.06)] px-3 py-2">{formatPrice(v.price)}</td>
                        <td className="border-b border-[rgba(47,31,25,0.06)] px-3 py-2">{formatPrice(v.mrp)}</td>
                        <td className="border-b border-[rgba(47,31,25,0.06)] px-3 py-2">{v.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          {/* Tags */}
          {p.tags?.length > 0 && (
            <Section title="Tags">
              <div className="flex flex-wrap gap-2">
                {p.tags.map((tag, i) => (
                  <span key={i} className="rounded-full bg-[rgba(47,31,25,0.06)] px-3 py-1 text-[11px] font-medium text-gray-600">#{tag}</span>
                ))}
              </div>
            </Section>
          )}

{/* Shipping & Additional */}
          <Section title="Shipping & Additional">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
              <Field label="Weight" value={p.weight || p.shippingWeight ? `${p.weight || p.shippingWeight} g` : ''} />
              <Field label="Dimensions" value={[p.length, p.width, p.height].filter(Boolean).join(' × ')} />
              <Field label="Shipping Charge" value={p.shippingCharge ? formatPrice(p.shippingCharge) : 'Free'} />
              <Field label="COD Available" value={p.codAvailable ? 'Yes' : 'No'} />
              <Field label="Return Available" value={p.returnAvailable ? 'Yes' : 'No'} />
              <Field label="Exchange Available" value={p.exchangeAvailable ? 'Yes' : 'No'} />
              <Field label="Return Days" value={p.returnDays} />
              <Field label="Country of Origin" value={p.countryOfOrigin} />
              <Field label="Manufacturer" value={p.manufacturer} />
              <Field label="Packer" value={p.packer} />
            </dl>
          </Section>
        </div>
      )}
    </div>
  );
}
