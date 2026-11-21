"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";

export interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  className?: string;
}

/** Galería con lightbox accesible: teclado, Escape, flechas y foco devuelto. */
export function Gallery({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) dialog.showModal();
    if (index === null && dialog.open) {
      dialog.close();
      triggerRef.current?.focus();
    }
  }, [index]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, step]);

  const current = index !== null ? images[index] : null;

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-12 md:gap-4">
        {images.map((img, i) => (
          <li key={img.src} className={img.className}>
            <button
              type="button"
              onClick={(e) => {
                triggerRef.current = e.currentTarget;
                setIndex(i);
              }}
              className="group relative block h-full w-full overflow-hidden bg-nogal"
              aria-label={`Ampliar imagen: ${img.caption}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 768px) 40vw, 50vw"
                className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-lujo)] group-hover:scale-[1.04]"
              />
              <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ebano/80 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-left">
                <span className="font-serif text-lg leading-tight text-marfil md:text-xl">{img.caption}</span>
                <Expand aria-hidden size={16} strokeWidth={1.4} className="shrink-0 text-laton opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={close}
        onClick={(e) => e.target === dialogRef.current && close()}
        aria-label="Galería ampliada"
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-ebano/97 p-0 text-marfil backdrop:bg-black/80"
      >
        {current && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-5 py-4">
              <p className="etiqueta text-arena" aria-live="polite">
                {index! + 1} / {images.length}
              </p>
              <button type="button" onClick={close} className="grid h-12 w-12 place-items-center hover:text-laton" aria-label="Cerrar galería">
                <X size={26} strokeWidth={1.3} />
              </button>
            </div>
            <figure className="relative mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col px-4 pb-6">
              <div className="relative min-h-0 flex-1">
                <Image src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" />
              </div>
              <figcaption className="mt-4 text-center font-serif text-xl italic text-marfil/90">{current.caption}</figcaption>
            </figure>
            <div className="flex justify-center gap-3 pb-8">
              <button type="button" onClick={() => step(-1)} className="grid h-12 w-12 place-items-center border border-marfil/20 hover:border-laton hover:text-laton" aria-label="Imagen anterior">
                <ChevronLeft size={22} strokeWidth={1.3} />
              </button>
              <button type="button" onClick={() => step(1)} className="grid h-12 w-12 place-items-center border border-marfil/20 hover:border-laton hover:text-laton" aria-label="Imagen siguiente">
                <ChevronRight size={22} strokeWidth={1.3} />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
