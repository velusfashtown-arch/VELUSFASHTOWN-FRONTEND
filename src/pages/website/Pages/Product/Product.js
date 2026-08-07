import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../../../lib/api';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import StoreIcon from '../../../../components/store/StoreIcon';
import { formatPrice, useShop } from '../../../../context/ShopContext';
import './Product.css';

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(true);

  useEffect(() => { api.getProduct(id).then(({ product: item }) => setProduct(item)).catch((requestError) => setError(requestError.message || 'Unable to load this saree.')); }, [id]);
  const fallbackImage = '/images/Home/Banner/01.png';
  const images = useMemo(() => product?.images?.length ? product.images : [fallbackImage], [product]);

  function addProductToBag() {
    addToCart(product, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2500);
  }

  const isSaved = wishlist.some((item) => item.id === product?.id);
  const outOfStock = product && Number(product.stock) < 1;
  const discount = product?.compareAtPrice > product?.price ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;

  return <div className="storefront-shell"><Header /><main className="product-page">{error ? <div className="catalog-empty"><h3>{error}</h3><Link className="store-primary-button" to="/shop">BACK TO SHOP</Link></div> : !product ? <div className="catalog-empty"><h3>Loading your saree…</h3></div> : <>
    <div className="breadcrumbs"><Link to="/">HOME</Link><span>/</span><Link to="/shop?category=Sarees">SAREES</Link><span>/</span><b>{product.name}</b></div>
    <div className="product-detail-grid">
      <section className="product-gallery"><div className="product-main-image"><img src={images[selectedImage]} alt={product.name} onError={(event) => { event.currentTarget.src = fallbackImage; }} />{discount ? <span>{discount}% OFF</span> : null}</div><div className="product-thumbnails">{images.map((image, index) => <button key={`${image}-${index}`} className={selectedImage === index ? 'active' : ''} type="button" onClick={() => setSelectedImage(index)}><img src={image} alt={`${product.name} view ${index + 1}`} onError={(event) => { event.currentTarget.src = fallbackImage; }} /></button>)}</div></section>
      <section className="product-detail-content"><p className="eyebrow">{product.category || 'SAREE'}</p><h1>{product.name}</h1><div className="product-rating">★★★★★ <span>Curated saree collection</span></div><div className="detail-price"><b>{formatPrice(product.price)}</b>{product.compareAtPrice > product.price ? <><del>{formatPrice(product.compareAtPrice)}</del><em>Save {discount}%</em></> : null}</div><p className="tax-note">Inclusive of all taxes</p><p className="detail-description">{product.description || 'A beautiful saree selected for its graceful drape, timeless colour and festive appeal.'}</p>
        <div className="quantity-row"><span>QUANTITY</span><div className="quantity-control"><button type="button" aria-label="Reduce quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))}><StoreIcon name="minus" /></button><b>{quantity}</b><button type="button" aria-label="Increase quantity" disabled={quantity >= product.stock} onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))}><StoreIcon name="plus" /></button></div><small>{outOfStock ? 'Currently sold out' : `${product.stock} piece${product.stock === 1 ? '' : 's'} available`}</small></div>
        <div className="product-actions-detail"><button className="store-primary-button full" type="button" disabled={outOfStock} onClick={addProductToBag}>{outOfStock ? 'SOLD OUT' : added ? 'ADDED TO BAG ✓' : 'ADD TO BAG'}</button><button className={`detail-wishlist ${isSaved ? 'is-saved' : ''}`} type="button" onClick={() => toggleWishlist(product)}><StoreIcon name="heart" /> {isSaved ? 'SAVED' : 'SAVE'}</button></div>
        <div className="delivery-note"><StoreIcon name="truck" /><div><b>Free delivery on this order</b><span>Delivered across India. Easy support on WhatsApp.</span></div></div>
        <div className="product-accordion"><button type="button" onClick={() => setDetailsOpen((open) => !open)}><span>PRODUCT DETAILS</span><StoreIcon name="chevron" /></button>{detailsOpen ? <dl><div><dt>Fabric</dt><dd>{product.fabric || 'Premium fabric'}</dd></div><div><dt>Work</dt><dd>{product.work || 'Detailed craftsmanship'}</dd></div><div><dt>Colour</dt><dd>{product.colour || 'As shown'}</dd></div><div><dt>Occasion</dt><dd>{product.occasion?.join(', ') || 'Festive wear'}</dd></div>{product.blouse ? <div><dt>Blouse</dt><dd>{product.blouse}</dd></div> : null}{product.sku ? <div><dt>SKU</dt><dd>{product.sku}</dd></div> : null}</dl> : null}</div>
      </section>
    </div>
  </>}</main><Footer /></div>;
}
