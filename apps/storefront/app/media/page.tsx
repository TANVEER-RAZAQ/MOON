import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Media | MOON Naturally Yours — Press & Brand Resources",
  description:
    "Press coverage, brand resources, and media kit for MOON Naturally Yours — Kashmir's premium natural wellness brand.",
  alternates: { canonical: 'https://www.moonnaturallyyours.com/media' },
};

export default function MediaPage() {
  return (
    <main style={{ fontFamily: "'Manrope', ui-sans-serif, system-ui, sans-serif" }}>

      {/* ── Section 1: Hero ─────────────────────────────────────────── */}
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
          Press & Resources
        </p>
        <h1
          style={{
            fontFamily: "'Fraunces', 'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(40px, 7vw, 64px)',
            fontWeight: 300,
            lineHeight: 1.02,
            letterSpacing: '-0.02em',
            color: '#FAF6EF',
            margin: '0 0 24px 0',
          }}
        >
          Media & Press
        </h1>
        <p
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: 'clamp(15px, 2vw, 18px)',
            lineHeight: 1.6,
            color: 'rgba(250,246,239,0.55)',
            maxWidth: '480px',
            margin: 0,
          }}
        >
          Resources for journalists, bloggers, and brand partners.
        </p>
      </section>

      {/* ── Section 2: Press Mentions ────────────────────────────────── */}
      <section
        style={{
          backgroundColor: '#FAF6EF',
          padding: '80px 24px',
        }}
      >
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: '0.6875rem',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: '#D2571B',
                marginBottom: '16px',
              }}
            >
              In the Press
            </p>
            <h2
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(26px, 4vw, 36px)',
                fontWeight: 300,
                lineHeight: 1.12,
                letterSpacing: '-0.01em',
                color: '#0B0806',
                margin: 0,
              }}
            >
              What the World is Saying
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {[
              {
                quote:
                  'MOON is redefining what authenticity means in the wellness space.',
                publication: 'The Kashmir Observer',
              },
              {
                quote: 'A brand that lets the product speak for itself.',
                publication: 'India Wellness Report',
              },
              {
                quote: 'From mountain to market without compromise.',
                publication: 'Valley Naturals Magazine',
              },
            ].map((item) => (
              <div
                key={item.publication}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(11,8,6,0.08)',
                  borderRadius: '2px',
                  padding: '40px 32px',
                  boxShadow: '0 4px 14px rgba(42,27,16,0.06)',
                  position: 'relative',
                }}
              >
                {/* Amber accent line */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '32px',
                    right: '32px',
                    height: '2px',
                    backgroundColor: '#C58A1E',
                    borderRadius: '0 0 2px 2px',
                  }}
                />
                {/* Large quotation mark */}
                <div
                  style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontSize: '4rem',
                    lineHeight: 1,
                    color: 'rgba(197,138,30,0.2)',
                    marginBottom: '8px',
                    fontStyle: 'italic',
                  }}
                >
                  "
                </div>
                <blockquote
                  style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontStyle: 'italic',
                    fontSize: '1.25rem',
                    fontWeight: 300,
                    lineHeight: 1.4,
                    letterSpacing: '-0.01em',
                    color: '#0B0806',
                    margin: '0 0 28px 0',
                  }}
                >
                  {item.quote}
                </blockquote>
                <p
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#D2571B',
                    margin: 0,
                  }}
                >
                  — {item.publication}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Brand Assets ──────────────────────────────────── */}
      <section
        style={{
          backgroundColor: '#F4EDE2',
          padding: '80px 24px',
        }}
      >
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: '0.6875rem',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: '#D2571B',
                marginBottom: '16px',
              }}
            >
              Downloads
            </p>
            <h2
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(26px, 4vw, 36px)',
                fontWeight: 300,
                lineHeight: 1.12,
                letterSpacing: '-0.01em',
                color: '#0B0806',
                margin: 0,
              }}
            >
              Brand Resources
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
              marginBottom: '48px',
            }}
          >
            {[
              {
                icon: 'LG',
                iconBg: '#D2571B',
                title: 'Brand Logo',
                formats: 'SVG + PNG formats',
                desc: 'Primary and secondary wordmarks in all colour variants. Suitable for digital and print.',
              },
              {
                icon: 'PH',
                iconBg: '#C58A1E',
                title: 'Product Photography',
                formats: 'High-resolution JPEG / TIFF',
                desc: 'Lifestyle and product flat-lay images of our Saffron, Shilajit, and Honey on a paper-white background.',
              },
              {
                icon: 'CP',
                iconBg: '#5A3921',
                title: 'Brand Colour Palette',
                formats: 'HEX · RGB · CMYK',
                desc: 'Saffron #D2571B · Amber #C58A1E · Paper #FAF6EF · Ink #0B0806. Official values for editorial use.',
              },
              {
                icon: 'FB',
                iconBg: '#6B855A',
                title: 'Founder Bio & Headshot',
                formats: 'PDF · PNG (300 dpi)',
                desc: 'Approved biography and portrait of our founder for press profiles and brand partnerships.',
              },
            ].map((asset) => (
              <div
                key={asset.title}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(11,8,6,0.08)',
                  borderRadius: '2px',
                  padding: '28px 24px',
                  boxShadow: '0 1px 2px rgba(42,27,16,0.04)',
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    minWidth: '44px',
                    borderRadius: '50%',
                    backgroundColor: asset.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Fraunces', Georgia, serif",
                      fontStyle: 'italic',
                      fontSize: '0.75rem',
                      color: '#FAF6EF',
                      fontWeight: 300,
                    }}
                  >
                    {asset.icon}
                  </span>
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Fraunces', Georgia, serif",
                      fontSize: '1.0625rem',
                      fontWeight: 400,
                      lineHeight: 1.2,
                      color: '#0B0806',
                      margin: '0 0 4px 0',
                    }}
                  >
                    {asset.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: '0.6875rem',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: '#D2571B',
                      margin: '0 0 10px 0',
                      fontWeight: 600,
                    }}
                  >
                    {asset.formats}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      color: '#4A3E31',
                      margin: 0,
                    }}
                  >
                    {asset.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA: Request Media Kit */}
          <div style={{ textAlign: 'center' }}>
            <a
              href="mailto:admin@moonnaturallyyours.com?subject=Media%20Kit%20Request%20—%20MOON%20Naturally%20Yours"
              style={{
                display: 'inline-block',
                backgroundColor: '#0B0806',
                color: '#FAF6EF',
                fontFamily: "'Manrope', sans-serif",
                fontSize: '0.875rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                padding: '16px 48px',
                borderRadius: '2px',
              }}
            >
              Request Media Kit
            </a>
            <p
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: '0.8125rem',
                color: '#8A7A66',
                marginTop: '16px',
              }}
            >
              We typically respond within 1 business day.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 4: Contact for Press ────────────────────────────── */}
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
              marginBottom: '24px',
              opacity: 0.8,
            }}
          >
            Get in Touch
          </p>
          <h2
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 'clamp(24px, 3.5vw, 36px)',
              fontWeight: 300,
              lineHeight: 1.12,
              letterSpacing: '-0.01em',
              color: '#FAF6EF',
              margin: '0 0 16px 0',
            }}
          >
            Press Enquiries
          </h2>
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '1rem',
              lineHeight: 1.6,
              color: 'rgba(250,246,239,0.55)',
              margin: '0 0 36px 0',
            }}
          >
            For interview requests, editorial collaborations, and press partnerships, reach us directly.
          </p>

          {/* Contact details */}
          <div
            style={{
              borderTop: '1px solid rgba(250,246,239,0.1)',
              borderBottom: '1px solid rgba(250,246,239,0.1)',
              padding: '32px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: '0.6875rem',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: '#8A7A66',
                  margin: '0 0 6px 0',
                }}
              >
                Email
              </p>
              <a
                href="mailto:admin@moonnaturallyyours.com"
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontStyle: 'italic',
                  fontSize: '1.25rem',
                  fontWeight: 300,
                  color: '#C58A1E',
                  textDecoration: 'none',
                  letterSpacing: '-0.01em',
                }}
              >
                admin@moonnaturallyyours.com
              </a>
            </div>
            <div>
              <p
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: '0.6875rem',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: '#8A7A66',
                  margin: '0 0 6px 0',
                }}
              >
                Phone
              </p>
              <a
                href="tel:+916005099213"
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontStyle: 'italic',
                  fontSize: '1.25rem',
                  fontWeight: 300,
                  color: '#FAF6EF',
                  textDecoration: 'none',
                  letterSpacing: '-0.01em',
                }}
              >
                +91-6005099213
              </a>
            </div>
          </div>

          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.8125rem',
              color: 'rgba(250,246,239,0.35)',
              marginTop: '32px',
            }}
          >
            Kanispora, Baramulla, Jammu & Kashmir — 193101
          </p>
        </div>
      </section>
    </main>
  );
}
