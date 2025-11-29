import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Work",
    description: "Explore the creative works and projects of Tejas.",
};

export default function WorkLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
