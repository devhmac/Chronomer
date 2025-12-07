import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

import { TimerContextProvider } from "@/providers/TimerContext";
import Nav from "@/components/ui/Nav";
import { TaskContextProvider } from "@/providers/TaskContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chronomer",
  description: "A live Co-working platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="dots dark:dark-dots">
            {/* 434956 or 383d47 for darkmode? #e5e7eb light mode */}
          </div>
          <Nav />
          <TimerContextProvider>
            <TaskContextProvider>{children}</TaskContextProvider>
          </TimerContextProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
