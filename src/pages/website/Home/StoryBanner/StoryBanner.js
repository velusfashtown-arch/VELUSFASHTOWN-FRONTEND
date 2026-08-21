import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function StoryBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);
  const sectionRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (rect.top < windowHeight && rect.bottom > 0) {
          const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
          setScrollOffset(Math.min(Math.max(progress * 20, 0), 20));
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[530px] overflow-hidden text-white max-[620px]:min-h-[480px]"
      id="story"
    >
      <img
        ref={imgRef}
        src="/images/Home/Banner/01.png"
        alt="A festive fashion moment"
        className="absolute z-0 h-full w-full object-cover object-[60%_52%] brightness-[.73] transition-all duration-[2000ms] ease-out max-[620px]:object-[68%_center]"
        style={{ transform: `scale(${1 + scrollOffset * 0.005}) translateY(${scrollOffset * -1}px)` }}
      />
      <div className="absolute z-[1] inset-0 bg-[linear-gradient(90deg,rgba(46,20,12,.77),rgba(46,20,12,.21)_66%,rgba(46,20,12,.1))] max-[620px]:bg-[linear-gradient(90deg,rgba(46,20,12,.8),rgba(46,20,12,.16))]" />
      <div
        className={`relative z-[2] max-w-[450px] py-[130px] pb-[82px] pl-[13.5vw] max-[620px]:px-[26px] max-[620px]:py-[96px] max-[620px]:pb-[65px] transition-[opacity,transform] duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      >
        <p className="text-[#ffe6c7] font-bold text-[10px] tracking-[0.19em] mb-3">VELU'S PROMISE</p>
        <h2 className="m-0 font-playfair font-medium tracking-[-.055em] leading-[.95] text-[clamp(42px,4.15vw,66px)] max-[620px]:text-[42px]">
          Woven with<br /><em className="not-italic font-medium">celebration.</em>
        </h2>
        <p className="text-[rgba(255,255,255,.88)] text-sm leading-[1.7] my-5 mb-[25px] max-w-[350px]">
          Thoughtful weaves, rich details and the confidence to feel beautifully yourself.
        </p>
        <Link className="inline-flex items-center gap-[15px] border-0 p-0 text-inherit bg-none text-[10px] font-bold tracking-[0.16em] no-underline group" to="/shop?category=Sarees">
          DISCOVER THE COLLECTION <span className="w-[22px] h-[22px] transition-transform duration-200 group-hover:translate-x-1"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg></span>
        </Link>
      </div>
    </section>
  );
}