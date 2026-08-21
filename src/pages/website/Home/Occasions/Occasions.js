import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const occasions = [
  { title: 'Haldi', image: '/images/Home/Banner/02.png', position: '68% center' },
  { title: 'Mehendi', image: '/images/Home/Banner/03.png', position: '72% center' },
  { title: 'Sangeet', image: '/images/Home/Banner/01.png', position: '69% center' },
  { title: 'Wedding', image: '/images/Home/Banner/04.png', position: '92% center' }
];

function OccasionCard({ occasion, index }) {
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
      to={`/shop?occasion=${occasion.title}`}
      className={`group block min-h-[205px] relative overflow-hidden bg-[#b76e52] p-0 text-center text-white no-underline max-[620px]:min-h-[160px] ${occasion.title !== 'Haldi' && occasion.title !== 'Wedding' ? 'translate-y-6 max-[620px]:translate-y-[14px]' : 'translate-y-0'} transition-[opacity,transform] duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <img
        src={occasion.image}
        alt=""
        className={`h-full w-full object-cover saturate-[.85] transition-all duration-[800ms] group-hover:scale-[1.12] group-hover:saturate-[1.1] ${occasion.title === 'Haldi' ? 'occasion-filter-haldi' : occasion.title === 'Mehendi' ? 'occasion-filter-mehendi' : occasion.title === 'Sangeet' ? 'occasion-filter-sangeet' : 'occasion-filter-wedding'}`}
        style={{ objectPosition: occasion.position }}
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent transition-opacity duration-500 group-hover:opacity-80" />
      <span className="absolute z-[1] bottom-[17px] left-0 right-0 font-playfair font-medium text-[28px] tracking-[-.03em] transition-all duration-300 group-hover:tracking-[-.01em] group-hover:scale-105 max-[620px]:bottom-[13px] max-[620px]:text-2xl">{occasion.title}</span>
    </Link>
  );
}

export default function Occasions() {
  const [contentVisible, setContentVisible] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setContentVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (contentRef.current) observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-[clamp(65px,8vw,120px)] px-[7vw] bg-[#e7d7c6] grid grid-cols-[1fr_1.52fr] items-center gap-[clamp(38px,7vw,120px)] max-[900px]:grid-cols-1 max-[620px]:px-[18px] max-[620px]:py-[61px] max-[620px]:gap-[33px]">
      <div
        ref={contentRef}
        className={`max-w-[410px] max-[900px]:max-w-[520px] transition-[opacity,transform] duration-700 ${contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      >
        <p className="text-terra font-bold text-[10px] tracking-[0.19em] mb-[12px]">DRESS FOR THE MOMENT</p>
        <h2 className="m-0 font-playfair font-medium tracking-[-.055em] leading-[.95] text-[clamp(42px,4.15vw,66px)] max-[620px]:text-[42px]">
          Every celebration<br /><em className="font-medium not-italic">has a colour.</em>
        </h2>
        <p className="text-[#756b65] text-sm leading-[1.75] my-6 mb-[31px] max-[620px]:my-[18px] max-[620px]:mb-[25px]">
          From the joyful yellow of haldi to the shimmer of a reception, discover sarees styled for every cherished memory.
        </p>
        <Link className="inline-flex items-center gap-[15px] border-0 p-0 bg-none text-[10px] font-bold tracking-[0.16em] text-ink pb-[9px] border-b border-ink no-underline group" to="/shop?category=Sarees">
          EXPLORE OCCASIONS <span className="w-[22px] h-[22px] transition-transform duration-200 group-hover:translate-x-1"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg></span>
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-[11px] max-[620px]:gap-2 max-[900px]:max-w-[600px] max-[900px]:w-full max-[900px]:justify-self-center">
        {occasions.map((occasion, i) => (
          <OccasionCard key={occasion.title} occasion={occasion} index={i} />
        ))}
      </div>
    </section>
  );
}