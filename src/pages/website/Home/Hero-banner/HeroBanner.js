import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import StoreIcon from '../../../../components/store/StoreIcon';

const heroSlides = [
  {
    image: '/images/Home/Banner/01.png',
    eyebrow: 'THE FESTIVE SAREE EDIT',
    heading: 'Moments that<br />deserve <em>more.</em>',
    blurb: 'From graceful silks to celebratory drapes, find a saree that turns every occasion into a memory.',
    cta: { label: 'SHOP SAREES', to: '/shop?category=Sarees' },
    shade: 'linear-gradient(90deg, rgba(38, 20, 15, .54) 0%, rgba(38, 20, 15, .23) 39%, transparent 64%),linear-gradient(0deg, rgba(25, 10, 6, .15), transparent 45%)',
    note: 'CELEBRATE IN STYLE'
  },
  {
    image: '/images/Home/Banner/02.png',
    eyebrow: 'KURTI COLLECTION',
    heading: 'Chic &<br />Comfortable <em>styles.</em>',
    blurb: 'Discover our handpicked kurtis that blend tradition with everyday elegance.',
    cta: { label: 'SHOP KURTIS', to: '/shop?category=Kurtis' },
    shade: 'linear-gradient(90deg, rgba(55, 30, 15, .48) 0%, rgba(55, 30, 15, .18) 45%, transparent 68%),linear-gradient(0deg, rgba(25, 10, 6, .25), transparent 55%)',
    note: 'EVERYDAY ELEGANCE'
  },
  {
    image: '/images/Home/Banner/03.png',
    eyebrow: 'LEHENGA DREAMS',
    heading: 'Your special<br />moment <em>awaits.</em>',
    blurb: 'From bridal to party wear, find a lehenga that steals the spotlight.',
    cta: { label: 'SHOP LEHENGAS', to: '/shop?category=Lehengas' },
    shade: 'linear-gradient(90deg, rgba(60, 18, 18, .52) 0%, rgba(60, 18, 18, .20) 38%, transparent 62%),linear-gradient(0deg, rgba(25, 10, 6, .15), transparent 50%)',
    note: 'WEDDING & PARTY'
  },
  {
    image: '/images/Home/Banner/04.png',
    eyebrow: 'LEHENGA DREAMS',
    heading: 'Your special<br />moment <em>awaits.</em>',
    blurb: 'From bridal to party wear, find a lehenga that steals the spotlight.',
    cta: { label: 'SHOP LEHENGAS', to: '/shop?category=Lehengas' },
    shade: 'linear-gradient(90deg, rgba(60, 18, 18, .52) 0%, rgba(60, 18, 18, .20) 38%, transparent 62%),linear-gradient(0deg, rgba(25, 10, 6, .15), transparent 50%)',
    note: 'WEDDING & PARTY'
  }
];

export default function HeroBanner() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const sectionRef = useRef(null);

  const slideNext = useCallback(() => {
    setSlideIndex((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const slidePrev = useCallback(() => {
    setSlideIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  const goToSlide = useCallback((index) => {
    setSlideIndex(index);
    clearInterval(intervalRef.current);
    if (!isPaused) {
      intervalRef.current = setInterval(slideNext, 5000);
    }
  }, [slideNext, isPaused]);

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(slideNext, 5000);
    }
    return () => clearInterval(intervalRef.current);
  }, [slideNext, isPaused]);

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        slideNext();
      } else {
        slidePrev();
      }
    }
  }, [slideNext, slidePrev]);

  return (
    <section
      ref={sectionRef}
      className="hero-banner relative isolate h-[min(680px,calc(100vh-110px))] min-h-[570px] overflow-hidden text-white max-[620px]:h-[620px] max-[620px]:min-h-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0 -z-[3]">
        {heroSlides.map((slide, i) => (
          <div key={i} className={`hero-slide ${i === slideIndex ? 'active' : ''}`}>
            <img
              src={slide.image}
              alt={slide.eyebrow}
              className="h-full w-full object-cover object-[62%_center] max-[620px]:object-[64%_center] hero-slide-img"
            />
            <div className="absolute -z-[2] inset-0" style={{ background: slide.shade }} />
          </div>
        ))}
      </div>
      <div className="hero-content absolute left-[clamp(24px,9vw,150px)] top-1/2 max-w-[455px] -translate-y-1/2 max-[620px]:bottom-[77px] max-[620px]:top-auto max-[620px]:max-w-[310px] max-[620px]:translate-y-0">
        <p className="hero-eyebrow m-0 mb-3 text-[#ffe6c7] font-bold text-[10px] tracking-[.19em]">{heroSlides[slideIndex].eyebrow}</p>
        <h1
          className="hero-heading m-0 font-playfair font-medium tracking-[-.055em] leading-[.95] text-[clamp(48px,5vw,78px)] max-md:text-[clamp(40px,4.5vw,58px)] max-[620px]:text-[49px] max-[430px]:text-[38px]"
          dangerouslySetInnerHTML={{ __html: heroSlides[slideIndex].heading }}
        />
        <p className="hero-blurb max-w-[385px] my-6 mx-0 text-[14px] leading-[1.7] text-[rgba(255,250,245,.9)] max-[620px]:my-[17px] max-[620px]:text-[13px] max-[620px]:leading-[1.6]">{heroSlides[slideIndex].blurb}</p>
        <Link
          className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[.16em] text-inherit hover:border-paper"
          to={heroSlides[slideIndex].cta.to}
        >
          {heroSlides[slideIndex].cta.label} <StoreIcon name="arrow"  className="text-[5px]" />
        </Link>
      </div>
      <div className="hero-dots absolute bottom-[48px] left-[clamp(24px,9vw,150px)] z-[5] flex gap-[10px] max-[620px]:bottom-[39px]">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            className={`hero-dot w-[10px] h-[10px] rounded-full border-2 border-[rgba(255,255,245,.7)] bg-transparent p-0 cursor-pointer transition-all duration-[250ms] ${i === slideIndex ? 'bg-[rgba(255,255,245,.9)] scale-110' : 'hover:scale-110'}`}
            onClick={() => goToSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
      <div className="hero-note absolute bottom-[28px] right-[4.5vw] flex gap-[13px] items-center text-[9px] tracking-[.18em] font-bold max-[620px]:right-[21px] max-[620px]:bottom-[24px] max-[620px]:text-[8px]">
        <span className="opacity-65">0{slideIndex + 1}</span>
        <span className="hero-note-text">{heroSlides[slideIndex].note}</span>
      </div>
      {isPaused && (
        <div className="absolute top-4 right-4 z-10 bg-black/40 backdrop-blur-sm text-white text-[8px] tracking-[0.15em] font-bold px-3 py-1.5 rounded-full">
          PAUSED
        </div>
      )}
    </section>
  );
}
