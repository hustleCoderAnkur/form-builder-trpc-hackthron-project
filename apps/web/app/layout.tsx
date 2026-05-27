import "./globals.css";

import { Toaster } from "sonner";

import { GlobalProviders } from "~/providers/global";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-black text-white min-h-screen">
        <GlobalProviders>
          {children}

          <Toaster
            richColors
            position="top-right"
          />
        </GlobalProviders>
      </body>
    </html>
  );
}
