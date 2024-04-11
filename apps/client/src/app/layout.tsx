import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TimerContextProvider } from "@/context/TimerContext";
import Nav from "@/components/ui/Nav";
import { TaskContextProvider } from "@/context/TaskContext";

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
      <body className={inter.className}>
        {/* <div class="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div> */}

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
      </body>
    </html>
  );
}
