import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const collections = [
  { title: 'Silk Sarees', caption: 'Rich tradition, timeless drapes', image: '/images/Home/Banner/02.png', position: '76% center', href: '/shop?fabric=Silk' },
  { title: 'Wedding Sarees', caption: 'For your most cherished moments', image: '/images/Home/Banner/01.png', position: '71% center', href: '/shop?occasion=Wedding' },
  { title: 'Festive Drapes', caption: 'A little shimmer for every evening', image: '/images/Home/Banner/03.png', position: '78% center', href: '/shop?occasion=Party' },
  { title: 'Heritage Weaves', caption: 'Effortless beauty, every day', image: '/images/Home/Banner/04.png', position: '86% center', href: '/shop?category=Sarees' }
];

function CollectionCard({ collection, index }) {
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
className={`group relative block min-h-[438px] overflow-hidden bg-[#8b5145] text-left text-white no-underline max-[900px]:min-h-[350px] max-[620px]:min-h-[270px] transition-[opacity,transform] duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
      to={collection.href}
    >
      <img
        src={collection.image}
        alt=""
        className="absolute inset-0 h-full w-full scale-[1.04] object-cover transition-all duration-[800ms] group-hover:scale-[1.15] group-hover:saturate-[1.1]"
        style={{ objectPosition: collection.position }}
      />
      <span className="absolute inset-0 bg-[linear-gradient(0deg,rgba(30,10,5,.72),rgba(30,10,5,0)_60%)] transition-opacity duration-500 group-hover:opacity-80" />
      <span className="absolute inset-0 bg-[linear-gradient(0deg,rgba(167,78,62,.15),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <span className="absolute left-[23px] bottom-[23px] flex flex-col gap-[5px] max-[620px]:left-4 max-[620px]:bottom-4">
        <small className="text-[9px] font-bold tracking-[0.16em] text-[#f2d6b5]">THE EDIT</small>
        <strong className="font-playfair font-medium text-[29px] tracking-[-.04em] transition-all duration-300 group-hover:tracking-[-.02em] max-[620px]:text-2xl">{collection.title}</strong>
        <em className="text-[11px] font-medium not-italic text-white/85 max-[620px]:hidden">{collection.caption}</em>
      </span>
    </Link>
  );
}

export default function Collections() {
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

  return (
    <section className="py-[clamp(65px,8vw,120px)] px-[7vw] max-[620px]:px-[18px] max-[620px]:py-[61px]" id="collections">
      <div
        ref={headerRef}
className={`text-center mb-[38px] max-[620px]:mb-[25px] transition-[opacity,transform] duration-700 ${headerVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      >
        <p className="text-terra font-bold text-[10px] tracking-[0.19em] mb-[11px]">CURATED FOR YOU</p>
        <h2 className="m-0 font-playfair font-medium tracking-[-.055em] leading-[.95] text-[clamp(42px,4.15vw,66px)] max-[620px]:text-[42px]">Shop the <em className="not-italic font-medium">edit</em></h2>
      </div>
      <div className="mx-auto grid max-w-[1350px] grid-cols-4 gap-3 max-[900px]:grid-cols-2 max-[620px]:gap-2">
        {collections.map((collection, i) => (
          <CollectionCard key={collection.title} collection={collection} index={i} />
        ))}
      </div>
    </section>
  );
}

