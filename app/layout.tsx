import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MLB Stats 2026 — Weekly Leaderboards',
  description: 'Live 2026 MLB season leaderboards: Home Runs, OPS, and Strikeouts. Updated every Sunday.',
  keywords: 'MLB stats, baseball leaderboards, home runs, OPS, strikeouts, 2026 season',
  openGraph: {
    title: 'MLB Stats 2026 — Weekly Leaderboards',
    description: 'Top MLB performers for the 2026 season',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
