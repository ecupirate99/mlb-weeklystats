import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Quintin\'s Latest MLB Stats',
  description: 'Live daily leaderboard for the 2026 MLB season.',
  keywords: 'MLB stats, baseball leaderboards, home runs, OPS, strikeouts, 2026 season',
  openGraph: {
    title: 'Quintin\'s Latest MLB Stats',
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
