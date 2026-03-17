import "./globals.css";

export const metadata = {
  title: "MegaTabs",
  description: "MegaTabs prototype",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
