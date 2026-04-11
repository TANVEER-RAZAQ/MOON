import { FormEvent, useMemo, useState, type RefObject } from 'react';
import { productOrder, productStories } from '../data/products';
import type { CatalogItem, ProductKey, ProductStory } from '../types';

interface HomePageProps {
  activeProduct: ProductKey;
  activeStory: ProductStory;
  catalogItems: CatalogItem[];
  canvasRef: RefObject<HTMLCanvasElement>;
  onPrevProduct: () => void;
  onNextProduct: () => void;
  onSelectProduct: (key: ProductKey) => void;
  onAddDetailToCart: () => void;
  onAddCatalogToCart: (item: { id: string; title: string; price: number }) => void;
  onOpenCart: () => void;
  onBrowseCollection: () => void;
}

export function HomePage({
  activeProduct,
  activeStory,
  catalogItems,
  canvasRef,
  onPrevProduct,
  onNextProduct,
  onSelectProduct,
  onAddDetailToCart,
  onAddCatalogToCart,
  onOpenCart,
  onBrowseCollection
}: HomePageProps) {
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const catalogByKey = useMemo(
    () =>
      catalogItems.reduce((map, item) => {
        if (item.productKey) {
          map[item.productKey] = item;
        }
        return map;
      }, {} as Partial<Record<ProductKey, CatalogItem>>),
    [catalogItems]
  );

  const activeCatalogItem = catalogByKey[activeProduct];
  const signatureItem = catalogByKey.shilajit ?? catalogItems[0];
  const supportingItems = catalogItems.filter((item) => item.id !== signatureItem.id);
  const editorialStory = productStories.kashmiriSaffron;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const detailBullets = activeStory.details.split('<br>').filter(Boolean);

  const onNewsletterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newsletterEmail.trim()) {
      window.alert('Please enter your email address.');
      return;
    }
    window.alert(`Thanks for subscribing, ${newsletterEmail.trim()}.`);
    setNewsletterEmail('');
  };

  return (
    <main id="main-content" className="bg-background text-on-background">
      <section id="sanctuary" className="relative min-h-[100svh] overflow-hidden border-b border-outline-variant/10 pb-20 pt-32">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full object-cover opacity-70 brightness-75 contrast-125" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />

        <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-6 md:grid-cols-12 md:items-end md:px-16">
          <div className="md:col-span-7">
            <p className="font-display text-xs uppercase tracking-[0.35em] text-secondary md:text-sm">
              Ancient Wisdom / Modern Science
            </p>
            <h1 className="mt-4 font-display text-5xl uppercase leading-none tracking-tight text-on-background md:text-[6.5rem]">
              {activeStory.featureName}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-on-surface-variant">{activeStory.subtitle}</p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-on-surface-variant/90">{activeStory.desc}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onAddDetailToCart}
                className="bg-primary-container px-8 py-4 font-headline text-xs font-semibold uppercase tracking-[0.16em] text-on-primary-container transition-colors hover:bg-primary"
              >
                Acquire Essence
              </button>
              <button
                type="button"
                onClick={onBrowseCollection}
                className="border border-outline-variant/30 bg-surface-container-low px-8 py-4 font-headline text-xs font-semibold uppercase tracking-[0.16em] text-on-background transition-colors hover:bg-surface-container-high"
              >
                Explore Collection
              </button>
              <button
                type="button"
                onClick={onOpenCart}
                className="border border-outline-variant/30 bg-transparent px-6 py-4 font-headline text-xs font-semibold uppercase tracking-[0.16em] text-on-background transition-colors hover:bg-surface-container-low"
              >
                Open Cart
              </button>
            </div>

            <div className="mt-8 grid gap-2 sm:grid-cols-3">
              {detailBullets.map((detail) => (
                <div key={detail} className="border border-outline-variant/20 bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant">
                  {detail}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-2">
              {productOrder.map((key) => {
                const item = catalogByKey[key];
                const isActive = key === activeProduct;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onSelectProduct(key)}
                    className={`border px-4 py-2 font-label text-[10px] uppercase tracking-[0.18em] transition-colors ${
                      isActive
                        ? 'border-secondary bg-secondary text-on-secondary-fixed'
                        : 'border-outline-variant/30 bg-surface-container-low text-on-surface-variant hover:border-outline-variant/60'
                    }`}
                    aria-pressed={isActive}
                  >
                    {item?.title ?? key}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-5">
            <article className="group overflow-hidden border border-outline-variant/20 bg-surface-container-low p-6">
              <div className="overflow-hidden">
                <img
                  src={activeCatalogItem?.image ?? signatureItem.image}
                  alt={activeCatalogItem?.alt ?? signatureItem.alt}
                  className="h-[420px] w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                />
              </div>
              <div className="mt-6 flex items-end justify-between gap-4">
                <div>
                  <p className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary">Current Ritual</p>
                  <h2 className="mt-2 font-headline text-2xl">{activeCatalogItem?.title ?? signatureItem.title}</h2>
                  <p className="mt-2 text-sm text-on-surface-variant">{activeCatalogItem?.subtitle ?? signatureItem.subtitle}</p>
                </div>
                <div className="text-right">
                  <p className="font-headline text-2xl text-secondary">
                    {activeCatalogItem ? formatPrice(activeCatalogItem.price) : formatPrice(signatureItem.price)}
                  </p>
                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={onPrevProduct}
                      className="border border-outline-variant/30 px-3 py-1 text-xs uppercase tracking-[0.16em] hover:bg-surface-container-high"
                      aria-label="Previous product"
                    >
                      Prev
                    </button>
                    <button
                      type="button"
                      onClick={onNextProduct}
                      className="border border-outline-variant/30 px-3 py-1 text-xs uppercase tracking-[0.16em] hover:bg-surface-container-high"
                      aria-label="Next product"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-y border-outline-variant/10 bg-surface-container-low py-8">
        <div className="flex whitespace-nowrap" style={{ animation: 'marquee 40s linear infinite' }}>
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={`marquee-${index}`}
              className="mr-12 flex flex-shrink-0 items-center gap-12 font-display text-4xl uppercase tracking-tight text-surface-container-highest md:text-6xl"
            >
              <span>MOON RITUALS</span>
              <span className="text-secondary">•</span>
              <span>PROPHETIC WELLNESS</span>
              <span className="text-secondary">•</span>
              <span>PURE ORIGINS</span>
              <span className="text-secondary">•</span>
            </div>
          ))}
        </div>
      </section>

      <section id="archives" className="bg-background px-6 py-24 md:px-16 md:py-32">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-8 md:grid-cols-12">
          <div className="relative md:col-span-7">
            <div className="absolute -left-4 -top-10 hidden bg-surface-container-high p-3 md:block">
              <span className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary">
                Edition 001 / {editorialStory.featureName}
              </span>
            </div>
            <img
              src={catalogByKey.kashmiriSaffron?.image ?? signatureItem.image}
              alt="Editorial saffron and wellness composition"
              className="h-[620px] w-full object-cover grayscale transition-all duration-1000 hover:grayscale-0"
            />
          </div>

          <div className="space-y-8 md:col-span-5 md:pl-12">
            <h2 className="font-headline text-4xl leading-tight tracking-tight md:text-6xl">
              THE ART OF <span className="italic text-secondary">ALCHEMICAL</span> RESTORATION
            </h2>
            <div className="h-px w-24 bg-secondary" />
            <p className="text-lg leading-loose text-on-surface-variant">
              Each MOON product is crafted around precise seasonal sourcing and purity-first testing. From Shilajit resin to Kashmiri saffron, every ritual is designed to restore stamina, clarity, and balance.
            </p>
            <p className="text-base leading-loose text-on-surface-variant/90">{editorialStory.featureDesc}</p>
          </div>
        </div>
      </section>

      <section id="rituals" className="bg-surface px-6 py-24 md:px-12">
        <div className="mx-auto mb-16 w-full max-w-2xl text-center">
          <h3 className="font-display text-3xl md:text-4xl">THE CURATED COLLECTION</h3>
          <p className="mt-4 font-label text-xs uppercase tracking-[0.18em] text-zinc-500">
            Shilajit leads. Saffron, dry fruits, and ghee complete the ritual.
          </p>
        </div>

        <div id="shop" className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-2 md:[grid-auto-rows:minmax(220px,1fr)]">
          <article className="group relative flex flex-col justify-between overflow-hidden border border-outline-variant/10 bg-surface-container-low p-8 md:col-span-2 md:row-span-2">
            <div className="relative z-10">
              <span className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary">Signature Product</span>
              <h4 className="mt-4 font-headline text-4xl md:text-5xl">{signatureItem.title.toUpperCase()}</h4>
            </div>
            <div className="relative z-10">
              <p className="mb-6 max-w-xs text-sm text-on-surface-variant">{signatureItem.subtitle}</p>
              <div className="flex flex-wrap items-center gap-4">
                <span className="font-headline text-2xl text-secondary">{formatPrice(signatureItem.price)}</span>
                <button
                  type="button"
                  onClick={() => onAddCatalogToCart(signatureItem)}
                  className="border border-secondary/60 px-4 py-2 font-label text-[10px] uppercase tracking-[0.16em] text-secondary transition-colors hover:bg-secondary hover:text-on-secondary-fixed"
                >
                  Add to Cart
                </button>
              </div>
            </div>
            <img
              src={signatureItem.image}
              alt={signatureItem.alt}
              className="pointer-events-none absolute bottom-0 right-0 w-3/4 opacity-40 transition-opacity duration-700 group-hover:opacity-100"
            />
          </article>

          {supportingItems.map((item, index) => {
            const isWideCard = index === 0;
            const cardClass = isWideCard
              ? 'md:col-span-2 flex-row items-center justify-between'
              : 'flex-col justify-end';

            return (
              <article
                key={item.id}
                className={`group flex overflow-hidden border border-outline-variant/10 bg-surface-container-lowest p-6 transition-colors duration-500 hover:bg-surface-container-high ${cardClass}`}
              >
                <div>
                  <h4 className="font-headline text-xl leading-tight">{item.title}</h4>
                  <p className="mt-2 text-sm text-zinc-400">{item.subtitle}</p>
                  <p className="mt-4 font-label text-xs uppercase tracking-[0.16em] text-secondary">{formatPrice(item.price)}</p>
                </div>

                <div className={`mt-4 flex ${isWideCard ? 'md:mt-0 md:items-center md:gap-4' : 'items-center justify-between gap-3'}`}>
                  <button
                    type="button"
                    className="border border-outline-variant/30 px-4 py-2 font-label text-[10px] uppercase tracking-[0.16em] text-on-background transition-colors hover:border-secondary hover:text-secondary"
                    onClick={() => onAddCatalogToCart(item)}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="font-label text-[10px] uppercase tracking-[0.16em] text-zinc-500 transition-colors hover:text-zinc-200"
                    onClick={() => item.productKey && onSelectProduct(item.productKey)}
                  >
                    Focus
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="about" className="bg-surface-container-low px-6 py-24 md:px-16">
        <div className="mx-auto w-full max-w-5xl overflow-hidden border border-outline-variant/20 p-8 md:p-16">
          <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 bg-secondary/10 blur-[120px]" />
            <div>
              <h2 className="font-display text-4xl md:text-5xl">THE ARCHIVE</h2>
              <p className="mt-6 text-base leading-relaxed text-zinc-400">
                Join the private list for harvest drops, batch releases, and editorial updates from the MOON wellness studio.
              </p>
            </div>

            <form className="space-y-4" onSubmit={onNewsletterSubmit} id="newsletter">
              <input
                type="email"
                placeholder="Email address"
                value={newsletterEmail}
                onChange={(event) => setNewsletterEmail(event.target.value)}
                className="w-full bg-surface-container-lowest p-4 font-label text-sm uppercase tracking-[0.12em] text-on-background outline-none ring-1 ring-transparent transition focus:ring-secondary/50"
                aria-label="Email address"
                required
              />
              <button
                type="submit"
                className="w-full bg-secondary py-4 font-headline text-xs font-semibold uppercase tracking-[0.2em] text-on-secondary-fixed transition hover:brightness-110"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
