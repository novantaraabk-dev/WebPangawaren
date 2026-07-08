'use client';

import React from 'react';
import { Header } from '@/components/landing/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { ServicesSection } from '@/components/landing/ServicesSection';
import { StatisticsSection } from '@/components/landing/StatisticsSection';
import { AboutSection } from '@/components/landing/AboutSection';
import { NewsSection } from '@/components/landing/NewsSection';
import { AnnouncementSection } from '@/components/landing/AnnouncementSection';
import { CtaSection } from '@/components/landing/CtaSection';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50 text-slate-900 overflow-x-hidden">
      <Header />
      <main className="relative z-10">
        <HeroSection />
        <ServicesSection />
        <NewsSection />
        <StatisticsSection />
        <AboutSection />
        <AnnouncementSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
