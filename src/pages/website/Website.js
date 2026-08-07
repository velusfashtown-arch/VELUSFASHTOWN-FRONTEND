import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import HomePage from './Home/Home';

export default function Website() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listProducts({ sort: 'featured' })
      .then(({ products: productList }) => setProducts(productList || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-paper">
      <Header />
      <main className="flex-1 flex flex-col">
        <HomePage products={products} loading={loading} />
      </main>
      <Footer />
    </div>
  );
}
