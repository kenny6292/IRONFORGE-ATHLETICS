import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
 title: { default: "IRONFORGE ATHLETICS | Build Your Strongest Self", template: "%s | IRONFORGE ATHLETICS" },
 description: "Premium strength, conditioning, personal training and performance.",
 keywords: ["gym","fitness","strength training","personal training","conditioning","IRONFORGE ATHLETICS"],
 robots: { index: true, follow: true },
 openGraph: { title: "IRONFORGE ATHLETICS | Build Your Strongest Self", description: "Premium strength, conditioning, personal training and performance.", type: "website" }
};

export default function RootLayout({children}:{children:React.ReactNode}) {
 return <html lang="en"><body>{children}</body></html>;
}