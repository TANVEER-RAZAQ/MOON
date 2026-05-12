'use client';

import { useState } from 'react';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

type Category =
  | 'All'
  | 'About Our Products'
  | 'Ordering & Payments'
  | 'Shipping'
  | 'Returns';

interface FaqItem {
  id: string;
  category: Exclude<Category, 'All'>;
  question: string;
  answer: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FAQS: FaqItem[] = [
  // About Our Products
  {
    id: 'faq-01',
    category: 'About Our Products',
    question: 'Is your saffron genuinely from Kashmir?',
    answer:
      'Yes. All our saffron is sourced exclusively from Pampore, Jammu & Kashmir — the world\'s most celebrated saffron-growing region. We work directly with farming families and can trace every batch to its source. We do not mix or blend with Iranian or Spanish saffron.',
  },
  {
    id: 'faq-02',
    category: 'About Our Products',
    question: 'What\'s the difference between Kashmiri and Iranian saffron?',
    answer:
      'Kashmiri saffron (ISO Grade 1) is considered the world\'s finest. It has a deeper crimson colour, a stronger aroma, and higher safranal content than Iranian (Persian) saffron. Iranian saffron is more commonly available and significantly cheaper — which is why many brands sell it as \'Kashmiri\' saffron. Ours is verified genuine.',
  },
  {
    id: 'faq-03',
    category: 'About Our Products',
    question: 'How do I know if my shilajit is pure?',
    answer:
      'Pure shilajit dissolves cleanly in warm water, turning it a golden-brown colour with no residue. It should have an earthy, slightly bitter taste and a tar-like consistency at room temperature that becomes fluid when warmed. Our shilajit passes strict purity tests before packaging.',
  },
  {
    id: 'faq-04',
    category: 'About Our Products',
    question: 'Are your products lab-tested?',
    answer:
      'Yes. We conduct batch-level quality testing for our saffron (ISO 3632 standard), shilajit (fulvic acid content, heavy metals), and honey (pollen analysis, moisture content). We are working toward publishing test certificates on our website.',
  },
  // Ordering & Payments
  {
    id: 'faq-05',
    category: 'Ordering & Payments',
    question: 'Do you offer Cash on Delivery (COD)?',
    answer:
      'Yes, we offer COD across most pin codes in India. COD orders may take 1-2 additional days to process. A small COD handling charge may apply.',
  },
  {
    id: 'faq-06',
    category: 'Ordering & Payments',
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major UPI apps (GPay, PhonePe, Paytm), credit/debit cards, net banking, and Cash on Delivery.',
  },
  {
    id: 'faq-07',
    category: 'Ordering & Payments',
    question: 'Can I modify or cancel my order after placing it?',
    answer:
      'Orders can be modified or cancelled within 2 hours of placement. After that, the order enters processing and cannot be changed. Contact us immediately at admin@moonnaturallyyours.com or +91-6005099213 if you need to make changes.',
  },
  // Shipping
  {
    id: 'faq-08',
    category: 'Shipping',
    question: 'How long does delivery take?',
    answer:
      'We ship within 1-2 business days of order confirmation. Standard delivery takes 4-7 business days across India. Express delivery (2-3 days) is available for select pin codes.',
  },
  {
    id: 'faq-09',
    category: 'Shipping',
    question: 'Do you ship internationally?',
    answer:
      'We currently ship within India only. International shipping is coming soon — join our newsletter to be notified.',
  },
  {
    id: 'faq-10',
    category: 'Shipping',
    question: 'How is saffron packaged to maintain quality?',
    answer:
      'Saffron is sealed in double-layered, airtight glass vials and placed in protective cardboard packaging. Every package is labelled with batch number and harvest date.',
  },
  // Returns
  {
    id: 'faq-11',
    category: 'Returns',
    question: 'What is your return policy?',
    answer:
      'We accept returns within 7 days of delivery if the product is unopened and in its original packaging. For quality concerns with opened products, contact us with a photo and we will resolve it — replacement or refund.',
  },
  {
    id: 'faq-12',
    category: 'Returns',
    question: 'How should I store saffron?',
    answer:
      'Store saffron in an airtight container (glass preferred) away from light, heat, and moisture. A kitchen cabinet away from the stove works well. Properly stored, our saffron maintains its quality for 2+ years.',
  },
  {
    id: 'faq-13',
    category: 'Returns',
    question: 'How should I store shilajit?',
    answer:
      'Store at room temperature, away from direct sunlight. Shilajit is stable and does not require refrigeration. Avoid contact with metal spoons — use a wooden or plastic spoon to scoop.',
  },
  {
    id: 'faq-14',
    category: 'Returns',
    question: 'Is the honey raw? Does it crystallize?',
    answer:
      'Yes, our honey is completely raw and unfiltered. Raw honey crystallizes naturally over time — this is a sign of purity, not spoilage. To return it to liquid form, gently warm the jar in warm water (never boil or microwave).',
  },
  {
    id: 'faq-15',
    category: 'Returns',
    question: 'Can I get a bulk discount for gifting or business?',
    answer:
      'Yes, we offer special pricing for bulk orders (10+ units). Email us at admin@moonnaturallyyours.com with your requirements.',
  },
];

const CATEGORIES: Category[] = [
  'All',
  'About Our Products',
  'Ordering & Payments',
  'Shipping',
  'Returns',
];

// ─── Accordion Item ───────────────────────────────────────────────────────────

function AccordionItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      style={{
        borderBottom: '1px solid rgba(11, 8, 6, 0.1)',
      }}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          padding: '22px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: '1.0625rem',
            fontWeight: 400,
            lineHeight: 1.35,
            letterSpacing: '-0.01em',
            color: '#0B0806',
            flex: 1,
          }}
        >
          {faq.question}
        </span>
        <span
          aria-hidden="true"
          style={{
            flexShrink: 0,
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: '1.5px solid #C58A1E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#C58A1E',
            fontFamily: "'Manrope', sans-serif",
            fontSize: '1.25rem',
            lineHeight: 1,
            fontWeight: 300,
            transition: 'transform 220ms ease',
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          +
        </span>
      </button>

      {/* Answer — show/hide with max-height transition */}
      <div
        style={{
          overflow: 'hidden',
          maxHeight: isOpen ? '600px' : '0',
          transition: 'max-height 320ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <p
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '0.9375rem',
            lineHeight: 1.75,
            color: '#4A3E31',
            margin: '0 0 24px 0',
            paddingRight: '44px',
          }}
        >
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────

export function FaqsClient() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const filtered =
    activeCategory === 'All'
      ? FAQS
      : FAQS.filter((f) => f.category === activeCategory);

  function toggleFaq(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <main style={{ fontFamily: "'Manrope', sans-serif" }}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: '#0B0806',
          minHeight: '50vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '80px 24px',
        }}
      >
        <p
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '0.6875rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#C58A1E',
            marginBottom: '24px',
            opacity: 0.8,
          }}
        >
          MOON Naturally Yours
        </p>
        <h1
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 'clamp(36px, 7vw, 56px)',
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: '#FAF6EF',
            margin: '0 0 24px 0',
          }}
        >
          Frequently Asked Questions
        </h1>
        <p
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 'clamp(17px, 2.2vw, 22px)',
            fontWeight: 300,
            color: '#C58A1E',
            letterSpacing: '-0.01em',
            maxWidth: '480px',
            lineHeight: 1.45,
            margin: 0,
          }}
        >
          Everything you need to know — and more.
        </p>
      </section>

      {/* ── Category Tabs ─────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: '#F4EDE2',
          padding: '32px 24px',
          borderBottom: '1px solid rgba(11, 8, 6, 0.08)',
        }}
      >
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            justifyContent: 'center',
          }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenIds(new Set());
                }}
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: '0.8125rem',
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: '9px 20px',
                  borderRadius: '2px',
                  border: isActive
                    ? '1.5px solid #C58A1E'
                    : '1.5px solid rgba(11, 8, 6, 0.2)',
                  backgroundColor: isActive ? '#C58A1E' : 'transparent',
                  color: isActive ? '#0B0806' : '#4A3E31',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── FAQ Accordion ─────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: '#FAF6EF',
          padding: '56px 24px 72px',
        }}
      >
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          {filtered.length === 0 ? (
            <p
              style={{
                textAlign: 'center',
                color: '#8A7A66',
                fontFamily: "'Manrope', sans-serif",
                fontSize: '1rem',
                padding: '40px 0',
              }}
            >
              No questions found in this category.
            </p>
          ) : (
            filtered.map((faq) => (
              <AccordionItem
                key={faq.id}
                faq={faq}
                isOpen={openIds.has(faq.id)}
                onToggle={() => toggleFaq(faq.id)}
              />
            ))
          )}
        </div>
      </section>

      {/* ── Still Have Questions CTA ──────────────────────────────────── */}
      <section
        style={{
          backgroundColor: '#0B0806',
          padding: '80px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.6875rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: '#C58A1E',
              marginBottom: '20px',
              opacity: 0.8,
            }}
          >
            We're Here For You
          </p>
          <h2
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 'clamp(26px, 4vw, 38px)',
              fontWeight: 300,
              lineHeight: 1.12,
              letterSpacing: '-0.02em',
              color: '#FAF6EF',
              margin: '0 0 16px 0',
            }}
          >
            Still have questions?
          </h2>
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.9375rem',
              lineHeight: 1.7,
              color: 'rgba(250, 246, 239, 0.6)',
              margin: '0 0 40px 0',
            }}
          >
            Our team is based in Kashmir and responds within a few hours.
            Reach us on email or WhatsApp.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '32px',
            }}
          >
            {/* Email Us */}
            <a
              href="mailto:admin@moonnaturallyyours.com"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: "'Manrope', sans-serif",
                fontSize: '0.875rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                padding: '14px 32px',
                borderRadius: '2px',
                border: '1.5px solid #C58A1E',
                backgroundColor: 'transparent',
                color: '#C58A1E',
                transition: 'all 220ms ease',
              }}
            >
              Email Us
            </a>

            {/* WhatsApp Us */}
            <a
              href="https://wa.me/916005099213"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: "'Manrope', sans-serif",
                fontSize: '0.875rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                padding: '14px 32px',
                borderRadius: '2px',
                border: '1.5px solid rgba(250, 246, 239, 0.3)',
                backgroundColor: 'transparent',
                color: '#FAF6EF',
                transition: 'all 220ms ease',
              }}
            >
              WhatsApp Us
            </a>
          </div>

          {/* Phone */}
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.875rem',
              color: 'rgba(250, 246, 239, 0.45)',
              letterSpacing: '0.04em',
              margin: 0,
            }}
          >
            +91-6005099213
          </p>
        </div>
      </section>
    </main>
  );
}
