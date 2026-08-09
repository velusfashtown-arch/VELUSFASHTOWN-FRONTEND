import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../../../components/store/ProductCard';

const signatureEdits = [
  { title: 'Lavender Banarasi', note: 'A soft celebration in silk', image: '/images/Home/Banner/02.png', to: '/shop?fabric=Silk' },
  { title: 'Royal Festive Edit', note: 'Drapes made for the spotlight', image: '/images/Home/Banner/01.png', to: '/shop?occasion=Wedding' },
  { title: 'Heritage Pink Weaves', note: 'Radiance in every detail', image: '/images/Home/Banner/04.png', to: '/shop?category=Sarees' }
];

function ShimmerSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-md bg-[linear-gradient(90deg,#ece2d4_25%,#f5efe6_50%,#ece2d4_75%)] bg-[length:200%_100%] animate-shimmer">
      <div className="aspect-[4/5]" />
      <div className="mt-4 h-3 w-2/5 rounded bg-sand/80" />
      <div className="mt-2 h-4 w-4/5 rounded bg-sand/80" />
    </div>
  );
}

function SignatureCard({ edit, index }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Link
      ref={cardRef}
      to={edit.to}
className={`group relative min-h-[300px] overflow-hidden bg-sand text-white no-underline md:min-h-[365px] transition-[opacity,transform] duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <img
        src={edit.image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-all duration-[800ms] group-hover:scale-110 group-hover:saturate-[1.1]"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
      <span className="absolute inset-x-5 bottom-5 z-[1] grid gap-1">
        <small className="text-[9px] font-bold tracking-[0.15em] text-[#f3d09e]">VELU'S SIGNATURE</small>
        <strong className="font-playfair text-3xl font-medium tracking-[-.04em] transition-all duration-300 group-hover:tracking-[-.02em]">{edit.title}</strong>
        <em className="text-xs not-italic text-white/85">{edit.note}</em>
      </span>
    </Link>
  );
}

export default function NewArrivals({ products, loading }) {
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  const featuredProducts = useMemo(
    () => products
      .filter((product) => product.isFeatured)
      .concat(products.filter((product) => !product.isFeatured))
      .slice(0, 4),
    [products]
  );

  return (
    <section className="mx-auto max-w-[1530px] px-[7vw] py-[clamp(65px,8vw,120px)] max-[620px]:px-[18px] max-[620px]:py-[61px]" id="new-arrivals">
      <div
        ref={headerRef}
className={`mb-[37px] flex items-end justify-between max-[620px]:mb-[26px] transition-[opacity,transform] duration-700 ${headerVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      >
        <div>
          <p className="mb-3 text-[10px] font-bold tracking-[0.19em] text-terra">JUST DROPPED</p>
          <h2 className="m-0 font-playfair text-[clamp(42px,4.15vw,66px)] font-medium leading-[.95] tracking-[-.055em]">New <em className="not-italic font-medium">arrivals</em></h2>
        </div>
        <Link className="group mb-[7px] inline-flex items-center gap-[15px] border-b border-ink bg-transparent pb-[9px] text-[10px] font-bold tracking-[0.16em] text-ink no-underline max-[620px]:mb-[3px] max-[620px]:gap-[6px] max-[620px]:text-[8px]" to="/shop?sort=newest">
          VIEW ALL <span className="h-[22px] w-[22px] transition-transform duration-200 group-hover:translate-x-1 max-[620px]:hidden"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg></span>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5" aria-label="Loading new arrivals">
          {[0, 1, 2, 3].map((item) => <ShimmerSkeleton key={item} />)}
        </div>
      ) : featuredProducts.length ? (
        <div className="grid grid-cols-4 gap-[17px] max-[900px]:grid-cols-2 max-[900px]:gap-y-[37px] max-[620px]:gap-[11px] max-[620px]:gap-y-[30px]">
          {featuredProducts.map((product, i) => (
<div
              key={product.id}
              className="transition-[opacity,transform] duration-700 opacity-100 translate-y-0"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-3">
          {signatureEdits.map((edit, i) => (
            <SignatureCard key={edit.title} edit={edit} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
