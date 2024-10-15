export const metadata = {
  title: 'Liam\'s Gallery',
  description: 'Gallery Project Created For Comedy Underground Overground',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
