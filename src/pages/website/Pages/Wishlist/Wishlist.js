import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import ProductCard from '../../../../components/store/ProductCard';
import { useShop } from '../../../../context/ShopContext';
import './Wishlist.css';

export default function WishlistPage() {
  const { wishlist } = useShop();
  return <div className="storefront-shell"><Header /><main className="simple-page"><p className="eyebrow">SAVED FOR LATER</p><h1>Your <em>wishlist</em></h1>{wishlist.length ? <div className="shop-product-grid wishlist-grid">{wishlist.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="catalog-empty"><h3>Your wishlist is waiting for something beautiful.</h3><p>Save the sarees you love and return to them whenever you are ready.</p><Link className="store-primary-button" to="/shop?category=Sarees">EXPLORE SAREES</Link></div>}</main><Footer /></div>;
}

