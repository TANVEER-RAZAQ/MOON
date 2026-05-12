import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy | MOON Naturally Yours',
  description:
    'Understand how MOON Naturally Yours ships your orders across India — delivery timelines, packaging, tracking, and free shipping thresholds.',
  alternates: { canonical: 'https://www.moonnaturallyyours.com/shipping-policy' },
};

// ── Design tokens ─────────────────────────────────────────────────────────────
const token = {
  paper: '#FAF6EF',
  paperMid: '#F4EDE2',
  dark: '#0B0806',
  saffron: '#D2571B',
  amber: '#C58A1E',
  muted: '#4A3E31',
  fraunces: "'Fraunces', 'Cormorant Garamond', Georgia, serif",
  manrope: "'Manrope', ui-sans-serif, system-ui, sans-serif",
} as const;

// ── Info cards data ───────────────────────────────────────────────────────────
const infoCards = [
  {
    icon: '₹',
    title: 'Free Shipping',
    body: 'On orders above ₹999 across India',
  },
  {
    icon: '📦',
    title: 'Dispatch Time',
    body: '1–2 business days from order confirmation',
  },
  {
    icon: '🚚',
    title: 'Standard Delivery',
    body: '4–7 business days pan-India',
  },
  {
    icon: '⚡',
    title: 'Express Delivery',
    body: '2–3 business days (select pin codes)',
  },
] as const;

// ── Policy sections data ──────────────────────────────────────────────────────
const policySections = [
  {
    heading: 'Order Processing',
    content: [
      'Orders placed before 2 PM IST on business days are processed the same day. Orders placed after 2 PM or on weekends/holidays are processed the next business day.',
      'You will receive an email confirmation with order details and a separate dispatch notification with tracking link.',
    ],
  },
  {
    heading: 'Shipping Coverage',
    content: [
      'We currently ship to all pin codes across India via our logistics partners (Shiprocket, Delhivery, DTDC). We do not currently ship internationally — international shipping is coming soon.',
      'For remote pin codes, delivery may take up to 10 business days.',
    ],
  },
  {
    heading: 'Shipping Charges',
    content: [
      'Free shipping on orders above ₹999.',
      'For orders below ₹999: ₹60 flat shipping fee.',
      'Express shipping (where available): ₹120 additional charge.',
      'COD orders: additional ₹40 COD handling fee.',
    ],
  },
  {
    heading: 'Special Packaging for Fragile Products',
    content: [
      'Saffron is sealed in airtight glass vials with protective bubble wrap and cardboard. Honey and ghee jars are double-wrapped and placed in leak-proof pouches inside the shipping box. Shilajit is sealed in tamper-evident glass jars.',
      'We take extreme care to prevent breakage — in the rare event of transit damage, we replace the product at no cost.',
    ],
  },
  {
    heading: 'Tracking Your Order',
    content: [
      'Once dispatched, you will receive an SMS and email with a tracking link. You can also track your order at your carrier\'s website.',
      'If you have not received a tracking update within 3 business days of dispatch, please contact us.',
    ],
  },
  {
    heading: 'Failed Delivery Attempts',
    content: [
      'Our carrier will attempt delivery up to 3 times. After 3 failed attempts, the package is returned to us.',
      'We will contact you to arrange re-delivery. Additional shipping charges may apply for re-delivery.',
    ],
  },
  {
    heading: 'Lost or Damaged Shipments',
    content: [
      'If your order is lost in transit or arrives damaged, contact us within 48 hours of the expected delivery date with your order number and photos of damaged packaging.',
      'We will file a claim with the carrier and send a replacement within 5–7 business days.',
    ],
  },
  {
    heading: 'Cash on Delivery (COD)',
    content: [
      'COD is available across most pin codes. Please keep exact change ready. COD payments must be made to the delivery agent in cash only.',
      'We reserve the right to disable COD for accounts with repeated refused deliveries.',
    ],
  },
  {
    heading: 'Contact for Shipping Queries',
    content: [
      'Email: admin@moonnaturallyyours.com',
      'Phone: +91-6005099213 (Mon–Sat, 10 AM – 6 PM IST)',
      'WhatsApp: +91-6005099213',
    ],
  },
] as const;

