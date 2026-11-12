import React, {useEffect, useRef, useState} from 'react';
import {
  Banner,
  useGetBanners,
} from '@/lib/api and mutation/settings/useSettings';
import {useTranslation} from 'react-i18next';

const AUTOPLAY_MS = 3500;

const BannerImage: React.FC<{banner: Banner; eager?: boolean}> = ({
  banner,
  eager,
}) => {
  const {t} = useTranslation();
  const img = (
    <img
      src={banner.image}
      alt={banner.title || t('banner.alt', {n: 1})}
      loading={eager ? 'eager' : 'lazy'}
      draggable={false}
      className="h-full w-full object-cover"
    />
  );
  return banner.link ? (
    <a
      href={banner.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full w-full"
    >
      {img}
    </a>
  ) : (
    img
  );
};

export const BannerCarousel: React.FC = () => {
  const {data: banners = []} = useGetBanners();
  const {t} = useTranslation();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const count = banners.length;

  useEffect(() => {
    if (index >= count && count > 0) setIndex(0);
  }, [count, index]);

  useEffect(() => {
    if (count <= 1 || paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [count, paused]);

  if (count === 0) return null;

  if (count === 1) {
    return (
      <div className="shadow-2xs aspect-[21/9] w-full overflow-hidden rounded-2xl bg-[#f0eded]">
        <BannerImage banner={banners[0]} eager />
      </div>
    );
  }

  const go = (i: number) => setIndex((i + count) % count);

  return (
    <div
      className="shadow-2xs relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-[#f0eded]"
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
        setPaused(true);
      }}
      onTouchEnd={(e) => {
        const start = touchStartX.current;
        touchStartX.current = null;
        setPaused(false);
        if (start === null) return;
        const delta = e.changedTouches[0].clientX - start;
        if (Math.abs(delta) > 40) go(index + (delta < 0 ? 1 : -1));
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{transform: `translateX(-${index * 100}%)`}}
      >
        {banners.map((b, i) => (
          <div key={b.id} className="h-full w-full shrink-0">
            <BannerImage banner={b} eager={i === 0} />
          </div>
        ))}
      </div>

      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
        {banners.map((b, i) => (
          <button
            key={b.id}
            type="button"
            aria-label={t('banner.alt', {n: i + 1})}
            onClick={() => go(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
