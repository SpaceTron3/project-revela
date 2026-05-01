import './globals.css'

export const metadata = {
  title: 'Project Revela — Know Who You\'re Really Voting For',
  description: 'Project Revela delivers clear, verified, nonpartisan information on every candidate running for office — from the presidency to your local school board.',
  openGraph: {
    title: 'Project Revela',
    description: 'Transparent candidate information for every American voter.',
    url: 'https://projectrevela.org',
    siteName: 'Project Revela',
    images: [{ url: '/og-image.png' }],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
