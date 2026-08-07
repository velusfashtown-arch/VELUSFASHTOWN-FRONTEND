import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import StoreIcon from '../../../../components/store/StoreIcon';
import { formatPrice, useShop } from '../../../../context/ShopContext';
import './Cart.css';

export default function CartPage() {
  const { cart, subtotal, updateQuantity, removeFromCart } = useShop();
  const shipping = subtotal >= 999 ? 0 : 99;
  const discount = subtotal >= 4999 ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal + shipping - discount;
  const fallbackImage = '/images/Home/Banner/01.png';

  return <div className="storefront-shell"><Header /><main className="cart-page"><div className="page-title"><p className="eyebrow">YOUR SELECTION</p><h1>Shopping <em>bag</em></h1></div>{cart.length ? <div className="cart-layout"><section className="cart-items">{cart.map((item) => <article className="cart-item" key={item.id}><Link to={`/product/${item.id}`}><img src={item.images?.[0] || fallbackImage} alt={item.name} onError={(event) => { event.currentTarget.src = fallbackImage; }} /></Link><div className="cart-item-info"><p>{item.fabric || item.category || 'SAREE'}</p><Link to={`/product/${item.id}`}>{item.name}</Link><b>{formatPrice(item.price)}</b><div className="cart-item-controls"><div className="quantity-control"><button type="button" aria-label="Reduce quantity" onClick={() => updateQuantity(item.id, item.quantity - 1)}><StoreIcon name="minus" /></button><b>{item.quantity}</b><button type="button" aria-label="Increase quantity" onClick={() => updateQuantity(item.id, item.quantity + 1)}><StoreIcon name="plus" /></button></div><button className="remove-item" type="button" onClick={() => removeFromCart(item.id)}><StoreIcon name="trash" /> REMOVE</button></div></div><strong>{formatPrice(item.price * item.quantity)}</strong></article>)}</section><OrderSummary subtotal={subtotal} shipping={shipping} discount={discount} total={total} action={<Link className="store-primary-button full" to="/checkout">PROCEED TO CHECKOUT</Link>} /></div> : <div className="catalog-empty"><h3>Your bag is waiting for something beautiful.</h3><p>Explore our curated saree collection and add the styles you love.</p><Link className="store-primary-button" to="/shop?category=Sarees">SHOP SAREES</Link></div>}</main><Footer /></div>;
}

export function OrderSummary({ subtotal, shipping, discount, total, action }) {
  return <aside className="order-summary"><h2>ORDER SUMMARY</h2><div><span>Subtotal</span><b>{formatPrice(subtotal)}</b></div><div><span>Shipping</span><b>{shipping ? formatPrice(shipping) : 'FREE'}</b></div>{discount ? <div className="summary-discount"><span>Festive savings</span><b>− {formatPrice(discount)}</b></div> : null}<div className="summary-total"><span>Total</span><b>{formatPrice(total)}</b></div><small>Inclusive of all taxes</small>{action}</aside>;
}
