import "./globals.css";

export const metadata = {
  title: "Megatabs",
  description: "Megatabs prototype",
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
