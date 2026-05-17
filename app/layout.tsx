import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CarMatch AI — Find Your Perfect Car',
  description: 'Answer 4 lifestyle questions. Get 3 cars shortlisted by a no-cost demo advisor. No spec-sheet required.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
