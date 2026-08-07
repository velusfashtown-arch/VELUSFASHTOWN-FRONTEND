import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../../../lib/api';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import StoreIcon from '../../../../components/store/StoreIcon';
import ProductCard from '../../../../components/store/ProductCard';
import { formatPrice, useShop, FREE_SHIPPING_THRESHOLD } from '../../../../context/ShopContext';
import './Product.css';

const fallbackImage = '/images/Home/Banner/01.png';

function flattenImages(images) {
  if (!Array.isArray(images)) return [];
  return images.map((img) => (typeof img === 'string' ? img : img?.url || '')).filter(Boolean);
}

const SPEC_ROWS = [
  ['Fabric', 'sareeFabric'],
  ['Blouse Fabric', 'blouseFabric'],
  ['Work', 'workType'],
  ['Border', 'borderType'],
  ['Pallu', 'palluType'],
  ['Pattern', 'pattern'],
  ['Print', 'printType'],
  ['Style', 'style'],
  ['Saree Length', 'sareeLength'],
  ['Blouse Length', 'blouseLength'],
  ['Primary Colour', 'primaryColor'],
  ['Secondary Colour', 'secondaryColor'],
];

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
    // A brand-new store has no sales yet, so "best sellers" (totalSold > 0)
    // would be empty — fall back to recommended products so the section
    // isn't blank; it naturally switches to real best-sellers once orders
    // come in.
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
      variantLabel: selectedVariant ? [selectedVariant.color, selectedVariant.size].filter(Boolean).join(' / ') : undefined,
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
      const res = await api.checkDelivery({ pincode, productId: product.id });
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
    <div className="storefront-shell">
      <Header />
      <main className="product-page">
        {error ? (
          <div className="catalog-empty"><h3>{error}</h3><Link className="store-primary-button" to="/shop">BACK TO SHOP</Link></div>
        ) : !product ? (
          <div className="catalog-empty"><h3>Loading your saree…</h3></div>
        ) : (
          <>
            <div className="breadcrumbs">
              <Link to="/">HOME</Link><span>/</span>
              {product.categoryName ? <><Link to={`/shop?category=${encodeURIComponent(product.categoryName)}`}>{product.categoryName.toUpperCase()}</Link><span>/</span></> : null}
              <b>{product.name}</b>
            </div>

            <div className="product-detail-grid">
              <section className="product-gallery">
                <div className="product-thumbnails">
                  {images.map((image, index) => (
                    <button key={`${image}-${index}`} className={selectedImage === index ? 'active' : ''} type="button" onClick={() => setSelectedImage(index)}>
                      <img src={image} alt={`${product.name} view ${index + 1}`} onError={(event) => { event.currentTarget.src = fallbackImage; }} />
                    </button>
                  ))}
                </div>
                <div className="product-main-image" onClick={() => setLightboxOpen(true)}>
                  <img key={selectedImage} src={images[selectedImage] || images[0]} alt={product.name} onError={(event) => { event.currentTarget.src = fallbackImage; }} />
                  {discount ? <span className="discount-flag">{discount}% OFF</span> : null}
                  <button type="button" className="zoom-trigger" aria-label="Zoom image" onClick={(event) => { event.stopPropagation(); setLightboxOpen(true); }}><StoreIcon name="zoom" /></button>
                </div>
              </section>

              <section className="product-detail-content">
                <div className="detail-heading-row">
                  <div>
                    <p className="eyebrow">{product.categoryName || 'SAREE'}</p>
                    <h1>{product.name}</h1>
                  </div>
                  <button className={`detail-wishlist-icon ${isSaved ? 'is-saved' : ''}`} type="button" aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'} onClick={() => toggleWishlist(product)}>
                    <StoreIcon name="heart" />
                  </button>
                </div>

                <div className="detail-price">
                  <b>{formatPrice(displayPrice)}</b>
                  {displayMrp > displayPrice ? <><del>{formatPrice(displayMrp)}</del><em>Save {discount}%</em></> : null}
                </div>
                <p className="tax-note">Inclusive of all taxes</p>
                <p className="detail-description">{product.shortDescription || product.description?.replace(/<[^>]*>/g, '') || 'A beautiful saree selected for its graceful drape, timeless colour and festive appeal.'}</p>

                {activeVariants.length > 0 && (
                  <div className="variant-row">
                    <span className="variant-label">COLOUR{selectedVariant ? `: ${selectedVariant.color}` : ''}</span>
                    <div className="variant-swatches">
                      {activeVariants.map((variant) => (
                        <button
                          key={variant.id || variant._id || variant.sku}
                          type="button"
                          className={`variant-swatch ${selectedVariant === variant ? 'active' : ''}`}
                          title={variant.color}
                          style={variant.colorCode ? { background: variant.colorCode } : undefined}
                          onClick={() => { setSelectedVariant(variant); setSelectedImage(0); }}
                        >
                          {!variant.colorCode && <span>{variant.color?.[0]}</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="quantity-row">
                  <span>QUANTITY</span>
                  <div className="quantity-control">
                    <button type="button" aria-label="Reduce quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))}><StoreIcon name="minus" /></button>
                    <b>{quantity}</b>
                    <button type="button" aria-label="Increase quantity" disabled={quantity >= displayStock} onClick={() => setQuantity((value) => Math.min(displayStock, value + 1))}><StoreIcon name="plus" /></button>
                  </div>
                  <small>{outOfStock ? 'Currently sold out' : `${displayStock} piece${displayStock === 1 ? '' : 's'} available`}</small>
                </div>

                <div className="product-actions-detail">
                  <button className="store-secondary-button full" type="button" disabled={outOfStock} onClick={buyNow}>BUY NOW</button>
                  <button className="store-primary-button full" type="button" disabled={outOfStock} onClick={addProductToBag}>{outOfStock ? 'SOLD OUT' : added ? 'ADDED TO BAG ✓' : 'ADD TO BAG'}</button>
                </div>

                <p className="offer-line"><StoreIcon name="package" /> Free shipping on orders above {formatPrice(FREE_SHIPPING_THRESHOLD)}</p>

                <div className="trust-badges">
                  <div><StoreIcon name="lock" /><span>Secure Payments</span></div>
                  <div><StoreIcon name="refresh" /><span>{product.returnAvailable ? `${product.returnDays || 7}-Day Returns` : 'Quality Checked'}</span></div>
                  <div><StoreIcon name="check" /><span>{product.codAvailable ? 'Pay on Delivery' : 'Assured Quality'}</span></div>
                </div>

                <form className="delivery-check" onSubmit={checkDelivery}>
                  <div className="delivery-check-input">
                    <StoreIcon name="pin" />
                    <input value={pincode} onChange={(event) => setPincode(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Enter pincode to check delivery" />
                    <button type="submit" disabled={deliveryLoading}>{deliveryLoading ? '...' : 'CHECK'}</button>
                  </div>
                  {deliveryError && <p className="delivery-error">{deliveryError}</p>}
                  {delivery && (
                    <p className="delivery-result">
                      <StoreIcon name="truck" /> Delivered in {delivery.estimatedDays} business days.{' '}
                      {delivery.codAvailable ? 'Cash on Delivery available.' : 'Prepaid orders only for this item.'}
                    </p>
                  )}
                </form>

                <div className="product-accordion">
                  <div className="accordion-section">
                    <button type="button" onClick={() => toggleSection('description')}><span>DESCRIPTION</span><StoreIcon name="chevron" /></button>
                    {openSection === 'description' && (
                      <div className="accordion-body" dangerouslySetInnerHTML={{ __html: product.description || product.shortDescription || 'A beautiful saree selected for its graceful drape, timeless colour and festive appeal.' }} />
                    )}
                  </div>

                  {specRows.length > 0 && (
                    <div className="accordion-section">
                      <button type="button" onClick={() => toggleSection('specs')}><span>SPECIFICATIONS</span><StoreIcon name="chevron" /></button>
                      {openSection === 'specs' && (
                        <dl>
                          {specRows.map(([label, key]) => <div key={key}><dt>{label}</dt><dd>{product[key]}</dd></div>)}
                          {product.occasion?.length ? <div><dt>Occasion</dt><dd>{product.occasion.join(', ')}</dd></div> : null}
                          {product.blouse ? <div><dt>Blouse</dt><dd>{product.blouse}</dd></div> : null}
                          {product.sku ? <div><dt>Product Code</dt><dd>{product.sku}</dd></div> : null}
                        </dl>
                      )}
                    </div>
                  )}

                  <div className="accordion-section">
                    <button type="button" onClick={() => toggleSection('shipping')}><span>SHIPPING &amp; RETURNS</span><StoreIcon name="chevron" /></button>
                    {openSection === 'shipping' && (
                      <dl>
                        <div><dt>Cash on Delivery</dt><dd>{product.codAvailable ? 'Available' : 'Not available — prepaid only'}</dd></div>
                        <div><dt>Returns</dt><dd>{product.returnAvailable ? `${product.returnDays || 7}-day easy returns` : 'This item is not eligible for return'}</dd></div>
                        <div><dt>Exchange</dt><dd>{product.exchangeAvailable ? 'Available' : 'Not available'}</dd></div>
                      </dl>
                    )}
                  </div>

                  <div className="accordion-section">
                    <button type="button" onClick={() => toggleSection('policy')}><span>CARE &amp; POLICY</span><StoreIcon name="chevron" /></button>
                    {openSection === 'policy' && (
                      <div className="accordion-body">
                        <p>Dry clean recommended to preserve colour, weave and embellishments. Store folded in a cotton or muslin cloth, away from direct sunlight.</p>
                        <p>To raise a return or exchange request, reach out within the eligible return window from delivery via your <Link to="/account">account</Link> order history, or contact our support team.</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>

            <div className="mobile-buy-bar">
              <div className="mobile-buy-bar-price">
                <b>{formatPrice(displayPrice)}</b>
                {displayMrp > displayPrice ? <del>{formatPrice(displayMrp)}</del> : null}
              </div>
              <button className="store-secondary-button" type="button" disabled={outOfStock} onClick={buyNow}>BUY NOW</button>
              <button className="store-primary-button" type="button" disabled={outOfStock} onClick={addProductToBag}>{outOfStock ? 'SOLD OUT' : added ? 'ADDED ✓' : 'ADD TO BAG'}</button>
            </div>

            {related.length > 0 && (
              <section className="related-products">
                <h2>YOU MAY ALSO LIKE</h2>
                <div className="related-products-row">
                  {related.map((item) => <ProductCard key={item.id} product={item} />)}
                </div>
              </section>
            )}

            {bestSellersFiltered.length > 0 && (
              <section className="related-products">
                <h2>BEST SELLERS</h2>
                <div className="related-products-row">
                  {bestSellersFiltered.slice(0, 4).map((item) => <ProductCard key={item.id} product={item} />)}
                </div>
              </section>
            )}

            {lightboxOpen && (
              <div className="image-lightbox" onClick={() => setLightboxOpen(false)}>
                <button type="button" className="lightbox-close" aria-label="Close" onClick={() => setLightboxOpen(false)}><StoreIcon name="close" /></button>
                <img src={images[selectedImage] || images[0]} alt={product.name} onClick={(event) => event.stopPropagation()} />
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
