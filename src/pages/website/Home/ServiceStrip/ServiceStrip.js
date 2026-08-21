import React, { useRef, useEffect, useState } from 'react';

function ServiceItem({ icon, title, description, index, border }) {
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );
    if (itemRef.current) observer.observe(itemRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={itemRef}
      className={`flex flex-col items-center max-[620px]:items-start transition-[opacity,transform] duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${border}`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="mb-[11px] inline-flex h-6 w-6 items-center justify-center text-[#f3c997] transition-all duration-300 hover:scale-110 hover:text-[#f8d9aa] max-[620px]:mb-2">
        {icon}
      </div>
      <strong className="block text-[#f3c997] text-[9px] tracking-[0.16em]">{title}</strong>
      <span className="block mt-[9px] text-xs text-white/84">{description}</span>
    </div>
  );
}

export default function ServiceStrip() {
  return (
    <section className="bg-[#1e1b18] text-[#fff8ef] py-[35px] px-[8vw] grid grid-cols-3 gap-[30px] text-center max-[620px]:py-[27px] max-[620px]:px-5 max-[620px]:grid-cols-1 max-[620px]:gap-6 max-[620px]:text-left" aria-label="Store services">
      <ServiceItem
        icon={<svg viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></svg>}
        title="COMPLIMENTARY SHIPPING"
        description="On all orders above ₹999"
        index={0}
        border=""
      />
      <ServiceItem
        icon={<svg viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.9-8.6a5.5 5.5 0 0 0-.1-7.8Z" /></svg>}
        title="HANDPICKED STYLES"
        description="For your most special moments"
        index={1}
        border="border-l border-white/25 max-[620px]:border-l-0 max-[620px]:border-t max-[620px]:border-t-white/20 max-[620px]:pt-[22px]"
      />
      <ServiceItem
        icon={<svg viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="10" width="14" height="10" rx="1" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>}
        title="SECURE PAYMENTS"
        description="Shop with complete confidence"
        index={2}
        border="border-l border-white/25 max-[620px]:border-l-0 max-[620px]:border-t max-[620px]:border-t-white/20 max-[620px]:pt-[22px]"
      />
    </section>
  );
}