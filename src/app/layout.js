import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "WeatherMEE | Simple Weather Search",
  description: "A simple react and redux weather application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="text-font">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
