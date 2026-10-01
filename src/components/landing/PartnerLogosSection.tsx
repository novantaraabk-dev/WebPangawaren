'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { FooterLogosInfo, PartnerLogoItem } from '@/lib/types';

export function PartnerLogosSection() {
  const firestore = useFirestore();

  const footerLogosRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'footerLogos', 'default');
  }, [firestore]);

  const { data: footerLogosData } = useDoc<FooterLogosInfo>(footerLogosRef, { suppressGlobalError: true });

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    skipSnaps: false,
  });

  const [isPaused, setIsPaused] = useState(false);

  // Extract logos from items array or fallback to legacy logo1Url..logo4Url
  const logos: PartnerLogoItem[] = React.useMemo(() => {
    if (!footerLogosData) return [];

    if (Array.isArray(footerLogosData.items) && footerLogosData.items.length > 0) {
      return footerLogosData.items.filter((item) => Boolean(item.url));
    }

    // Fallback to legacy fields
    const legacyItems: PartnerLogoItem[] = [];
    const legacyKeys: Array<'logo1' | 'logo2' | 'logo3' | 'logo4'> = ['logo1', 'logo2', 'logo3', 'logo4'];
    legacyKeys.forEach((key, idx) => {
      const url = footerLogosData[`${key}Url` as keyof FooterLogosInfo] as string | undefined;
      const link = footerLogosData[`${key}Link` as keyof FooterLogosInfo] as string | undefined;
      if (url) {
        legacyItems.push({
          id: `legacy-${idx + 1}`,
          name: `Logo ${idx + 1}`,
          url,
          link: link || '',
        });
      }
    });

    return legacyItems;
  }, [footerLogosData]);

  // Ensure enough items for seamless looping in Embla
  const displayLogos = React.useMemo(() => {
    if (logos.length === 0) return [];
    if (logos.length < 5) {
      return [...logos, ...logos, ...logos, ...logos];
    }
    if (logos.length < 10) {
      return [...logos, ...logos];
    }
    return logos;
  }, [logos]);

  // ReInit embla when logos are loaded or updated
  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
    }
  }, [emblaApi, displayLogos]);

  const handleScrollPrev = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (emblaApi) {
      emblaApi.scrollPrev();
    }
  }, [emblaApi]);

  const handleScrollNext = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (emblaApi) {
      emblaApi.scrollNext();
    }
  }, [emblaApi]);

  // Gentle auto-scroll timer when not hovering
  useEffect(() => {
    if (!emblaApi || isPaused || displayLogos.length === 0) return;

    const interval = setInterval(() => {
      if (emblaApi) {
        emblaApi.scrollNext();
      }
    }, 3200);

    return () => clearInterval(interval);
  }, [emblaApi, isPaused, displayLogos.length]);

  if (logos.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Logo Mitra dan Instansi"
      className="relative z-10 w-full overflow-hidden bg-white py-6 sm:py-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={handleScrollPrev}
            aria-label="Logo sebelumnya"
            className="absolute left-0 z-30 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition-all duration-200 hover:scale-110 hover:bg-slate-50 hover:text-emerald-700 hover:border-emerald-400 hover:shadow-lg active:scale-95 cursor-pointer focus:outline-hidden"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Embla Viewport */}
          <div ref={emblaRef} className="overflow-hidden w-full mx-10 sm:mx-14 cursor-grab active:cursor-grabbing">
            <div className="flex touch-pan-y">
              {displayLogos.map((item, idx) => {
                const uniqueKey = `${item.id}-${idx}`;
                return (
                  <div
                    key={uniqueKey}
                    className="flex-[0_0_50%] sm:flex-[0_0_33.333%] md:flex-[0_0_25%] lg:flex-[0_0_20%] min-w-0 px-3 sm:px-5 flex items-center justify-center select-none"
                  >
                    <div className="flex h-20 sm:h-24 w-full items-center justify-center p-2 transition-transform duration-300 hover:scale-110">
                      {item.link ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={item.name || 'Buka Link Mitra'}
                          className="flex h-full w-full items-center justify-center focus:outline-hidden"
                        >
                          <Image
                            src={item.url}
                            alt={item.name || `Logo Mitra ${idx + 1}`}
                            width={160}
                            height={80}
                            className="max-h-12 sm:max-h-16 w-auto max-w-full object-contain pointer-events-none"
                            priority={idx < 5}
                          />
                        </a>
                      ) : (
                        <Image
                          src={item.url}
                          alt={item.name || `Logo Mitra ${idx + 1}`}
                          width={160}
                          height={80}
                          className="max-h-12 sm:max-h-16 w-auto max-w-full object-contain pointer-events-none"
                          priority={idx < 5}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={handleScrollNext}
            aria-label="Logo selanjutnya"
            className="absolute right-0 z-30 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition-all duration-200 hover:scale-110 hover:bg-slate-50 hover:text-emerald-700 hover:border-emerald-400 hover:shadow-lg active:scale-95 cursor-pointer focus:outline-hidden"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
      </div>

      {/* Smooth Dark Curved Wave Transition into Footer */}
      <div className="w-full overflow-hidden leading-none -mb-8 sm:-mb-10 mt-6 pointer-events-none">
        <svg
          viewBox="0 0 1440 36"
          className="w-full h-6 sm:h-9 text-slate-950 fill-current block"
          preserveAspectRatio="none"
        >
          <path d="M0,8 Q720,36 1440,8 L1440,36 L0,36 Z" />
        </svg>
      </div>
    </section>
  );
}
