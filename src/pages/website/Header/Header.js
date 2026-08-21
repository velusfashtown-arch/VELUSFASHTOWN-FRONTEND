import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';
import { useAuth } from '../../../context/AuthContext';
import StoreIcon from '../../../components/store/StoreIcon';

const navigation = [
  { label: 'SALE', to: '/shop?sort=priceLow' },
  { label: 'SAREES', to: '/shop?category=Sarees' },
  { label: 'SILK SAREES', to: '/shop?fabric=Silk' },
  { label: 'OCCASIONS', to: '/shop?occasion=Wedding' },
  { label: 'NEW ARRIVALS', to: '/shop?sort=newest' }
];

const iconButtonClass = 'grid h-10 w-10 place-items-center rounded-full border border-transparent bg-transparent p-2 text-ink transition hover:border-line hover:bg-sand focus-visible:outline-terra';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);
  const { cartCount } = useShop();
  const { isLoggedIn, profile, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setAccountOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [menuOpen]);

  function openMenu() {
    setSearchOpen(false);
    setAccountOpen(false);
    setMenuOpen(true);
  }

  function openSearch() {
    setMenuOpen(false);
    setAccountOpen(false);
    setSearchOpen((open) => !open);
  }

  function submitSearch(event) {
    event.preventDefault();
    const search = query.trim();
    if (!search) {
      searchInputRef.current?.focus();
      return;
    }
    navigate(`/shop?q=${encodeURIComponent(search)}`);
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <>
      <div className="flex h-8 items-center overflow-hidden bg-wine text-white" aria-label="Current store offers">
        <div className="flex min-w-max items-center gap-4 px-5 text-[9px] font-bold tracking-[0.15em] md:w-full md:justify-center lg:animate-[ticker_22s_linear_infinite]">
          <span>EXTRA 10% OFF ON YOUR FIRST ORDER</span>
          <span className="text-[#f3c997]" aria-hidden="true">◆</span>
          <span>FREE SHIPPING ON ORDERS ABOVE ₹999</span>
          <span className="hidden text-[#f3c997] md:inline" aria-hidden="true">◆</span>
          <span className="hidden md:inline">FESTIVE SAREE COLLECTION IS HERE</span>
        </div>
      </div>

      <header className="sticky top-0 z-30 grid min-h-[76px] grid-cols-[1fr_auto_1fr] items-center border-b border-line bg-paper/95 px-4 backdrop-blur md:px-6 lg:grid-cols-[auto_1fr_auto] lg:px-[4.5vw]">
        <button className={`${iconButtonClass} justify-self-start lg:hidden`} type="button" aria-label="Open menu" aria-expanded={menuOpen} onClick={openMenu}>
          <StoreIcon name="menu" />
        </button>

        <Link to="/" className="inline-flex w-max justify-self-center lg:justify-self-start" aria-label="Velu's Fashtown home">
          <img src="/images/Logo/LOGO.png" alt="Velu's Fashtown" className="h-auto w-[110px] lg:w-[130px]" />
        </Link>

        <nav className="hidden h-full items-center justify-self-center gap-[clamp(16px,2.15vw,35px)] lg:flex" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link key={item.label} to={item.to} className="group relative inline-flex h-full items-center text-[10px] font-bold tracking-[0.11em] text-ink no-underline transition-colors hover:text-terra">
              {item.label}
              <span className="absolute bottom-[25px] left-0 h-px w-0 bg-terra transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-self-end gap-1 sm:gap-2">
          <button className={iconButtonClass} type="button" aria-label="Search products" aria-expanded={searchOpen} onClick={openSearch}>
            <StoreIcon name="search" />
          </button>

          <Link className={`${iconButtonClass} hidden lg:grid`} to="/wishlist" aria-label="Wishlist">
            <StoreIcon name="heart" />
          </Link>

          {isLoggedIn ? (
            <div className="relative hidden lg:block">
              <button className="flex h-10 max-w-[145px] items-center gap-2 rounded-full border border-transparent px-3 text-left text-ink transition hover:border-line hover:bg-sand" type="button" aria-expanded={accountOpen} onClick={() => setAccountOpen((open) => !open)}>
                <span className="h-4 w-4 shrink-0"><StoreIcon name="user" /></span>
                <span className="truncate text-[10px] font-bold tracking-[0.08em]">{profile?.name?.split(' ')[0] || 'ACCOUNT'}</span>
              </button>
              {accountOpen && (
                <div className="absolute right-0 top-[calc(100%+10px)] z-40 w-52 border border-line bg-paper p-2 shadow-[0_18px_35px_rgba(36,27,24,.14)]">
                  <p className="px-3 pb-2 pt-1 text-[9px] font-bold tracking-[0.12em] text-muted">SIGNED IN AS {profile?.name || 'CUSTOMER'}</p>
                  <Link to="/account" className="block px-3 py-2.5 text-[11px] font-bold tracking-[0.08em] text-ink no-underline transition hover:bg-sand hover:text-terra">MY ACCOUNT</Link>
                  <Link to="/wishlist" className="block px-3 py-2.5 text-[11px] font-bold tracking-[0.08em] text-ink no-underline transition hover:bg-sand hover:text-terra">WISHLIST</Link>
                  <button className="w-full px-3 py-2.5 text-left text-[11px] font-bold tracking-[0.08em] text-terra transition hover:bg-sand" type="button" onClick={handleLogout}>SIGN OUT</button>
                </div>
              )}
            </div>
          ) : (
            <Link className={`${iconButtonClass} hidden lg:grid`} to="/login" aria-label="Sign in">
              <StoreIcon name="user" />
            </Link>
          )}

          <Link className={`${iconButtonClass} relative`} to="/cart" aria-label={`Shopping bag, ${cartCount} items`}>
            <StoreIcon name="bag" />
            {cartCount > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-terra px-1 text-[8px] font-bold text-white">{cartCount}</span>}
          </Link>
        </div>
      </header>

      {searchOpen && (
        <div className="relative z-20 border-b border-line bg-[#fffaf5] px-4 py-4 md:px-6 lg:px-[8vw]">
          <form className="mx-auto flex max-w-4xl items-center gap-3" role="search" onSubmit={submitSearch}>
            <span className="h-5 w-5 shrink-0 text-terra"><StoreIcon name="search" /></span>
            <input ref={searchInputRef} value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search sarees" placeholder="Search sarees, colours, fabrics and occasions..." className="min-w-0 flex-1 border-0 bg-transparent py-2 text-sm text-ink outline-none placeholder:text-muted" />
            <button className="hidden border-0 bg-transparent px-2 py-2 text-[10px] font-bold tracking-[0.12em] text-terra sm:block" type="submit">SEARCH</button>
            <button className={iconButtonClass} type="button" aria-label="Close search" onClick={() => setSearchOpen(false)}><StoreIcon name="close" /></button>
          </form>
        </div>
      )}

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 h-full w-full bg-black/35" type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} />
          <aside className="relative flex h-full w-[min(355px,88vw)] flex-col bg-[#fffaf5] px-6 py-5 text-ink shadow-2xl" role="dialog" aria-modal="true" aria-label="Mobile navigation">
            <div className="flex items-center justify-between border-b border-line pb-5">
              <Link to="/" onClick={() => setMenuOpen(false)} className="inline-flex" aria-label="Velu's Fashtown home">
                <img src="/images/Logo/LOGO.png" alt="Velu's Fashtown" className="h-auto w-[110px]" />
              </Link>
              <button className={iconButtonClass} type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)}><StoreIcon name="close" /></button>
            </div>

            <nav className="mt-4 grid" aria-label="Mobile navigation links">
              {navigation.map((item) => <Link key={item.label} to={item.to} onClick={() => setMenuOpen(false)} className="border-b border-line py-4 text-sm font-bold tracking-[0.1em] text-ink no-underline transition hover:text-terra">{item.label}</Link>)}
              <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="border-b border-line py-4 text-sm font-bold tracking-[0.1em] text-ink no-underline transition hover:text-terra">WISHLIST</Link>
              <Link to="/cart" onClick={() => setMenuOpen(false)} className="border-b border-line py-4 text-sm font-bold tracking-[0.1em] text-ink no-underline transition hover:text-terra">SHOPPING BAG ({cartCount})</Link>
            </nav>

            <div className="mt-auto border-t border-line pt-5">
              {isLoggedIn ? (
                <>
                  <p className="m-0 text-[10px] font-bold tracking-[0.12em] text-muted">SIGNED IN AS</p>
                  <p className="mb-4 mt-2 text-sm font-bold text-ink">{profile?.name || 'CUSTOMER'}</p>
                  <Link to="/account" onClick={() => setMenuOpen(false)} className="mb-3 block text-[10px] font-bold tracking-[0.12em] text-ink no-underline">MY ACCOUNT</Link>
                  <button className="border-0 bg-transparent p-0 text-[10px] font-bold tracking-[0.12em] text-terra" type="button" onClick={handleLogout}>SIGN OUT</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMenuOpen(false)} className="inline-flex min-h-[46px] w-full items-center justify-center border border-terra bg-terra px-5 py-3 text-[10px] font-bold tracking-[0.14em] text-[#fffaf5] no-underline transition hover:border-wine hover:bg-wine">SIGN IN / CREATE ACCOUNT</Link>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}