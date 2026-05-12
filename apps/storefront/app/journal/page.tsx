import type { Metadata } from 'next';
import { journalPosts } from '@/lib/data/journal';
import { JournalCard } from '@/components/JournalCard';

export const metadata: Metadata = {
  title: 'Journal | MOON Naturally Yours — Stories from the Kashmir Valley',
  description:
    'Explore stories about Kashmiri saffron, shilajit, honey, and the ancient wellness traditions of the Kashmir Valley. Evidence-based articles from MOON Naturally Yours.',
  keywords:
    'Kashmir wellness journal, saffron blog, shilajit guide, Kashmiri natural products articles',
  openGraph: {
    title: 'MOON Journal',
    description: 'Stories from the Kashmir Valley',
    url: 'https://www.moonnaturallyyours.com/journal',
  },
  alternates: {
    canonical: 'https://www.moonnaturallyyours.com/journal',
  },
};

const CATEGORIES = ['All', 'Knowledge', 'Wellness', 'Sourcing', 'Nutrition', 'Craft'];

export default function JournalPage() {
  return (
    <main style={{ backgroundColor: '#FAF6EF', minHeight: '100vh' }}>
      {/* Hero */}
      <section
        style={{
          backgroundColor: '#0B0806',
          padding: '100px 24px 80px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '12px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#C58A1E',
            marginBottom: '20px',
          }}
        >
          MOON Naturally Yours
        </p>
        <h1
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 'clamp(48px, 8vw, 72px)',
            fontWeight: 700,
            color: '#FAF6EF',
            margin: '0 0 20px',
            lineHeight: 1.1,
          }}
        >
          The Journal
        </h1>
        <p
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '18px',
            color: 'rgba(194,151,56,0.8)',
            maxWidth: '480px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          Stories, knowledge, and traditions from the Kashmir Valley.
        </p>
      </section>

      {/* Category Filter Bar */}
      <section
        style={{
          backgroundColor: '#F4EDE2',
          borderBottom: '1px solid rgba(31,24,17,0.1)',
          padding: '0 24px',
          overflowX: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0',
            maxWidth: '1100px',
            margin: '0 auto',
            alignItems: 'center',
          }}
        >
          {CATEGORIES.map((cat) => (
            <span
              key={cat}
              style={{
                display: 'inline-block',
                padding: '16px 20px',
                fontFamily: "'Manrope', sans-serif",
                fontSize: '13px',
                fontWeight: cat === 'All' ? 700 : 500,
                letterSpacing: '0.05em',
                color: cat === 'All' ? '#D2571B' : 'rgba(31,24,17,0.6)',
                borderBottom: cat === 'All' ? '2px solid #D2571B' : '2px solid transparent',
                cursor: 'default',
                whiteSpace: 'nowrap',
                transition: 'color 0.2s',
              }}
            >
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* Posts Grid */}
      <section
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '60px 24px 100px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '32px',
          }}
        >
          {journalPosts.map((post) => (
            <JournalCard key={post.slug} {...post} />
          ))}
        </div>
      </section>
    </main>
  );
}
