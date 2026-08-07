import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../../../lib/api';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import ProductCard from '../../../../components/store/ProductCard';
import StoreIcon from '../../../../components/store/StoreIcon';
import Listbox from '../../../../components/shared/form/Listbox';
import './Shop.css';

const categoryOptions = ['All Sarees', 'Silk Sarees', 'Banarasi Sarees', 'Designer Sarees', 'Wedding Sarees', 'Party Wear Sarees'];
const colourOptions = ['Red', 'Pink', 'Green', 'Blue', 'Yellow', 'Black', 'Wine'];
const occasionOptions = ['Wedding', 'Haldi', 'Mehendi', 'Sangeet', 'Reception', 'Party'];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    fabric: searchParams.get('fabric') || '',
    occasion: searchParams.get('occasion') || '',
    colour: '',
    price: '',
    sort: searchParams.get('sort') || 'newest',
    q: searchParams.get('q') || ''
  });

  useEffect(() => {
    setLoading(true);
    api.listProducts({ sort: 'newest' }).then(({ products: productList }) => setProducts(productList || [])).catch(() => setProducts([])).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setFilters((current) => ({ ...current, category: searchParams.get('category') || '', fabric: searchParams.get('fabric') || '', occasion: searchParams.get('occasion') || '', sort: searchParams.get('sort') || current.sort, q: searchParams.get('q') || '' }));
  }, [searchParams]);

  const displayedProducts = useMemo(() => {
    const normalizedQuery = filters.q.trim().toLowerCase();
    const items = products.filter((product) => {
      const categoryMatch = !filters.category || product.category?.toLowerCase() === filters.category.toLowerCase() || product.name?.toLowerCase().includes(filters.category.toLowerCase().replace(' sarees', ''));
      const fabricMatch = !filters.fabric || product.fabric?.toLowerCase().includes(filters.fabric.toLowerCase());
      const occasionMatch = !filters.occasion || product.occasion?.some((item) => item.toLowerCase() === filters.occasion.toLowerCase());
      const colourMatch = !filters.colour || product.colour?.toLowerCase().includes(filters.colour.toLowerCase());
      const queryMatch = !normalizedQuery || [product.name, product.category, product.fabric, product.work, product.colour].some((value) => value?.toLowerCase().includes(normalizedQuery));
      const price = Number(product.price || 0);
      const priceMatch = !filters.price || (filters.price === 'under2500' && price < 2500) || (filters.price === '2500to5000' && price >= 2500 && price <= 5000) || (filters.price === 'above5000' && price > 5000);
      return categoryMatch && fabricMatch && occasionMatch && colourMatch && queryMatch && priceMatch;
    });
    return [...items].sort((left, right) => {
      if (filters.sort === 'priceLow') return left.price - right.price;
      if (filters.sort === 'priceHigh') return right.price - left.price;
      if (filters.sort === 'featured') return Number(right.isFeatured) - Number(left.isFeatured);
      return new Date(right.createdAt || 0) - new Date(left.createdAt || 0);
    });
  }, [filters, products]);

  function updateFilter(key, value) {
    const next = { ...filters, [key]: value };
    setFilters(next);
    const params = {};
    ['category', 'fabric', 'occasion', 'sort', 'q'].forEach((filter) => { if (next[filter]) params[filter] = next[filter]; });
    setSearchParams(params, { replace: true });
  }

  function clearFilters() {
    setFilters({ category: '', fabric: '', occasion: '', colour: '', price: '', sort: 'newest', q: '' });
    setSearchParams({}, { replace: true });
  }

  return (
    <div className="storefront-shell">
      <Header />
      <main className="shop-page">
        <div className="shop-hero"><p className="eyebrow">VELU’S FASHTOWN</p><h1>Find your perfect <em>saree.</em></h1><p>Handpicked drapes for weddings, festivals, evenings and everyday grace.</p></div>
        <div className="shop-content">
          <aside className={`filter-sidebar ${filterOpen ? 'is-open' : ''}`}>
            <div className="filter-top"><h2>FILTERS</h2><div className="filter-top-actions"><button type="button" onClick={clearFilters}>CLEAR ALL</button><button className="filter-close" type="button" onClick={() => setFilterOpen(false)}>CLOSE</button></div></div>
            <FilterSelect label="Category" value={filters.category} onChange={(value) => updateFilter('category', value)} options={categoryOptions.map((item) => [item === 'All Sarees' ? '' : item, item])} />
            <FilterSelect label="Fabric" value={filters.fabric} onChange={(value) => updateFilter('fabric', value)} options={[['', 'All fabrics'], ['Silk', 'Silk'], ['Organza', 'Organza'], ['Georgette', 'Georgette'], ['Chiffon', 'Chiffon'], ['Cotton', 'Cotton']]} />
            <FilterSelect label="Occasion" value={filters.occasion} onChange={(value) => updateFilter('occasion', value)} options={[['', 'All occasions'], ...occasionOptions.map((item) => [item, item])]} />
            <FilterSelect label="Colour" value={filters.colour} onChange={(value) => updateFilter('colour', value)} options={[['', 'All colours'], ...colourOptions.map((item) => [item, item])]} />
            <FilterSelect label="Price" value={filters.price} onChange={(value) => updateFilter('price', value)} options={[['', 'Any price'], ['under2500', 'Under ₹2,500'], ['2500to5000', '₹2,500 – ₹5,000'], ['above5000', 'Above ₹5,000']]} />
          </aside>
          <section className="product-listing">
            <div className="listing-toolbar"><div><p className="eyebrow">SAREE COLLECTION</p><h2>{filters.q ? `Results for “${filters.q}”` : filters.occasion ? `${filters.occasion} Sarees` : 'All Sarees'}</h2><span>{loading ? 'Loading collection…' : `${displayedProducts.length} styles found`}</span></div><div className="listing-actions"><button className="mobile-filter-button" type="button" onClick={() => setFilterOpen((open) => !open)}><StoreIcon name="filter" /> FILTER</button><label>Sort by<Listbox value={{ value: filters.sort, label: filters.sort === 'newest' ? 'Newest' : filters.sort === 'featured' ? 'Featured' : filters.sort === 'priceLow' ? 'Price: Low to High' : 'Price: High to Low' }} onChange={(option) => updateFilter('sort', option.value)} data={[{ value: 'newest', label: 'Newest' }, { value: 'featured', label: 'Featured' }, { value: 'priceLow', label: 'Price: Low to High' }, { value: 'priceHigh', label: 'Price: High to Low' }]} size="sm" /></label></div></div>
            {displayedProducts.length ? <div className="shop-product-grid">{displayedProducts.map((product) => <ProductCard product={product} key={product.id} />)}</div> : <div className="catalog-empty"><h3>{loading ? 'Loading your collection…' : 'No sarees matched those filters.'}</h3><p>{loading ? 'Just a moment.' : 'Try removing a filter or add new styles through the admin dashboard.'}</p>{!loading ? <><button className="store-secondary-button" type="button" onClick={clearFilters}>CLEAR FILTERS</button><Link className="store-primary-button" to="/admin">ADD SAREES</Link></> : null}</div>}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  const selectedOption = options.find(([optionValue]) => optionValue === value) || options[0];
  return <label className="filter-field"><span>{label}</span><Listbox value={{ value: selectedOption[0], label: selectedOption[1] }} onChange={(option) => onChange(option.value)} data={options.map(([optionValue, optionLabel]) => ({ value: optionValue, label: optionLabel }))} size="sm" /></label>;
}
