import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | MOON Naturally Yours',
  description:
    'Read the terms and conditions governing your use of the MOON Naturally Yours website and purchase of our products.',
  alternates: { canonical: 'https://www.moonnaturallyyours.com/terms' },
};

// ── Shared style constants ──────────────────────────────────────────────────

const sectionHeadingStyle: React.CSSProperties = {
  fontFamily: "'Fraunces', 'Cormorant Garamond', Georgia, serif",
  fontSize: 'clamp(20px, 3vw, 26px)',
  fontWeight: 400,
  letterSpacing: '-0.01em',
  color: '#0B0806',
  margin: '2.5rem 0 1rem',
  borderBottom: '1px solid rgba(11,8,6,0.1)',
  paddingBottom: '0.5rem',
  lineHeight: 1.2,
};

const bodyParaStyle: React.CSSProperties = {
  fontFamily: "'Manrope', ui-sans-serif, system-ui, sans-serif",
  fontSize: '16px',
  color: '#4A3E31',
  lineHeight: 1.75,
  margin: '0 0 1rem',
};

const sectionWrapStyle: React.CSSProperties = {
  borderLeft: '3px solid #C58A1E',
  paddingLeft: '1.25rem',
  marginBottom: '0.5rem',
};

// ── Page ───────────────────────────────────────────────────────────────────

