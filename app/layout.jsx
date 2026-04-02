import "./main.scss"
import AppThemeProvider from '@/style-library/context/ThemeProvider'

export const metadata = {
  title: "MegaTabs",
  description: "MegaTabs prototype v1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behaviour="smooth" suppressHydrationWarning>
      <body>
		<AppThemeProvider>
        	{children}
		</AppThemeProvider>
      </body>
    </html>
  );
}
