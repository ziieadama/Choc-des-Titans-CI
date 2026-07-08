"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";

/** Grille masonry simple + lightbox plein écran avec navigation clavier. */
export default function GalleryGrid({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () => setIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, prev, next]);

  return (
    <>
      <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 [&>button]:mb-3">
        {images.map((src, i) => (
          <motion.button
            key={src}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: (i % 8) * 0.04 }}
            onClick={() => setIndex(i)}
            className="group relative block w-full cursor-zoom-in overflow-hidden rounded-lg"
            aria-label={`Agrandir la photo ${i + 1}`}
          >
            <Image
              src={src}
              alt={`${alt} — photo ${i + 1}`}
              width={640}
              height={427}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading={i < 8 ? "eager" : "lazy"}
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/35 group-hover:opacity-100">
              <Expand size={22} className="text-white" />
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {index !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
            onClick={close}
          >
            <button
              onClick={close}
              className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Fermer"
            >
              <X size={22} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-2 sm:left-6 z-10 inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-blue"
              aria-label="Photo précédente"
            >
              <ChevronLeft size={26} />
            </button>
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="relative h-[85dvh] w-[92vw] max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[index]}
                alt={`${alt} — photo ${index + 1}`}
                fill
                sizes="92vw"
                className="object-contain"
                priority
              />
            </motion.div>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-2 sm:right-6 z-10 inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-blue"
              aria-label="Photo suivante"
            >
              <ChevronRight size={26} />
            </button>
            <span className="tabular absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/80">
              {index + 1} / {images.length}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
