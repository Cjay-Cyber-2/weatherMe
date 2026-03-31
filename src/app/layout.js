import { Inter, Lobster_Two } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const lobsterTwo = Lobster_Two({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-lobster-two",
});

export const metadata = {
  title: "WeatherME | Simple Weather Search",
  description: "A simple react and redux weather application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${lobsterTwo.variable} text-font`}>
        <Script src="https://cdn.lordicon.com/lordicon.js" />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
