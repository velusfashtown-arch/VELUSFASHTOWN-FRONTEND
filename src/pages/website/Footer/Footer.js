import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  function joinNewsletter(event) {
    event.preventDefault();
    if (email.trim()) setJoined(true);
  }

  return (
    <footer className="bg-[#1e1b18] text-white pt-[65px] pb-[19px] px-[8vw]">
      <div className="max-w-[1370px] mx-auto grid grid-cols-[1.45fr_0.7fr_0.8fr_1.35fr] gap-[55px] max-md:grid-cols-[1.3fr_1fr_1fr] max-md:[&>:last-child]:col-span-3 max-[620px]:grid-cols-2 max-[620px]:gap-[34px_21px] max-[620px]:px-6 max-[620px]:py-12 max-[620px]:[&>:first-child]:col-span-2 max-[620px]:[&>:last-child]:col-span-2">
        {/* Store identity */}
        <div>
          <Link to="/" className="inline-flex mb-[18px]" aria-label="Velu's Fashtown home">
            <img src="/images/Logo/LOGO.png" alt="Velu's Fashtown" className="h-auto w-[120px] brightness-[10]" />
          </Link>
          <p className="text-white/60 leading-[1.65] text-xs max-w-[260px]">Timeless Indian fashion and beautiful sarees for every occasion.</p>
        </div>
        {/* Shop Links */}
        <div>
          <h3 className="text-[10px] tracking-[0.15em] mt-[4px] mb-[18px] text-white/80">SHOP</h3>
          <Link to="/shop?category=Sarees" className="block text-white/50 no-underline text-xs leading-[2.1] hover:text-white transition-colors">Sarees</Link>
          <Link to="/shop?fabric=Silk" className="block text-white/50 no-underline text-xs leading-[2.1] hover:text-white transition-colors">Silk Sarees</Link>
          <Link to="/shop?occasion=Wedding" className="block text-white/50 no-underline text-xs leading-[2.1] hover:text-white transition-colors">Wedding Sarees</Link>
          <Link to="/shop?sort=newest" className="block text-white/50 no-underline text-xs leading-[2.1] hover:text-white transition-colors">New Arrivals</Link>
        </div>
        {/* Help Links */}
        <div>
          <h3 className="text-[10px] tracking-[0.15em] mt-[4px] mb-[18px] text-white/80">HELP</h3>
          <Link to="/cart" className="block text-white/50 no-underline text-xs leading-[2.1] hover:text-white transition-colors">Shopping Bag</Link>
          <Link to="/wishlist" className="block text-white/50 no-underline text-xs leading-[2.1] hover:text-white transition-colors">Wishlist</Link>
          <a href="mailto:hello@velusfashtown.com" className="block text-white/50 no-underline text-xs leading-[2.1] hover:text-white transition-colors">Contact Us</a>
          <Link to="/admin" className="block text-white/50 no-underline text-xs leading-[2.1] hover:text-white transition-colors">Admin</Link>
        </div>
        {/* Newsletter */}
        <div>
          <h3 className="text-[10px] tracking-[0.15em] mt-[4px] mb-[18px] text-white/80">STAY IN THE KNOW</h3>
          <p className="text-white/50 leading-[1.65] text-xs max-w-[260px]">Sign up for new drops, special offers and festive inspiration.</p>
          <form className="flex border-b border-white/30 max-w-[330px] mt-[19px]" onSubmit={joinNewsletter}>
            <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} aria-label="Email address" placeholder="Your email address" className="min-w-0 flex-1 py-[10px] border-0 outline-none text-white bg-transparent text-xs placeholder:text-white/40" />
            <button type="submit" className="border-0 p-0 text-[#f3c997] bg-none font-bold tracking-[0.12em] text-[9px] cursor-pointer hover:text-white transition-colors">{joined ? 'THANK YOU' : 'JOIN'}</button>
          </form>
        </div>
      </div>
      <div className="max-w-[1370px] mx-auto mt-[61px] pt-[17px] border-t border-white/10 flex justify-between text-[9px] tracking-[0.12em] text-white/40 max-[620px]:mt-10 max-[620px]:gap-3 max-[620px]:text-[8px]">
        <span>&copy; {new Date().getFullYear()} Velu's Fashtown</span>
        <span>MADE WITH LOVE IN INDIA</span>
      </div>
    </footer>
  );
}