import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About",
    description: "Learn more about Tejas, a creative developer based in India.",
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
