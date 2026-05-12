import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | MOON Naturally Yours',
  description:
    'Learn how MOON Naturally Yours collects, uses, and protects your personal data in compliance with Indian privacy laws.',
  alternates: { canonical: 'https://www.moonnaturallyyours.com/privacy-policy' },
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

export default function PrivacyPolicyPage() {
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
          Privacy Policy
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
            At MOON Naturally Yours, we take your privacy seriously. This Privacy Policy describes
            how we collect, use, store, and protect your personal information when you visit our
            website or make a purchase from us. By using our website, you consent to the practices
            described in this policy.
          </p>

          {/* 1. Information We Collect */}
          <div style={sectionWrapStyle}>
            <h2 style={sectionHeadingStyle}>1. Information We Collect</h2>
            <p style={bodyParaStyle}>
              <strong>Personal identification information:</strong> When you create an account or
              place an order, we collect your name, email address, phone number, and shipping
              address. This information is necessary to process and deliver your orders and to
              communicate with you about them.
            </p>
            <p style={bodyParaStyle}>
              <strong>Browsing and device information:</strong> We automatically collect certain
              technical information when you visit our website, including your IP address, browser
              type and version, device type, operating system, referring URLs, and pages visited.
              This data is used solely for analytics purposes to help us improve your experience on
              our site.
            </p>
            <p style={bodyParaStyle}>
              <strong>Payment information:</strong> We do not collect or store your payment card
              details. All payment transactions are processed securely by Razorpay, our authorised
              payment gateway partner. Your financial data is handled exclusively by Razorpay in
              accordance with PCI-DSS standards.
            </p>
          </div>

          {/* 2. How We Use Your Information */}
          <div style={sectionWrapStyle}>
            <h2 style={sectionHeadingStyle}>2. How We Use Your Information</h2>
            <p style={bodyParaStyle}>
              We use the information we collect for the following purposes:
            </p>
            <p style={bodyParaStyle}>
              <strong>Order fulfilment:</strong> To process your orders, arrange delivery, and
              provide you with order confirmations, shipping notifications, and tracking updates.
            </p>
            <p style={bodyParaStyle}>
              <strong>Customer support:</strong> To respond to your enquiries, resolve disputes, and
              address any issues you may have with your orders or our products.
            </p>
            <p style={bodyParaStyle}>
              <strong>Marketing communications:</strong> With your explicit consent, we may send you
              seasonal newsletters, product updates, and promotional offers. You may withdraw this
              consent at any time by clicking the unsubscribe link in any marketing email.
            </p>
            <p style={bodyParaStyle}>
              <strong>Website improvement:</strong> To analyse usage patterns, identify technical
              issues, and continuously improve the functionality and user experience of our website.
            </p>
            <p style={bodyParaStyle}>
              <strong>Legal compliance:</strong> To comply with applicable Indian laws and
              regulations, including GST reporting obligations, consumer protection requirements, and
              any lawful requests from government authorities.
            </p>
          </div>

          {/* 3. Data Sharing */}
          <div style={sectionWrapStyle}>
            <h2 style={sectionHeadingStyle}>3. Data Sharing</h2>
            <p style={bodyParaStyle}>
              We do not sell, rent, or trade your personal data to third parties for their
              independent marketing purposes.
            </p>
            <p style={bodyParaStyle}>
              We share your data only with the following categories of service providers, strictly
              to the extent necessary to fulfil your orders and operate our business:
            </p>
            <p style={bodyParaStyle}>
              <strong>Payment processors:</strong> Razorpay receives transaction data to authorise
              and process your payments securely.
            </p>
            <p style={bodyParaStyle}>
              <strong>Shipping and logistics partners:</strong> We share your name, phone number,
              and delivery address with our courier partners (including Shiprocket and Delhivery) to
              arrange and track your deliveries.
            </p>
            <p style={bodyParaStyle}>
              <strong>Cloud infrastructure providers:</strong> Our website and data are hosted on
              Vercel (front-end deployment) and Supabase (database). These providers process data
              on our behalf under strict data processing agreements.
            </p>
            <p style={bodyParaStyle}>
              All third-party partners are bound by confidentiality obligations and are contractually
              prohibited from using your data for any purpose beyond the specific service they
              provide to us.
            </p>
          </div>

          {/* 4. Cookies */}
          <div style={sectionWrapStyle}>
            <h2 style={sectionHeadingStyle}>4. Cookies</h2>
            <p style={bodyParaStyle}>
              Our website uses cookies — small text files stored on your device — to enhance your
              browsing experience.
            </p>
            <p style={bodyParaStyle}>
              <strong>Essential cookies</strong> are strictly necessary for the website to function.
              They maintain your shopping cart contents and keep you logged in during your session.
              These cannot be disabled without affecting site functionality.
            </p>
            <p style={bodyParaStyle}>
              <strong>Analytics cookies</strong> collect anonymous information about how visitors
              use our website, such as which pages are visited most often. This data helps us
              improve our site and is never linked to your personal identity.
            </p>
            <p style={bodyParaStyle}>
              You can disable non-essential cookies at any time through your browser settings.
              Please note that disabling certain cookies may affect the performance of some features
              on our site.
            </p>
          </div>

          {/* 5. Data Retention */}
          <div style={sectionWrapStyle}>
            <h2 style={sectionHeadingStyle}>5. Data Retention</h2>
            <p style={bodyParaStyle}>
              We retain your data only for as long as necessary to fulfil the purposes for which it
              was collected, or as required by law:
            </p>
            <p style={bodyParaStyle}>
              <strong>Order and transaction data</strong> is retained for a minimum of 7 years in
              compliance with Goods and Services Tax (GST) statutory requirements under Indian
              tax law.
            </p>
            <p style={bodyParaStyle}>
              <strong>Account data</strong> is retained for as long as your account remains active.
              You may request deletion of your account and associated personal data at any time
              by contacting us at admin@moonnaturallyyours.com.
            </p>
            <p style={bodyParaStyle}>
              <strong>Marketing preferences and email data</strong> are retained until you
              unsubscribe from our communications or request removal, whichever occurs first.
            </p>
          </div>

          {/* 6. Your Rights */}
          <div style={sectionWrapStyle}>
            <h2 style={sectionHeadingStyle}>6. Your Rights</h2>
            <p style={bodyParaStyle}>
              You have the following rights with respect to your personal data:
            </p>
            <p style={bodyParaStyle}>
              <strong>Right to access:</strong> You may request a copy of the personal data we hold
              about you.
            </p>
            <p style={bodyParaStyle}>
              <strong>Right to correction:</strong> You may request that we correct any inaccurate
              or incomplete personal data.
            </p>
            <p style={bodyParaStyle}>
              <strong>Right to deletion:</strong> You may request that we delete your personal data,
              subject to any legal obligations that require us to retain it.
            </p>
            <p style={bodyParaStyle}>
              To exercise any of these rights, please contact us at{' '}
              <a
                href="mailto:admin@moonnaturallyyours.com"
                style={{ color: '#D2571B', textDecoration: 'underline' }}
              >
                admin@moonnaturallyyours.com
              </a>
              . We will respond to your request within 30 days.
            </p>
          </div>

          {/* 7. Children's Privacy */}
          <div style={sectionWrapStyle}>
            <h2 style={sectionHeadingStyle}>7. Children's Privacy</h2>
            <p style={bodyParaStyle}>
              Our website and services are not directed at persons under the age of 18. We do not
              knowingly collect personal information from children. If you believe that a child
              under 18 has provided us with personal information, please contact us immediately at
              admin@moonnaturallyyours.com and we will take prompt steps to delete such information.
            </p>
          </div>

          {/* 8. Changes to This Policy */}
          <div style={sectionWrapStyle}>
            <h2 style={sectionHeadingStyle}>8. Changes to This Policy</h2>
            <p style={bodyParaStyle}>
              We may update this Privacy Policy from time to time to reflect changes in our
              practices, technology, or legal requirements. For material changes — those that
              significantly affect how we collect or use your personal data — we will notify you
              by email to the address associated with your account prior to the change taking effect.
            </p>
            <p style={bodyParaStyle}>
              We encourage you to review this page periodically. The "Last updated" date at the top
              of this policy indicates when it was most recently revised. Continued use of our
              website after any changes constitutes your acceptance of the revised policy.
            </p>
          </div>

          {/* 9. Contact */}
          <div style={sectionWrapStyle}>
            <h2 style={sectionHeadingStyle}>9. Contact Us</h2>
            <p style={bodyParaStyle}>
              If you have any questions, concerns, or requests regarding this Privacy Policy or the
              handling of your personal data, please reach out to us:
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
