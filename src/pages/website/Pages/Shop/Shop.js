import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../../../lib/api';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import ProductCard from '../../../../components/store/ProductCard';
import StoreIcon from '../../../../components/store/StoreIcon';
import Listbox from '../../../../components/shared/form/Listbox';
import { scrollToTop } from '../../../../utils/scrollToTop';

const categoryOptions = ['All Sarees', 'Silk Sarees', 'Banarasi Sarees', 'Designer Sarees', 'Wedding Sarees', 'Party Wear Sarees'];
const colourOptions = ['Red', 'Pink', 'Green', 'Blue', 'Yellow', 'Black', 'Wine'];
const occasionOptions = ['Wedding', 'Haldi', 'Mehendi', 'Sangeet', 'Reception', 'Party'];

const primaryBtn = 'inline-flex min-h-[46px] items-center justify-center border border-terra bg-terra px-5 py-3 text-[10px] font-bold tracking-[0.14em] text-[#fffaf5] no-underline transition hover:border-wine hover:bg-wine disabled:cursor-not-allowed disabled:border-muted disabled:bg-muted';
const secondaryBtn = 'inline-flex min-h-[46px] items-center justify-center border border-ink bg-transparent px-5 py-3 text-[10px] font-bold tracking-[0.14em] text-ink no-underline transition hover:bg-ink hover:text-paper';

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
    scrollToTop();
  }

  function clearFilters() {
    setFilters({ category: '', fabric: '', occasion: '', colour: '', price: '', sort: 'newest', q: '' });
    setSearchParams({}, { replace: true });
    scrollToTop();
  }

  return (
    <div className="overflow-hidden bg-paper">
      <Header />
      <main className="bg-paper">
        <div className="border-b border-line bg-sand px-5 py-16 text-center md:px-10 md:py-20">
          <p className="mb-3 text-[10px] font-bold tracking-[0.19em] text-terra">VELU’S FASHTOWN</p>
          <h1 className="m-0 font-playfair text-[clamp(45px,5vw,72px)] font-medium leading-[.95] tracking-[-.06em] text-ink">Find your perfect <em>saree.</em></h1>
          <p className="mx-auto mb-0 mt-5 max-w-lg text-sm leading-6 text-muted">Handpicked drapes for weddings, festivals, evenings and everyday grace.</p>
        </div>
        <div className="mx-auto grid w-full max-w-[1530px] gap-10 px-[7vw] py-[clamp(45px,6vw,85px)] lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-[clamp(42px,6vw,96px)] max-[620px]:px-[18px]">
          <aside className={`h-max border border-line bg-[#fbf7f0] p-5 ${filterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="mb-5 flex items-center justify-between border-b border-line pb-4">
              <h2 className="m-0 text-[10px] font-bold tracking-[0.16em] text-ink">FILTERS</h2>
              <div className="flex items-center gap-3">
                <button type="button" className="border-0 bg-transparent p-0 text-[9px] font-bold tracking-[0.1em] text-terra" onClick={clearFilters}>CLEAR ALL</button>
                <button className="border-0 bg-transparent p-0 text-[9px] font-bold tracking-[0.1em] text-terra lg:hidden" type="button" onClick={() => setFilterOpen(false)}>CLOSE</button>
              </div>
            </div>
            <FilterSelect label="Category" value={filters.category} onChange={(value) => updateFilter('category', value)} options={categoryOptions.map((item) => [item === 'All Sarees' ? '' : item, item])} />
            <FilterSelect label="Fabric" value={filters.fabric} onChange={(value) => updateFilter('fabric', value)} options={[['', 'All fabrics'], ['Silk', 'Silk'], ['Organza', 'Organza'], ['Georgette', 'Georgette'], ['Chiffon', 'Chiffon'], ['Cotton', 'Cotton']]} />
            <FilterSelect label="Occasion" value={filters.occasion} onChange={(value) => updateFilter('occasion', value)} options={[['', 'All occasions'], ...occasionOptions.map((item) => [item, item])]} />
            <FilterSelect label="Colour" value={filters.colour} onChange={(value) => updateFilter('colour', value)} options={[['', 'All colours'], ...colourOptions.map((item) => [item, item])]} />
            <FilterSelect label="Price" value={filters.price} onChange={(value) => updateFilter('price', value)} options={[['', 'Any price'], ['under2500', 'Under ₹2,500'], ['2500to5000', '₹2,500 – ₹5,000'], ['above5000', 'Above ₹5,000']]} />
          </aside>
          <section className="min-w-0">
            <div className="mb-8 flex items-end justify-between gap-5 border-b border-line pb-6">
              <div>
                <p className="mb-3 text-[10px] font-bold tracking-[0.19em] text-terra">SAREE COLLECTION</p>
                <h2 className="m-0 font-playfair text-[clamp(32px,3.5vw,48px)] font-medium leading-none tracking-[-.05em] text-ink">{filters.q ? `Results for “${filters.q}”` : filters.occasion ? `${filters.occasion} Sarees` : 'All Sarees'}</h2>
                <span className="mt-3 block text-xs text-muted">{loading ? 'Loading collection…' : `${displayedProducts.length} styles found`}</span>
              </div>
              <div className="flex items-center gap-3">
                <button className="hidden items-center gap-2 border border-line bg-[#fbf7f0] px-3 py-2 text-[9px] font-bold tracking-[0.1em] text-ink lg:flex" type="button" onClick={() => setFilterOpen((open) => !open)}><StoreIcon name="filter" /> FILTER</button>
                <label className="flex items-center gap-2 whitespace-nowrap text-[9px] font-bold tracking-[0.1em] text-muted">Sort by<Listbox value={{ value: filters.sort, label: filters.sort === 'newest' ? 'Newest' : filters.sort === 'featured' ? 'Featured' : filters.sort === 'priceLow' ? 'Price: Low to High' : 'Price: High to Low' }} onChange={(option) => updateFilter('sort', option.value)} data={[{ value: 'newest', label: 'Newest' }, { value: 'featured', label: 'Featured' }, { value: 'priceLow', label: 'Price: Low to High' }, { value: 'priceHigh', label: 'Price: High to Low' }]} size="sm" /></label>
              </div>
            </div>
            {displayedProducts.length ? <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-5 md:gap-y-12 lg:grid-cols-4">{displayedProducts.map((product) => <ProductCard product={product} key={product.id} />)}</div> : <div className="mx-auto max-w-[610px] border border-line bg-[#fbf7f0] px-6 py-14 text-center md:px-12"><h3 className="m-0 font-playfair text-3xl font-medium tracking-[-.04em] text-ink">{loading ? 'Loading your collection…' : 'No sarees matched those filters.'}</h3><p className="mx-auto mb-6 mt-3 max-w-md text-sm leading-6 text-muted">{loading ? 'Just a moment.' : 'Try removing a filter or add new styles through the admin dashboard.'}</p>{!loading ? <><button className={`${secondaryBtn} mb-3`} type="button" onClick={clearFilters}>CLEAR FILTERS</button><Link className={primaryBtn} to="/admin">ADD SAREES</Link></> : null}</div>}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  const selectedOption = options.find(([optionValue]) => optionValue === value) || options[0];
  return (
    <label className="flex flex-col gap-2 border-b border-line py-4">
      <span className="text-[10px] font-bold tracking-[0.11em] text-ink">{label}</span>
      <Listbox value={{ value: selectedOption[0], label: selectedOption[1] }} onChange={(option) => onChange(option.value)} data={options.map(([optionValue, optionLabel]) => ({ value: optionValue, label: optionLabel }))} size="sm" />
    </label>
  );
}
