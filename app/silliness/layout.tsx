import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Simulated Silliness - Fun AI Fails & Creative Experiments | Synthetic Wisdom',
  description: 'Explore the lighter side of AI with funny fails, bizarre image generations, creative remixes, and wonderfully weird AI experiments. Your daily dose of AI humor!',
  keywords: 'AI humor, ChatGPT fails, AI art, funny AI, AI experiments, AI generated content, AI riddles, Simulated Silliness',
  openGraph: {
    title: 'Simulated Silliness - Fun AI Fails & Creative Experiments',
    description: 'Explore the lighter side of AI with funny fails, bizarre image generations, and wonderfully weird AI experiments.',
    url: 'https://syntheticwisdom.com/silliness',
    siteName: 'Synthetic Wisdom',
    images: [
      {
        url: '/images/silliness-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Simulated Silliness - Fun AI Fails',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Simulated Silliness - Fun AI Fails & Creative Experiments',
    description: 'Explore the lighter side of AI and machine learning.',
    images: ['/images/silliness-og-image.jpg'],
  },
};

export default function SillinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {children}
    </section>
  );
} 