export default function TermsPage() {
  return (
    <main style={{ fontFamily: "'Manrope', ui-sans-serif, system-ui, sans-serif" }}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: '#0B0806',
          minHeight: '40vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 'clamp(48px,8vw,80px) clamp(20px,5vw,40px)',
        }}
      >
        <p
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '0.6875rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#C58A1E',
            opacity: 0.8,
            marginBottom: '20px',
          }}
        >
          MOON Naturally Yours
        </p>
        <h1
          style={{
            fontFamily: "'Fraunces', 'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(36px, 6vw, 56px)',
            fontWeight: 300,
            lineHeight: 1.04,
            letterSpacing: '-0.02em',
            color: '#FAF6EF',
            margin: '0 0 20px 0',
          }}
        >
          Terms &amp; Conditions
        </h1>
        <p
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: 'clamp(14px, 1.5vw, 16px)',
            color: '#C58A1E',
            opacity: 0.7,
            margin: 0,
            letterSpacing: '0.04em',
          }}
        >
          Last updated: May 2026
        </p>
      </section>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: '#FAF6EF',
          padding: 'clamp(40px,8vw,80px) clamp(20px,5vw,40px)',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>

          <p style={{ ...bodyParaStyle, marginBottom: '2rem' }}>
            These Terms and Conditions ("Terms") govern your access to and use of the MOON Naturally
            Yours website at moonnaturallyyours.com and any purchases you make through it. Please
            read them carefully before using our site or placing an order.
          </p>

          {/* 1. Acceptance of Terms */}
          <div style={sectionWrapStyle}>
            <h2 style={sectionHeadingStyle}>1. Acceptance of Terms</h2>
            <p style={bodyParaStyle}>
              By accessing or using this website, browsing our product catalogue, or placing an
              order, you confirm that you have read, understood, and agree to be bound by these
              Terms and our Privacy Policy, which is incorporated herein by reference.
            </p>
            <p style={bodyParaStyle}>
              If you do not agree to these Terms in their entirety, you must discontinue use of
              this website immediately. We reserve the right to update these Terms at any time;
              continued use of the site following any changes constitutes your acceptance of the
              revised Terms.
            </p>
          </div>

          {/* 2. Products & Pricing */}
          <div style={sectionWrapStyle}>
            <h2 style={sectionHeadingStyle}>2. Products &amp; Pricing</h2>
            <p style={bodyParaStyle}>
              All product prices displayed on our website are in Indian Rupees (INR) and are
              inclusive of all applicable taxes, including GST, unless expressly stated otherwise.
            </p>
            <p style={bodyParaStyle}>
              Prices are subject to change without prior notice. We reserve the right to modify
              pricing at any time, but any price changes will not affect orders that have already
              been confirmed by us in writing.
            </p>
            <p style={bodyParaStyle}>
              Product images on our website are for illustrative purposes only. As all our products
              are sourced from nature and may vary by harvest season, batch, and region, the actual
              product you receive may differ slightly in colour, texture, or appearance from images
              shown. This natural variation is a hallmark of genuine, unadulterated products and
              does not constitute a defect or misrepresentation.
            </p>
          </div>

          {/* 3. Orders & Payment */}
          <div style={sectionWrapStyle}>
            <h2 style={sectionHeadingStyle}>3. Orders &amp; Payment</h2>
            <p style={bodyParaStyle}>
              Placing an item in your cart does not constitute a confirmed order. An order is
              considered confirmed and a contract formed between you and MOON Naturally Yours only
              upon successful receipt and processing of your payment.
            </p>
            <p style={bodyParaStyle}>
              We reserve the right to cancel or refuse any order, including confirmed orders, if
              the product is found to be out of stock, if there is an error in pricing or product
              description, or if we suspect fraudulent activity. In such cases, you will receive a
              full refund of any amount paid within 7 business days.
            </p>
            <p style={bodyParaStyle}>
              Payment is processed securely through Razorpay. We accept UPI, credit and debit
              cards, net banking, and Cash on Delivery (COD) where available. By providing your
              payment details, you confirm that you are authorised to use the selected payment
              method.
            </p>
          </div>

          {/* 4. Shipping */}
          <div style={sectionWrapStyle}>
            <h2 style={sectionHeadingStyle}>4. Shipping</h2>
            <p style={bodyParaStyle}>
              We ship to addresses across India. Delivery timelines provided at checkout are
              estimates only and are not guaranteed. Actual delivery times may vary depending on
              your location, courier availability, and circumstances beyond our control such as
              public holidays, extreme weather, or logistical disruptions.
            </p>
            <p style={bodyParaStyle}>
              For full details regarding shipping zones, timelines, and charges, please refer to
              our Shipping Policy page.
            </p>
            <p style={bodyParaStyle}>
              Risk of loss and title for products purchased from MOON Naturally Yours pass to you
              upon dispatch of the order to our courier partner. Once the order has been handed to
              the carrier, we are not liable for delays, loss, or damage in transit, though we will
              make reasonable efforts to assist you in resolving any such issues.
            </p>
          </div>

          {/* 5. Returns & Refunds */}
          <div style={sectionWrapStyle}>
            <h2 style={sectionHeadingStyle}>5. Returns &amp; Refunds</h2>
            <p style={bodyParaStyle}>
              We want you to be completely satisfied with your purchase. We accept returns of
              unopened, unused products in their original packaging within 7 days of the delivery
              date.
            </p>
            <p style={bodyParaStyle}>
              If you receive a product that is damaged, defective, or materially different from
              what was ordered, please contact us within 48 hours of delivery at
              admin@moonnaturallyyours.com with clear photographs of the item and its packaging. We
              will assess your claim and, where valid, arrange a replacement or full refund at
              no additional cost to you.
            </p>
            <p style={bodyParaStyle}>
              Approved refunds are processed within 7–10 business days to the original payment
              method. The exact timing of the credit to your account may vary depending on your
              bank or payment provider.
            </p>
            <p style={bodyParaStyle}>
              <strong>Please note:</strong> Perishable or consumable products — including saffron,
              honey, and shilajit — cannot be accepted for return once opened or unsealed, unless
              the product is defective or was incorrectly supplied. This policy exists to protect
              the integrity and safety of our food-grade products.
            </p>
          </div>

          {/* 6. Intellectual Property */}
          <div style={sectionWrapStyle}>
            <h2 style={sectionHeadingStyle}>6. Intellectual Property</h2>
            <p style={bodyParaStyle}>
              All content on this website — including but not limited to text, product descriptions,
              photography, graphics, videos, logos, brand identity elements, and the overall site
              design — is the exclusive intellectual property of MOON Naturally Yours and is
              protected by applicable Indian and international copyright, trademark, and intellectual
              property laws.
            </p>
            <p style={bodyParaStyle}>
              You may not copy, reproduce, distribute, publish, transmit, modify, or create
              derivative works from any content on this site without prior written permission from
              MOON Naturally Yours. Any unauthorised use of our intellectual property may result in
              legal action.
            </p>
          </div>

          {/* 7. Limitation of Liability */}
          <div style={sectionWrapStyle}>
            <h2 style={sectionHeadingStyle}>7. Limitation of Liability</h2>
            <p style={bodyParaStyle}>
              To the maximum extent permitted by applicable law, MOON Naturally Yours' total
              liability to you for any claim arising out of or in connection with these Terms or
              your use of our website or products shall be limited to the value of the specific
              order giving rise to the claim.
            </p>
            <p style={bodyParaStyle}>
              MOON Naturally Yours shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages, including loss of profits, loss of data, or
              loss of goodwill, arising out of or in connection with your use of our website,
              products, or services, even if we have been advised of the possibility of such damages.
            </p>
            <p style={bodyParaStyle}>
              Nothing in these Terms excludes or limits liability for death or personal injury
              caused by our negligence, or for any other liability that cannot be excluded or
              limited under applicable law.
            </p>
          </div>

          {/* 8. Governing Law */}
          <div style={sectionWrapStyle}>
            <h2 style={sectionHeadingStyle}>8. Governing Law &amp; Jurisdiction</h2>
            <p style={bodyParaStyle}>
              These Terms and Conditions are governed by and construed in accordance with the laws
              of India. Any disputes, claims, or controversies arising out of or relating to these
              Terms, your use of our website, or any purchase made through it shall be subject to
              the exclusive jurisdiction of the courts located in Baramulla, Jammu &amp; Kashmir,
              India.
            </p>
            <p style={bodyParaStyle}>
              We encourage you to contact us first to resolve any concerns informally before
              initiating formal legal proceedings. We are committed to addressing your concerns
              promptly and fairly.
            </p>
          </div>

          {/* 9. Contact */}
          <div style={sectionWrapStyle}>
            <h2 style={sectionHeadingStyle}>9. Contact Us</h2>
            <p style={bodyParaStyle}>
              For any questions about these Terms and Conditions or to raise a concern related to
              an order or your experience with MOON Naturally Yours, please contact us:
            </p>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(11,8,6,0.08)',
                borderRadius: '2px',
                padding: '24px 28px',
                marginTop: '0.5rem',
                marginBottom: '1rem',
              }}
            >
              <p
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: '1.125rem',
                  fontWeight: 400,
                  color: '#0B0806',
                  margin: '0 0 12px 0',
                  letterSpacing: '-0.01em',
                }}
              >
                MOON Naturally Yours
              </p>
              <p style={{ ...bodyParaStyle, margin: '0 0 6px 0' }}>
                Kanispora, Baramulla, Jammu &amp; Kashmir — 193101
              </p>
              <p style={{ ...bodyParaStyle, margin: '0 0 6px 0' }}>
                Email:{' '}
                <a
                  href="mailto:admin@moonnaturallyyours.com"
                  style={{ color: '#D2571B', textDecoration: 'underline' }}
                >
                  admin@moonnaturallyyours.com
                </a>
              </p>
              <p style={{ ...bodyParaStyle, margin: 0 }}>
                Phone:{' '}
                <a
                  href="tel:+916005099213"
                  style={{ color: '#D2571B', textDecoration: 'underline' }}
                >
                  +91-6005099213
                </a>
              </p>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
