import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import GlobalChatbot from '@/components/GlobalChatbot';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Smart Study Buddy',
  description: 'AI-powered exam and placement preparation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        {/* Global Chatbot - Available on all pages */}
        <GlobalChatbot />
      </body>
    </html>
  );
}
