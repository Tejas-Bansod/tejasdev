import type { Metadata } from "next";
import "./globals.css";
import SmoothScrolling from "./components/lenis/SmoothScrolling";
import { Cursor } from "./components/cursor/cursor";
import { TransitionProvider } from "./context/TransitionContext";
import PageTransition from "./components/PageTransition/PageTransition";
import HelloPreloader from "./components/HelloPreloader/HelloPreloader";

export const metadata: Metadata = {
  title: {
    template: '%s | Tejas',
    default: 'Tejas | Creative Developer',
  },
  description: "Portfolio of Tejas, a creative developer based in India specializing in design and technology.",
  keywords: ["Creative Developer", "Web Development", "UI/UX", "React", "Next.js", "Three.js", "GSAP"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TransitionProvider>
          <Cursor />
          <HelloPreloader />
          <PageTransition />
          <SmoothScrolling>
            {children}
          </SmoothScrolling>
        </TransitionProvider>
      </body>
    </html>
  );
}
