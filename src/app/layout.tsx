import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Vehicle Route Tracker',
  description: 'Track vehicle routes using GPS data',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-base-200 min-h-screen">
        <Navbar />
        <main className="py-6">{children}</main>
      </body>
    </html>
  );
}