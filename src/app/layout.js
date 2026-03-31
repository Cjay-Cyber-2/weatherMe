import Script from "next/script";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "WeatherME | Simple Weather Search",
  description: "A simple react and redux weather application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="text-font">
        <Script src="https://cdn.lordicon.com/lordicon.js" />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
