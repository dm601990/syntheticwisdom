import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Toolkit - Explore Latest AI Models, Tools & Platforms | Synthetic Wisdom',
  description: 'Discover the most advanced AI models, tools, and platforms in our comprehensive toolkit. Stay updated with the latest in AI, including GPT-4.5, Claude 3.7, Gemini 2.5, and more.',
  keywords: 'AI toolkit, artificial intelligence, machine learning, GPT, Claude, Gemini, LLM, AI tools, AI models, AI platforms',
  openGraph: {
    title: 'AI Toolkit - Explore Latest AI Models, Tools & Platforms',
    description: 'Comprehensive collection of cutting-edge AI models, tools, and platforms for researchers, developers, and enthusiasts.',
    url: 'https://syntheticwisdom.com/toolkit',
    siteName: 'Synthetic Wisdom',
    images: [
      {
        url: '/images/toolkit-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Toolkit featured image',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Toolkit - Latest Models, Tools & Platforms',
    description: 'Explore our curated collection of cutting-edge AI resources.',
    images: ['/images/toolkit-og-image.jpg'],
  },
};

export default function ToolkitLayout({
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