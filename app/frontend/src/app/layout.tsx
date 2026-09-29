import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AetherGrid — Cloud Engineering Platform',
  description: 'AetherGrid Control Plane: Engineering the Invisible. Containerized cloud platform demonstrating modern CI/CD, AWS Fargate, ALB, and RDS architecture.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
