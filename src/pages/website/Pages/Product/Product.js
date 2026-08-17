import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../../../lib/api';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import StoreIcon from '../../../../components/store/StoreIcon';
import ProductCard from '../../../../components/store/ProductCard';
import { formatPrice, useShop, FREE_SHIPPING_THRESHOLD } from '../../../../context/ShopContext';

const fallbackImage = '/images/Home/Banner/01.png';

const primaryBtn = 'inline-flex min-h-[46px] w-full items-center justify-center border border-terra bg-terra px-5 py-3 text-[10px] font-bold tracking-[0.14em] text-[#fffaf5] no-underline transition hover:border-wine hover:bg-wine disabled:cursor-not-allowed disabled:border-muted disabled:bg-muted';
const secondaryBtn = 'inline-flex min-h-[46px] w-full items-center justify-center border border-ink bg-transparent px-5 py-3 text-[10px] font-bold tracking-[0.14em] text-ink no-underline transition hover:bg-ink hover:text-paper';

function flattenImages(images) {
  if (!Array.isArray(images)) return [];
  return images.map((img) => (typeof img === 'string' ? img : img?.url || '')).filter(Boolean);
}

const SPEC_ROWS = [];

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [openSection, setOpenSection] = useState('description');
  const [pincode, setPincode] = useState('');
  const [delivery, setDelivery] = useState(null);
  const [deliveryError, setDeliveryError] = useState('');
  const [deliveryLoading, setDeliveryLoading] = useState(false);
  const [related, setRelated] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    setProduct(null);
    setSelectedVariant(null);
    setSelectedImage(0);
    setDelivery(null);
    setPincode('');
    api.getProduct(id)
      .then(({ product: item }) => setProduct(item))
      .catch((requestError) => setError(requestError.message || 'Unable to load this saree.'));
  }, [id]);

  useEffect(() => {
    if (!product?.id) return;
    api.getRelatedProducts(product.id).then(({ products: list }) => setRelated(list || [])).catch(() => setRelated([]));
  }, [product?.id]);

  useEffect(() => {
    api.getBestSellers(8)
      .then(({ products: list }) => {
        if (list?.length) return setBestSellers(list);
        return api.getRecommended(8).then(({ products: fallback }) => setBestSellers(fallback || []));
      })
      .catch(() => setBestSellers([]));
  }, []);

  useEffect(() => {
    if (!product) return;
    document.title = `${product.seoTitle || product.name} | VELU'S FASHTOWN`;
    const description = product.seoDescription || product.shortDescription || product.description || '';
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description.replace(/<[^>]*>/g, '').slice(0, 160));
    }
  }, [product]);

  const activeVariants = useMemo(
    () => (product?.variants || []).filter((v) => v.isActive !== false),
    [product]
  );

  const images = useMemo(() => {
    const variantImages = flattenImages(selectedVariant?.images);
    const base = variantImages.length ? variantImages : flattenImages(product?.images);
    return base.length ? base : [fallbackImage];
  }, [product, selectedVariant]);

  const displayPrice = Number(selectedVariant?.price || product?.price || 0);
  const displayMrp = Number(selectedVariant?.mrp || product?.compareAtPrice || 0);
  const displayStock = selectedVariant ? Number(selectedVariant.stock || 0) : Number(product?.stock || 0);
  const discount = displayMrp > displayPrice ? Math.round((1 - displayPrice / displayMrp) * 100) : 0;
  const outOfStock = product && displayStock < 1;
  const isSaved = wishlist.some((item) => item.id === product?.id);

  function buildCartProduct() {
    return {
      ...product,
      price: displayPrice,
      compareAtPrice: displayMrp,
      stock: displayStock,
      images,
      variantId: selectedVariant?.id || selectedVariant?._id || undefined,
      variantLabel: selectedVariant?.color || undefined,
    };
  }

  function addProductToBag() {
    addToCart(buildCartProduct(), quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2500);
  }

  function buyNow() {
    addToCart(buildCartProduct(), quantity);
    navigate('/checkout');
  }

  async function checkDelivery(event) {
    event.preventDefault();
    setDeliveryError('');
    setDelivery(null);
    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      setDeliveryError('Enter a valid 6-digit pincode');
      return;
    }
    setDeliveryLoading(true);
    try {
      const res = await api.checkDelivery({ pincode });
      setDelivery(res.data);
    } catch (err) {
      setDeliveryError(err.message || 'Could not check delivery for this pincode');
    } finally {
      setDeliveryLoading(false);
    }
  }

  function toggleSection(section) {
    setOpenSection((current) => (current === section ? '' : section));
  }

  const specRows = product ? SPEC_ROWS.filter(([, key]) => product[key]) : [];
  const bestSellersFiltered = bestSellers.filter((item) => item.id !== product?.id);

  return (
    <div className="overflow-hidden bg-paper">
      <Header />
      <main className="mx-auto min-h-[53vh] w-full max-w-[1530px] px-[7vw] py-[clamp(45px,6vw,90px)] max-[620px]:px-[18px]">
        {error ? (
          <div className="mx-auto max-w-[610px] border border-line bg-[#fbf7f0] px-6 py-14 text-center md:px-12"><h3 className="m-0 font-playfair text-3xl font-medium tracking-[-.04em] text-ink">{error}</h3><Link className={`${primaryBtn} mt-6`} to="/shop">BACK TO SHOP</Link></div>
        ) : !product ? (
          <div className="mx-auto max-w-[610px] border border-line bg-[#fbf7f0] px-6 py-14 text-center md:px-12"><h3 className="m-0 font-playfair text-3xl font-medium tracking-[-.04em] text-ink">Loading your saree…</h3></div>
        ) : (
          <>
            <div className="mb-7 flex flex-wrap items-center gap-2 text-[9px] font-bold tracking-[0.11em] text-muted">
              <Link to="/" className="text-muted no-underline hover:text-terra">HOME</Link><span>/</span>
              {product.categoryName ? <><Link to={`/shop?category=${encodeURIComponent(product.categoryName)}`} className="text-muted no-underline hover:text-terra">{product.categoryName.toUpperCase()}</Link><span>/</span></> : null}
              <b className="max-w-[230px] truncate text-ink">{product.name}</b>
            </div>

            <div className="grid gap-9 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,.72fr)] lg:gap-[clamp(42px,7vw,120px)] animate-page-fade-in">
              <section className="flex min-w-0 flex-col-reverse gap-3 lg:flex-row lg:gap-4">
                <div className="flex gap-2 overflow-x-auto pb-1 lg:max-h-[640px] lg:w-20 lg:shrink-0 lg:flex-col lg:overflow-x-visible lg:overflow-y-auto lg:pb-0">
                  {images.map((image, index) => (
                    <button key={`${image}-${index}`} className={`h-[72px] w-[58px] shrink-0 overflow-hidden border bg-sand p-0 transition hover:border-line lg:h-24 lg:w-full ${selectedImage === index ? 'border-ink' : 'border-transparent'}`} type="button" onClick={() => setSelectedImage(index)}>
                      <img src={image} alt={`${product.name} view ${index + 1}`} className="h-full w-full object-contain" onError={(event) => { event.currentTarget.src = fallbackImage; }} />
                    </button>
                  ))}
                </div>
                <div className="relative aspect-[4/5] flex-1 cursor-zoom-in overflow-hidden bg-sand" onClick={() => setLightboxOpen(true)}>
                  <img key={selectedImage} src={images[selectedImage] || images[0]} alt={product.name} className="h-full w-full object-contain animate-gallery-fade-in" onError={(event) => { event.currentTarget.src = fallbackImage; }} />
                  {discount ? <span className="absolute left-4 top-4 bg-paper px-3 py-1.5 text-[9px] font-bold tracking-[0.12em] text-terra">{discount}% OFF</span> : null}
                  <button type="button" className="absolute bottom-4 right-4 grid h-9 w-9 place-items-center rounded-full border-0 bg-paper/90 text-ink shadow-[0_2px_10px_rgba(36,27,24,.18)] transition hover:text-terra" aria-label="Zoom image" onClick={(event) => { event.stopPropagation(); setLightboxOpen(true); }}><StoreIcon name="zoom" /></button>
                </div>
              </section>

              <section className="lg:max-w-[510px] lg:pt-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="mb-3 text-[10px] font-bold tracking-[0.19em] text-terra">{product.categoryName || 'SAREE'}</p>
                    <h1 className="m-0 font-playfair text-[clamp(30px,4vw,56px)] font-medium leading-[1.02] tracking-[-.05em] text-ink">{product.name}</h1>
                  </div>
                  <button className={`grid h-11 w-11 shrink-0 place-items-center border bg-transparent text-ink transition hover:border-terra hover:text-terra ${isSaved ? 'border-terra text-terra' : 'border-line'}`} type="button" aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'} onClick={() => toggleWishlist(product)}>
                    <StoreIcon name="heart" />
                  </button>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <b className="text-2xl text-ink">{formatPrice(displayPrice)}</b>
                  {displayMrp > displayPrice ? <><del className="text-sm text-muted">{formatPrice(displayMrp)}</del><em className="bg-[#f7e8e4] px-2 py-1 text-[10px] font-bold not-italic text-terra">Save {discount}%</em></> : null}
                </div>
                <p className="mb-0 mt-1 text-[10px] text-muted">Inclusive of all taxes</p>
                <p className="my-6 border-y border-line py-5 text-sm leading-6 text-muted">{product.shortDescription || product.description?.replace(/<[^>]*>/g, '') || 'A beautiful saree selected for its graceful drape, timeless colour and festive appeal.'}</p>

                {activeVariants.length > 0 && (
                  <div className="my-6 flex flex-col gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-ink">COLOUR{selectedVariant ? `: ${selectedVariant.color}` : ''}</span>
                    <div className="flex flex-wrap gap-3">
                      {activeVariants.map((variant) => (
                        <button
                          key={variant.id || variant._id || variant.sku}
                          type="button"
                          className={`grid h-11 w-11 place-items-center rounded-full border-2 border-transparent bg-sand p-0.5 text-[10px] font-bold uppercase text-ink outline outline-1 outline-offset-2 outline-line transition hover:outline-terra/50 ${selectedVariant === variant ? 'border-terra outline-terra' : ''}`}
                          title={variant.color}
                          onClick={() => { setSelectedVariant(variant); setSelectedImage(0); }}
                        >
                          <span className="grid h-full w-full place-items-center rounded-full bg-[#f0e9df]">{variant.color?.[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-6 flex flex-wrap items-center gap-4">
                  <span className="text-[10px] font-bold tracking-[0.13em] text-ink">QUANTITY</span>
                  <div className="inline-flex h-9 items-center border border-line bg-paper">
                    <button type="button" aria-label="Reduce quantity" className="grid h-full w-9 place-items-center border-0 bg-transparent p-2 text-ink disabled:text-muted" onClick={() => setQuantity((value) => Math.max(1, value - 1))}><StoreIcon name="minus" /></button>
                    <b className="grid min-w-[28px] place-items-center text-xs text-ink">{quantity}</b>
                    <button type="button" aria-label="Increase quantity" disabled={quantity >= displayStock} className="grid h-full w-9 place-items-center border-0 bg-transparent p-2 text-ink disabled:text-muted" onClick={() => setQuantity((value) => Math.min(displayStock, value + 1))}><StoreIcon name="plus" /></button>
                  </div>
                  <small className="text-xs text-muted">{outOfStock ? 'Currently sold out' : `${displayStock} piece${displayStock === 1 ? '' : 's'} available`}</small>
                </div>

                <div className="grid grid-cols-[1fr_1fr] gap-3">
                  <button className={secondaryBtn} type="button" disabled={outOfStock} onClick={buyNow}>BUY NOW</button>
                  <button className={primaryBtn} type="button" disabled={outOfStock} onClick={addProductToBag}>{outOfStock ? 'SOLD OUT' : added ? 'ADDED TO BAG ✓' : 'ADD TO BAG'}</button>
                </div>

                <p className="my-4 flex items-center gap-2 text-xs font-medium text-terra"><StoreIcon name="package" /> Free shipping on orders above {formatPrice(FREE_SHIPPING_THRESHOLD)}</p>

                <div className="my-6 grid grid-cols-3 gap-3 border-t border-line pt-6">
                  <div className="flex flex-col items-center gap-2 text-center"><StoreIcon name="lock" /><span className="text-[9px] font-bold uppercase leading-tight tracking-[0.06em] text-muted">Secure Payments</span></div>
                  <div className="flex flex-col items-center gap-2 text-center"><StoreIcon name="refresh" /><span className="text-[9px] font-bold uppercase leading-tight tracking-[0.06em] text-muted">7-Day Returns</span></div>
                  <div className="flex flex-col items-center gap-2 text-center"><StoreIcon name="check" /><span className="text-[9px] font-bold uppercase leading-tight tracking-[0.06em] text-muted">Pay on Delivery</span></div>
                </div>

                <form className="my-7 border-y border-line py-5" onSubmit={checkDelivery}>
                  <div className="flex items-center gap-2 border border-line bg-paper px-3">
                    <StoreIcon name="pin" />
                    <input value={pincode} onChange={(event) => setPincode(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Enter pincode to check delivery" className="h-11 flex-1 border-0 bg-transparent px-1 text-sm text-ink outline-none placeholder:text-muted" />
                    <button type="submit" disabled={deliveryLoading} className="shrink-0 border-0 bg-transparent px-2 text-[10px] font-bold tracking-[0.1em] text-terra disabled:text-muted">{deliveryLoading ? '...' : 'CHECK'}</button>
                  </div>
                  {deliveryError && <p className="m-0 mt-2 text-xs text-[#a53232]">{deliveryError}</p>}
                  {delivery && (
                    <p className="m-0 mt-3 flex items-center gap-2 text-xs leading-5 text-ink">
                      <StoreIcon name="truck" /> Delivered in {delivery.estimatedDays} business days.{' '}
                      {delivery.codAvailable ? 'Cash on Delivery available.' : 'Prepaid orders only for this item.'}
                    </p>
                  )}
                </form>

                <div className="border-t border-line">
                  <div className="border-b border-line">
                    <button type="button" className="flex w-full items-center justify-between border-0 bg-transparent py-4 text-left text-[10px] font-bold tracking-[0.13em] text-ink" onClick={() => toggleSection('description')}><span>DESCRIPTION</span><StoreIcon name="chevron" /></button>
                    {openSection === 'description' && (
                      <div className="grid gap-3 pb-5 text-xs leading-6 text-muted animate-accordion-in" dangerouslySetInnerHTML={{ __html: product.description || product.shortDescription || 'A beautiful saree selected for its graceful drape, timeless colour and festive appeal.' }} />
                    )}
                  </div>

                  {specRows.length > 0 && (
                    <div className="border-b border-line">
                      <button type="button" className="flex w-full items-center justify-between border-0 bg-transparent py-4 text-left text-[10px] font-bold tracking-[0.13em] text-ink" onClick={() => toggleSection('specs')}><span>SPECIFICATIONS</span><StoreIcon name="chevron" /></button>
                      {openSection === 'specs' && (
                        <dl className="grid grid-cols-2 gap-x-5 gap-y-4 pb-5 animate-accordion-in">
                          {specRows.map(([label, key]) => <div key={key} className="grid gap-1"><dt className="text-[9px] font-bold tracking-[0.1em] text-muted">{label}</dt><dd className="m-0 text-xs text-ink">{product[key]}</dd></div>)}
                          {product.occasion?.length ? <div className="grid gap-1"><dt className="text-[9px] font-bold tracking-[0.1em] text-muted">Occasion</dt><dd className="m-0 text-xs text-ink">{product.occasion.join(', ')}</dd></div> : null}
                          {product.sku ? <div className="grid gap-1"><dt className="text-[9px] font-bold tracking-[0.1em] text-muted">Product Code</dt><dd className="m-0 text-xs text-ink">{product.sku}</dd></div> : null}
                        </dl>
                      )}
                    </div>
                  )}

                  <div className="border-b border-line">
                    <button type="button" className="flex w-full items-center justify-between border-0 bg-transparent py-4 text-left text-[10px] font-bold tracking-[0.13em] text-ink" onClick={() => toggleSection('shipping')}><span>SHIPPING &amp; RETURNS</span><StoreIcon name="chevron" /></button>
                    {openSection === 'shipping' && (
                      <dl className="grid grid-cols-2 gap-x-5 gap-y-4 pb-5 animate-accordion-in">
                        <div className="grid gap-1"><dt className="text-[9px] font-bold tracking-[0.1em] text-muted">Cash on Delivery</dt><dd className="m-0 text-xs text-ink">Available</dd></div>
                        <div className="grid gap-1"><dt className="text-[9px] font-bold tracking-[0.1em] text-muted">Returns</dt><dd className="m-0 text-xs text-ink">7-day easy returns</dd></div>
                        <div className="grid gap-1"><dt className="text-[9px] font-bold tracking-[0.1em] text-muted">Exchange</dt><dd className="m-0 text-xs text-ink">Available</dd></div>
                      </dl>
                    )}
                  </div>

                  <div className="border-b border-line">
                    <button type="button" className="flex w-full items-center justify-between border-0 bg-transparent py-4 text-left text-[10px] font-bold tracking-[0.13em] text-ink" onClick={() => toggleSection('policy')}><span>CARE &amp; POLICY</span><StoreIcon name="chevron" /></button>
                    {openSection === 'policy' && (
                      <div className="grid gap-3 pb-5 text-xs leading-6 text-muted animate-accordion-in">
                        <p className="m-0">Dry clean recommended to preserve colour, weave and embellishments. Store folded in a cotton or muslin cloth, away from direct sunlight.</p>
                        <p className="m-0">To raise a return or exchange request, reach out within the eligible return window from delivery via your <Link to="/account" className="text-terra">account</Link> order history, or contact our support team.</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>

            <div className="hidden">
              <div className="flex items-center gap-2">
                <b className="text-ink">{formatPrice(displayPrice)}</b>
                {displayMrp > displayPrice ? <del className="text-xs text-muted">{formatPrice(displayMrp)}</del> : null}
              </div>
              <button className={secondaryBtn} type="button" disabled={outOfStock} onClick={buyNow}>BUY NOW</button>
              <button className={primaryBtn} type="button" disabled={outOfStock} onClick={addProductToBag}>{outOfStock ? 'SOLD OUT' : added ? 'ADDED ✓' : 'ADD TO BAG'}</button>
            </div>

            {related.length > 0 && (
              <section className="mt-[clamp(60px,7vw,110px)]">
                <h2 className="m-0 mb-6 border-b border-line pb-6 font-playfair text-[clamp(28px,3vw,40px)] font-medium tracking-[-.05em] text-ink">YOU MAY ALSO LIKE</h2>
                <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 md:gap-x-5 lg:grid-cols-4">
                  {related.map((item) => <ProductCard key={item.id} product={item} />)}
                </div>
              </section>
            )}

            {bestSellersFiltered.length > 0 && (
              <section className="mt-[clamp(60px,7vw,110px)]">
                <h2 className="m-0 mb-6 border-b border-line pb-6 font-playfair text-[clamp(28px,3vw,40px)] font-medium tracking-[-.05em] text-ink">BEST SELLERS</h2>
                <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 md:gap-x-5 lg:grid-cols-4">
                  {bestSellersFiltered.slice(0, 4).map((item) => <ProductCard key={item.id} product={item} />)}
                </div>
              </section>
            )}

            {lightboxOpen && (
              <div className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-6" onClick={() => setLightboxOpen(false)}>
                <button type="button" className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border-0 bg-paper/90 text-ink" aria-label="Close" onClick={() => setLightboxOpen(false)}><StoreIcon name="close" /></button>
                <img src={images[selectedImage] || images[0]} alt={product.name} className="max-h-[88vh] max-w-[92vw] object-contain" onClick={(event) => event.stopPropagation()} />
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
