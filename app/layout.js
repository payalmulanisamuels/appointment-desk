import { Geist } from "next/font/google";
import "./globals.css";

// Next.js downloads this Google font at build time and serves it from our own site
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Text shown in the browser tab and in search results
export const metadata = {
  title: "Appointment Desk | Samuels Consultancy",
  description: "Appointment management dashboard for a clinic receptionist.",
};

// The root layout wraps EVERY page: it is the <html> and <body> of the app
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} antialiased`}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