export default function ShippingPolicyPage() {
  return (
    <main style={{ fontFamily: token.manrope }}>

      {/* ── Section 1: Hero ─────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: token.dark,
          minHeight: '40vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 'clamp(60px,10vw,100px) 24px',
        }}
      >
        {/* Eyebrow */}
        <p
          style={{
            fontFamily: token.manrope,
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(245,239,230,0.5)',
            margin: '0 0 20px 0',
          }}
        >
          Last updated: May 2026
        </p>

        {/* Heading */}
        <h1
          style={{
            fontFamily: token.fraunces,
            fontSize: 'clamp(36px,6vw,56px)',
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: '#FFFFFF',
            margin: '0 0 20px 0',
          }}
        >
          Shipping Policy
        </h1>

        {/* Subtext */}
        <p
          style={{
            fontFamily: token.fraunces,
            fontStyle: 'italic',
            fontSize: 'clamp(16px,2vw,20px)',
            fontWeight: 300,
            color: token.amber,
            letterSpacing: '-0.01em',
            maxWidth: '520px',
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          We ship with care, so every product arrives as intended.
        </p>
      </section>

      {/* ── Section 2: Key Shipping Facts (info cards grid) ─────────────── */}
      <section
        style={{
          backgroundColor: token.paperMid,
          padding: 'clamp(40px,6vw,60px) clamp(20px,5vw,40px)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
            }}
          >
            {infoCards.map((card) => (
              <div
                key={card.title}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(11,8,6,0.08)',
                  borderRadius: '2px',
                  padding: '24px',
                }}
              >
                {/* Icon circle */}
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: token.amber,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: token.manrope,
                      fontSize: '14px',
                      fontWeight: 700,
                      color: token.dark,
                      lineHeight: 1,
                    }}
                  >
                    {card.icon}
                  </span>
                </div>

                {/* Card title */}
                <h3
                  style={{
                    fontFamily: token.fraunces,
                    fontSize: '18px',
                    fontWeight: 400,
                    lineHeight: 1.2,
                    letterSpacing: '-0.01em',
                    color: token.dark,
                    margin: '0 0 8px 0',
                  }}
                >
                  {card.title}
                </h3>

                {/* Card body */}
                <p
                  style={{
                    fontFamily: token.manrope,
                    fontSize: '14px',
                    lineHeight: 1.6,
                    color: token.muted,
                    margin: 0,
                  }}
                >
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Full Policy Content ──────────────────────────────── */}
      <section
        style={{
          backgroundColor: token.paper,
          padding: 'clamp(40px,8vw,80px) clamp(20px,5vw,40px)',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {policySections.map((section) => (
            <div
              key={section.heading}
              style={{
                borderLeft: `3px solid ${token.amber}`,
                paddingLeft: '24px',
                marginBottom: '40px',
              }}
            >
              <h2
                style={{
                  fontFamily: token.fraunces,
                  fontSize: 'clamp(20px,3vw,26px)',
                  fontWeight: 400,
                  lineHeight: 1.2,
                  letterSpacing: '-0.01em',
                  color: token.dark,
                  margin: '0 0 16px 0',
                }}
              >
                {section.heading}
              </h2>

              {section.content.map((para, idx) => (
                <p
                  key={idx}
                  style={{
                    fontFamily: token.manrope,
                    fontSize: '16px',
                    lineHeight: 1.75,
                    color: token.muted,
                    margin: '0 0 1rem 0',
                  }}
                >
                  {para}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 4: CTA ──────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: token.dark,
          textAlign: 'center',
          padding: '60px 24px',
        }}
      >
        {/* Heading */}
        <h2
          style={{
            fontFamily: token.fraunces,
            fontSize: '28px',
            fontWeight: 300,
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            color: '#FFFFFF',
            margin: '0 0 32px 0',
          }}
        >
          Questions about your order?
        </h2>

        {/* Button row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            justifyContent: 'center',
            marginBottom: '28px',
          }}
        >
          {/* Email Us */}
          <a
            href="mailto:admin@moonnaturallyyours.com"
            style={{
              display: 'inline-block',
              backgroundColor: token.amber,
              color: token.dark,
              fontFamily: token.manrope,
              fontSize: '0.875rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              padding: '14px 36px',
              borderRadius: '2px',
            }}
          >
            Email Us
          </a>

          {/* Track Order */}
          <a
            href="#"
            style={{
              display: 'inline-block',
              backgroundColor: 'transparent',
              color: '#FFFFFF',
              fontFamily: token.manrope,
              fontSize: '0.875rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              padding: '14px 36px',
              borderRadius: '2px',
              border: '1px solid rgba(255,255,255,0.4)',
            }}
          >
            Track Order
          </a>
        </div>

        {/* WhatsApp link */}
        <p
          style={{
            fontFamily: token.manrope,
            fontSize: '14px',
            color: 'rgba(250,246,239,0.55)',
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          or{' '}
          <a
            href="https://wa.me/916005099213"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: token.amber,
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              fontWeight: 600,
            }}
          >
            WhatsApp us at +91-6005099213
          </a>
        </p>
      </section>
    </main>
  );
}
