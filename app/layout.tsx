import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "IRONFORGE ATHLETICS | Build Your Strongest Self", description: "Premium strength, conditioning, personal training and performance." };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }