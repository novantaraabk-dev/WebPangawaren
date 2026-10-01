'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, ArrowRight, PlayCircle, RotateCcw } from 'lucide-react';
import { News } from '@/lib/types';
import { CardContourPattern } from '@/components/landing/CardContourPattern';
import { Button } from '@/components/ui/button';

interface NewsCalendarWidgetProps {
  newsList: News[];
  selectedDate?: Date | null;
  onSelectDate?: (date: Date | null) => void;
}

// Helper: Parse news date safely
export function parseNewsDate(news: News): Date | null {
  if (news.createdAt && typeof (news.createdAt as any).toDate === 'function') {
    return (news.createdAt as any).toDate();
  }
  if (news.updatedAt && typeof (news.updatedAt as any).toDate === 'function') {
    return (news.updatedAt as any).toDate();
  }
  if (!news.date) return null;

  const d = new Date(news.date);
  if (!isNaN(d.getTime())) return d;

  const indonesianMonths: Record<string, number> = {
    jan: 0, januari: 0,
    feb: 1, februari: 1,
    mar: 2, maret: 2,
    apr: 3, april: 3,
    mei: 4, may: 4,
    jun: 5, juni: 5,
    jul: 6, juli: 6,
    agu: 7, agt: 7, agustus: 7, aug: 7,
    sep: 8, september: 8,
    okt: 9, oktober: 9, oct: 9,
    nov: 10, november: 10,
    des: 11, desember: 11, dec: 11,
  };

  const clean = news.date.toLowerCase().replace(/,/g, ' ');
  const parts = clean.split(/\s+/).filter(Boolean);

  let day: number | null = null;
  let month: number | null = null;
  let year: number | null = null;

  for (const p of parts) {
    if (/^\d{4}$/.test(p)) {
      year = parseInt(p, 10);
    } else if (/^\d{1,2}$/.test(p) && day === null) {
      day = parseInt(p, 10);
    } else if (indonesianMonths[p] !== undefined) {
      month = indonesianMonths[p];
    }
  }

  if (day !== null && month !== null && year !== null) {
    return new Date(year, month, day);
  }

  return null;
}

function isSameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export function NewsCalendarWidget({ newsList, selectedDate: externalSelectedDate, onSelectDate }: NewsCalendarWidgetProps) {
  // 1. Realtime Digital Clock state
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Calendar view date state (defaults to today)
  const [viewDate, setViewDate] = useState<Date>(() => new Date());
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | null>(null);

  const activeSelectedDate = externalSelectedDate !== undefined ? externalSelectedDate : internalSelectedDate;

  const handleSelectDate = (date: Date | null) => {
    if (activeSelectedDate && date && isSameDay(activeSelectedDate, date)) {
      // Toggle off if already selected
      setInternalSelectedDate(null);
      onSelectDate?.(null);
    } else {
      setInternalSelectedDate(date);
      onSelectDate?.(date);
    }
  };

  // 3. Map news by date key (YYYY-MM-DD)
  const newsDateMap = useMemo(() => {
    const map = new Map<string, News[]>();
    newsList.forEach((item) => {
      const parsed = parseNewsDate(item);
      if (parsed) {
        const key = `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}-${String(parsed.getDate()).padStart(2, '0')}`;
        const existing = map.get(key) || [];
        existing.push(item);
        map.set(key, existing);
      }
    });
    return map;
  }, [newsList]);

  // 4. Generate calendar grid for current viewDate month
  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: { date: Date; isCurrentMonth: boolean; hasNews: boolean; newsCount: number }[] = [];

    // Prev month days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, daysInPrevMonth - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const newsForDay = newsDateMap.get(key) || [];
      days.push({ date: d, isCurrentMonth: false, hasNews: newsForDay.length > 0, newsCount: newsForDay.length });
    }

    // Current month days
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const d = new Date(year, month, i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const newsForDay = newsDateMap.get(key) || [];
      days.push({ date: d, isCurrentMonth: true, hasNews: newsForDay.length > 0, newsCount: newsForDay.length });
    }

    // Next month days to fill 35 or 42 grid cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const newsForDay = newsDateMap.get(key) || [];
      days.push({ date: d, isCurrentMonth: false, hasNews: newsForDay.length > 0, newsCount: newsForDay.length });
    }

    return days;
  }, [viewDate, newsDateMap]);

  // 5. News to display below calendar
  const filteredNews = useMemo(() => {
    if (activeSelectedDate) {
      const key = `${activeSelectedDate.getFullYear()}-${String(activeSelectedDate.getMonth() + 1).padStart(2, '0')}-${String(activeSelectedDate.getDate()).padStart(2, '0')}`;
      return newsDateMap.get(key) || [];
    }
    // Default: latest 4 items
    return newsList.slice(0, 4);
  }, [activeSelectedDate, newsDateMap, newsList]);

  // Digital clock time formatting
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const fullDateFormatted = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6 font-sans">
      {/* 1. DIGITAL CLOCK WIDGET */}
      <div className="relative overflow-hidden isolate rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-6 shadow-xl border border-emerald-900/30">
        <CardContourPattern opacity={0.12} className="text-emerald-400" />
        
        <div className="relative z-10 flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300">Waktu Real-Time</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-[10px] font-bold text-slate-300 backdrop-blur-md">
            <Clock className="h-3 w-3 text-emerald-400" />
            <span>WIB</span>
          </div>
        </div>

        {/* Digital Clock Display */}
        <div className="relative z-10 py-1">
          <div className="flex items-baseline gap-1 font-mono text-4xl sm:text-5xl font-black text-emerald-400 tracking-wider drop-shadow-[0_0_15px_rgba(52,211,153,0.35)]">
            <span>{hours}</span>
            <span className="animate-pulse text-emerald-300/80">:</span>
            <span>{minutes}</span>
            <span className="animate-pulse text-emerald-300/80">:</span>
            <span className="text-3xl sm:text-4xl text-emerald-300">{seconds}</span>
          </div>
          <p className="text-xs font-semibold text-slate-300 mt-2 capitalize flex items-center gap-1.5">
            <CalendarIcon className="h-3.5 w-3.5 text-emerald-400" />
            <span>{fullDateFormatted}</span>
          </p>
        </div>
      </div>

      {/* 2. MONTHLY CALENDAR WIDGET */}
      <div className="relative overflow-hidden isolate rounded-[2rem] bg-white border border-slate-200/90 p-5 sm:p-6 shadow-xl space-y-4">
        <CardContourPattern opacity={0.08} className="text-emerald-600" />

        <div className="relative z-10 flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight font-display">
              {MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pilih Tanggal Berita</p>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full border-slate-200 hover:bg-emerald-50 hover:text-emerald-700"
              onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
              title="Bulan sebelumnya"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2.5 text-[11px] font-bold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full"
              onClick={() => {
                const today = new Date();
                setViewDate(today);
                handleSelectDate(today);
              }}
            >
              Hari Ini
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full border-slate-200 hover:bg-emerald-50 hover:text-emerald-700"
              onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
              title="Bulan berikutnya"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Days Header */}
        <div className="relative z-10 grid grid-cols-7 gap-1 text-center text-[10px] font-black uppercase text-slate-400">
          {DAY_NAMES.map((name, i) => (
            <div key={name} className={i === 0 ? 'text-rose-500' : ''}>
              {name}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="relative z-10 grid grid-cols-7 gap-1">
          {calendarDays.map(({ date, isCurrentMonth, hasNews, newsCount }, idx) => {
            const isToday = isSameDay(date, now);
            const isSelected = activeSelectedDate ? isSameDay(date, activeSelectedDate) : false;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectDate(date)}
                className={`
                  relative h-9 rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all duration-200
                  ${!isCurrentMonth ? 'text-slate-300 hover:text-slate-500' : 'text-slate-700'}
                  ${isToday && !isSelected ? 'border border-emerald-500 text-emerald-700 font-black' : ''}
                  ${isSelected ? 'bg-emerald-600 text-white font-black shadow-md scale-105' : 'hover:bg-slate-100'}
                  ${hasNews && !isSelected ? 'font-black text-slate-900 bg-emerald-50/60' : ''}
                `}
                title={`${date.toLocaleDateString('id-ID')}${hasNews ? ` (${newsCount} berita)` : ''}`}
              >
                <span>{date.getDate()}</span>
                {hasNews && (
                  <span
                    className={`
                      absolute bottom-1 h-1.5 w-1.5 rounded-full
                      ${isSelected ? 'bg-amber-300 ring-1 ring-white' : 'bg-emerald-500 animate-pulse'}
                    `}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Calendar Footer Info */}
        <div className="relative z-10 flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Ada berita diterbitkan</span>
          </div>
          {activeSelectedDate && (
            <button
              onClick={() => handleSelectDate(null)}
              className="inline-flex items-center gap-1 text-emerald-700 hover:underline font-bold"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset filter</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. MINI NEWS CARDS (Filtered by Selected Date or Recent) */}
      <div className="relative overflow-hidden isolate rounded-[2rem] bg-white border border-slate-200/90 p-5 shadow-xl space-y-4">
        <CardContourPattern opacity={0.06} className="text-slate-400" />

        <div className="relative z-10 flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 font-display">
              {activeSelectedDate ? (
                <span>
                  Berita: <span className="text-emerald-700 not-italic">{activeSelectedDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </span>
              ) : (
                <span>Arsip Berita Terbaru</span>
              )}
            </h4>
            <p className="text-[10px] text-slate-400 font-semibold">
              {activeSelectedDate ? `${filteredNews.length} berita ditemukan` : 'Pilih tanggal di kalender'}
            </p>
          </div>

          {activeSelectedDate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSelectDate(null)}
              className="h-7 px-2 text-[10px] font-bold text-slate-500 hover:text-emerald-700"
            >
              Tampilkan Semua
            </Button>
          )}
        </div>

        {/* List of Mini News Cards */}
        <div className="relative z-10 space-y-2.5">
          {filteredNews.length === 0 ? (
            <div className="p-6 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-2">
              <CalendarIcon className="h-8 w-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-600">Tidak ada berita pada tanggal ini</p>
              <p className="text-[10px] text-slate-400">
                Pilih tanggal yang memiliki tanda titik hijau di kalender untuk melihat berita.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSelectDate(null)}
                className="mt-2 text-xs font-bold rounded-xl border-emerald-600 text-emerald-700 hover:bg-emerald-50"
              >
                Lihat Berita Terbaru
              </Button>
            </div>
          ) : (
            filteredNews.map((item) => (
              <Link
                key={item.id}
                href={`/BeritaDesa/${item.id}`}
                className="group flex gap-3 p-2.5 rounded-2xl border border-slate-100 bg-white hover:border-emerald-300 hover:shadow-md transition-all duration-200"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative flex items-center justify-center shadow-xs">
                  {item.imageUrl || (item.imageUrls && item.imageUrls.length > 0) ? (
                    <img
                      src={item.imageUrls?.[0] || item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-900 text-white">
                      <PlayCircle className="h-6 w-6 text-emerald-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <h5 className="text-[11px] font-black uppercase text-slate-800 leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors font-sans">
                    {item.title}
                  </h5>
                  <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 mt-1">
                    <span>{item.date}</span>
                    <span className="text-emerald-700 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Baca <ArrowRight className="h-2.5 w-2.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
